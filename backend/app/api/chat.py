
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ChatMessage, ChatResponse
from app.core.database import get_db
from app.core.langraph_agent import CallFlowAgent
import json
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def process_chat_message(chat_data: ChatMessage, db = Depends(get_db)):
    try:
        # Obtener datos de la sesión
        async with await db.get_connection() as conn:
            session_row = await conn.fetchrow("""
                SELECT * FROM sessions WHERE id = $1
            """, chat_data.session_id)
            
            if not session_row:
                raise HTTPException(status_code=404, detail="Sesión no encontrada")
            
            # Convertir row a dict
            session_data = dict(session_row)
            
            # Obtener historial de conversación reciente (últimos 10 mensajes)
            conversation_history = await conn.fetch("""
                SELECT content, sender, timestamp FROM messages 
                WHERE session_id = $1 
                ORDER BY timestamp DESC 
                LIMIT 10
            """, chat_data.session_id)
            
            # Guardar mensaje del usuario
            user_message_id = await conn.fetchval("""
                INSERT INTO messages (session_id, content, sender) 
                VALUES ($1, $2, $3) 
                RETURNING id
            """, chat_data.session_id, chat_data.message, chat_data.user_type)
        
        # Procesar con LangGraph
        agent = CallFlowAgent(session_data)
        
        # Convertir historial a formato esperado
        history = [
            {
                "content": msg['content'],
                "sender": msg['sender'],
                "timestamp": msg['timestamp'].isoformat()
            }
            for msg in reversed(conversation_history)  # Orden cronológico
        ]
        
        result = await agent.process_message(chat_data.message, history)
        
        # Guardar respuesta del AI
        async with await db.get_connection() as conn:
            ai_message_id = await conn.fetchval("""
                INSERT INTO messages (session_id, content, sender, metadata) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id
            """, chat_data.session_id, result['response'], 'ai', 
                json.dumps(result.get('metadata', {})))
            
            # Actualizar estadísticas
            await conn.execute("""
                UPDATE stats SET 
                    last_activity = CURRENT_TIMESTAMP
                WHERE session_id = $1
            """, chat_data.session_id)
            
            # Si es un lead, incrementar contador
            if result.get('response_type') == 'lead_capture':
                await conn.execute("""
                    UPDATE stats SET leads = leads + 1 WHERE session_id = $1
                """, chat_data.session_id)
            
            # Si es una cita, incrementar contador
            if result.get('response_type') == 'appointment':
                await conn.execute("""
                    UPDATE stats SET scheduled_visits = scheduled_visits + 1 WHERE session_id = $1
                """, chat_data.session_id)
        
        return ChatResponse(
            id=str(ai_message_id),
            content=result['response'],
            sender='ai',
            timestamp=datetime.now(),
            session_id=chat_data.session_id,
            metadata=result.get('metadata', {})
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error procesando mensaje: {str(e)}")

@router.get("/{session_id}/history")
async def get_chat_history(session_id: str, limit: int = 50, db = Depends(get_db)):
    try:
        async with await db.get_connection() as conn:
            messages = await conn.fetch("""
                SELECT id, content, sender, timestamp, metadata
                FROM messages 
                WHERE session_id = $1 
                ORDER BY timestamp ASC 
                LIMIT $2
            """, session_id, limit)
            
            return [
                {
                    "id": str(msg['id']),
                    "content": msg['content'],
                    "sender": msg['sender'],
                    "timestamp": msg['timestamp'],
                    "metadata": json.loads(msg['metadata']) if msg['metadata'] else {}
                }
                for msg in messages
            ]
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo historial: {str(e)}")
