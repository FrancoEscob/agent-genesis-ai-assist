
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import CallSimulation
from app.core.database import get_db
import asyncio

router = APIRouter()

@router.post("/simulate")
async def simulate_call(call_data: CallSimulation, db = Depends(get_db)):
    try:
        # Verificar que la sesión existe
        async with await db.get_connection() as conn:
            session = await conn.fetchrow("""
                SELECT business_name, system_prompt FROM sessions WHERE id = $1
            """, call_data.session_id)
            
            if not session:
                raise HTTPException(status_code=404, detail="Sesión no encontrada")
        
        # Simular delay de procesamiento
        await asyncio.sleep(2)
        
        # Simular llamada exitosa (aquí iría la integración real con RetellAI/ElevenLabs)
        print(f"🔊 Simulando llamada para {session['business_name']} al {call_data.phone_number}")
        print(f"📝 Usando prompt: {session['system_prompt'][:100]}...")
        
        # Actualizar estadísticas
        async with await db.get_connection() as conn:
            await conn.execute("""
                UPDATE stats SET 
                    total_calls = total_calls + 1,
                    total_minutes = total_minutes + 3,
                    last_activity = CURRENT_TIMESTAMP
                WHERE session_id = $1
            """, call_data.session_id)
        
        return {
            "status": "success",
            "message": f"Llamada simulada exitosamente al {call_data.phone_number}",
            "call_duration": "3 minutos",
            "business_name": session['business_name']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simulando llamada: {str(e)}")

@router.get("/retell-config/{session_id}")
async def get_retell_config(session_id: str, db = Depends(get_db)):
    """Obtener configuración para integración con RetellAI"""
    try:
        async with await db.get_connection() as conn:
            session = await conn.fetchrow("""
                SELECT s.*, ac.* FROM sessions s 
                LEFT JOIN agent_configs ac ON s.id = ac.session_id 
                WHERE s.id = $1
            """, session_id)
            
            if not session:
                raise HTTPException(status_code=404, detail="Sesión no encontrada")
            
            return {
                "session_id": session_id,
                "system_prompt": session['system_prompt'],
                "voice_config": {
                    "provider": session['voice_provider'] or 'retell',
                    "voice_id": session['voice_id'] or 'default-voice'
                },
                "llm_config": {
                    "max_tokens": session['max_tokens'] or 1000,
                    "temperature": float(session['temperature']) if session['temperature'] else 0.7
                },
                "business_info": {
                    "name": session['business_name'],
                    "phone": session['phone'],
                    "location": session['location']
                }
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo configuración: {str(e)}")
