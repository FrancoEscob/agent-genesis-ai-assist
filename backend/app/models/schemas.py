
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class ApiProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OPENROUTER = "openrouter"
    GOOGLE = "google"

class Plan(str, Enum):
    STARTER = "starter"
    PRO = "pro"
    MAX = "max"

class SessionCreate(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=200)
    website: Optional[str] = None
    location: str = Field(..., min_length=1, max_length=100)
    property_types: str = Field(..., min_length=1, max_length=200)
    working_hours: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=1, max_length=20)
    api_provider: ApiProvider = ApiProvider.OPENAI

class SessionResponse(BaseModel):
    id: str
    business_name: str
    website: Optional[str]
    location: str
    property_types: str
    working_hours: str
    phone: str
    api_provider: ApiProvider
    created_at: datetime
    system_prompt: str

class ChatMessage(BaseModel):
    session_id: str
    message: str
    user_type: str = "user"

class ChatResponse(BaseModel):
    id: str
    content: str
    sender: str
    timestamp: datetime
    session_id: str
    metadata: Optional[Dict[str, Any]] = None

class CallSimulation(BaseModel):
    session_id: str
    phone_number: str

class DashboardStats(BaseModel):
    session_id: str
    total_calls: int
    total_minutes: int
    leads: int
    scheduled_visits: int
    messages_count: int
    last_activity: Optional[datetime]

class AgentConfig(BaseModel):
    session_id: str
    system_prompt: str
    voice_provider: str = "retell"
    voice_id: str = "default-voice"
    plan: Plan = Plan.STARTER
    max_tokens: int = 1000
    temperature: float = 0.7
