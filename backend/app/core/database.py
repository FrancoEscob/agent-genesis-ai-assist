
import asyncpg
import os
from typing import Optional
import json
from datetime import datetime

class Database:
    def __init__(self):
        self.pool = None
    
    async def init_pool(self):
        database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/callflow")
        self.pool = await asyncpg.create_pool(database_url)
        await self.create_tables()
    
    async def create_tables(self):
        async with self.pool.acquire() as conn:
            # Tabla de sesiones
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    id VARCHAR(50) PRIMARY KEY,
                    business_name VARCHAR(200) NOT NULL,
                    website VARCHAR(500),
                    location VARCHAR(100) NOT NULL,
                    property_types VARCHAR(200) NOT NULL,
                    working_hours VARCHAR(100) NOT NULL,
                    phone VARCHAR(20) NOT NULL,
                    api_provider VARCHAR(20) NOT NULL DEFAULT 'openai',
                    system_prompt TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Tabla de mensajes/conversaciones
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(50) REFERENCES sessions(id),
                    content TEXT NOT NULL,
                    sender VARCHAR(10) NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    metadata JSONB
                )
            """)
            
            # Tabla de configuraciones de agente
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS agent_configs (
                    session_id VARCHAR(50) PRIMARY KEY REFERENCES sessions(id),
                    voice_provider VARCHAR(20) DEFAULT 'retell',
                    voice_id VARCHAR(50) DEFAULT 'default-voice',
                    plan VARCHAR(10) DEFAULT 'starter',
                    max_tokens INTEGER DEFAULT 1000,
                    temperature DECIMAL(3,2) DEFAULT 0.7,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Tabla de estadísticas
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS stats (
                    session_id VARCHAR(50) PRIMARY KEY REFERENCES sessions(id),
                    total_calls INTEGER DEFAULT 0,
                    total_minutes INTEGER DEFAULT 0,
                    leads INTEGER DEFAULT 0,
                    scheduled_visits INTEGER DEFAULT 0,
                    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

    async def get_connection(self):
        return self.pool.acquire()

# Instancia global de la base de datos
db = Database()

async def init_db():
    await db.init_pool()

async def get_db():
    return db
