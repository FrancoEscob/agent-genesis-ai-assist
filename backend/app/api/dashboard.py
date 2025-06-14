
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import DashboardStats
from app.core.database import get_db

router = APIRouter()

@router.get("/{session_id}", response_model=DashboardStats)
async def get_dashboard_stats(session_id: str, db = Depends(get_db)):
    try:
        async with await db.get_connection() as conn:
            # Verificar que la sesión existe
            session_exists = await conn.fetchval("""
                SELECT id FROM sessions WHERE id = $1
            """, session_id)
            
            if not session_exists:
                raise HTTPException(status_code=404, detail="Sesión no encontrada")
            
            # Obtener estadísticas
            stats = await conn.fetchrow("""
                SELECT * FROM stats WHERE session_id = $1
            """, session_id)
            
            # Contar mensajes
            message_count = await conn.fetchval("""
                SELECT COUNT(*) FROM messages WHERE session_id = $1
            """, session_id)
            
            if stats:
                return DashboardStats(
                    session_id=session_id,
                    total_calls=stats['total_calls'],
                    total_minutes=stats['total_minutes'],
                    leads=stats['leads'],
                    scheduled_visits=stats['scheduled_visits'],
                    messages_count=message_count,
                    last_activity=stats['last_activity']
                )
            else:
                # Crear estadísticas por defecto si no existen
                await conn.execute("""
                    INSERT INTO stats (session_id) VALUES ($1)
                """, session_id)
                
                return DashboardStats(
                    session_id=session_id,
                    total_calls=0,
                    total_minutes=0,
                    leads=0,
                    scheduled_visits=0,
                    messages_count=message_count,
                    last_activity=None
                )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas: {str(e)}")

@router.post("/{session_id}/increment-calls")
async def increment_calls(session_id: str, minutes: int = 1, db = Depends(get_db)):
    try:
        async with await db.get_connection() as conn:
            await conn.execute("""
                UPDATE stats SET 
                    total_calls = total_calls + 1,
                    total_minutes = total_minutes + $2,
                    last_activity = CURRENT_TIMESTAMP
                WHERE session_id = $1
            """, session_id, minutes)
            
            return {"status": "updated", "calls_incremented": 1, "minutes_added": minutes}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error actualizando llamadas: {str(e)}")
