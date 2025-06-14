
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.database import init_db
from app.api import sessions, chat, dashboard, calls

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="CallFlow AI Backend",
    description="Backend para agentes de IA inmobiliarios con LangGraph",
    version="1.0.0",
    lifespan=lifespan
)

# CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers de API
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(calls.router, prefix="/api/calls", tags=["calls"])

@app.get("/")
async def root():
    return {"message": "CallFlow AI Backend - LangGraph Integration"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend funcionando correctamente"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
