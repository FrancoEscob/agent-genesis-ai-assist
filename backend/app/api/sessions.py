
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import SessionCreate, SessionResponse
from app.core.database import get_db
import uuid
from datetime import datetime

router = APIRouter()

def generate_session_id() -> str:
    timestamp = int(datetime.now().timestamp())
    unique_id = str(uuid.uuid4())[:8]
    return f"session_{timestamp}_{unique_id}"

def generate_system_prompt(session_data: dict) -> str:
    return f"""Eres un asistente de IA para {session_data['business_name']} ubicada en {session_data['location']}.

Información de la empresa:
- Nombre: {session_data['business_name']}
- Ubicación: {session_data['location']}
- Tipos de propiedades: {session_data['property_types']}
- Horarios: {session_data['working_hours']}
- Teléfono: {session_data['phone']}
{f"- Sitio web: {session_data['website']}" if session_data.get('website') else ''}

Tu trabajo es:
1. Responder consultas sobre propiedades disponibles
2. Proporcionar información de contacto y horarios
3. Ser amable y profesional
4. Capturar información de leads (nombre, teléfono, email, tipo de propiedad buscada)
5. NO inventar propiedades específicas - deriva a un agente humano para detalles

Siempre mantén un tono profesional pero cercano, y recuerda que representas a {session_data['business_name']}."""

@router.post("/", response_model=dict)
async def create_session(session_data: SessionCreate, db = Depends(get_db)):
    try:
        session_id = generate_session_id()
        system_prompt = generate_system_prompt(session_data.dict())
        
        async with await db.get_connection() as conn:
            # Insertar sesión
            await conn.execute("""
                INSERT INTO sessions (id, business_name, website, location, property_types, 
                                    working_hours, phone, api_provider, system_prompt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """, session_id, session_data.business_name, session_data.website,
                session_data.location, session_data.property_types, session_data.working_hours,
                session_data.phone, session_data.api_provider.value, system_prompt)
            
            # Crear configuración por defecto del agente
            await conn.execute("""
                INSERT INTO agent_configs (session_id) VALUES ($1)
            """, session_id)
            
            # Crear estadísticas iniciales
            await conn.execute("""
                INSERT INTO stats (session_id) VALUES ($1)
            """, session_id)
        
        return {"session_id": session_id, "status": "created"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creando sesión: {str(e)}")

@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str, db = Depends(get_db)):
    try:
        async with await db.get_connection() as conn:
            row = await conn.fetchrow("""
                SELECT * FROM sessions WHERE id = $1
            """, session_id)
            
            if not row:
                raise HTTPException(status_code=404, detail="Sesión no encontrada")
            
            return SessionResponse(
                id=row['id'],
                business_name=row['business_name'],
                website=row['website'],
                location=row['location'],
                property_types=row['property_types'],
                working_hours=row['working_hours'],
                phone=row['phone'],
                api_provider=row['api_provider'],
                created_at=row['created_at'],
                system_prompt=row['system_prompt']
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo sesión: {str(e)}")

@router.delete("/{session_id}")
async def delete_session(session_id: str, db = Depends(get_db)):
    try:
        async with await db.get_connection() as conn:
            # Eliminar en orden por las foreign keys
            await conn.execute("DELETE FROM stats WHERE session_id = $1", session_id)
            await conn.execute("DELETE FROM agent_configs WHERE session_id = $1", session_id)
            await conn.execute("DELETE FROM messages WHERE session_id = $1", session_id)
            
            result = await conn.execute("DELETE FROM sessions WHERE id = $1", session_id)
            
            if result == "DELETE 0":
                raise HTTPException(status_code=404, detail="Sesión no encontrada")
            
            return {"status": "deleted"}
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando sesión: {str(e)}")
