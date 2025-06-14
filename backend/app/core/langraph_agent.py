
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
import json
import os
from datetime import datetime

class ConversationState:
    def __init__(self):
        self.messages: List[Dict] = []
        self.session_data: Dict = {}
        self.context: Dict = {}
        self.action_needed: bool = False
        self.response: str = ""
        self.metadata: Dict = {}

class CallFlowAgent:
    def __init__(self, session_data: Dict):
        self.session_data = session_data
        self.llm = self._init_llm()
        self.graph = self._create_graph()
    
    def _init_llm(self):
        api_provider = self.session_data.get('api_provider', 'openai')
        
        if api_provider == 'openai':
            return ChatOpenAI(
                model="gpt-4",
                temperature=0.7,
                api_key=os.getenv("OPENAI_API_KEY")
            )
        elif api_provider == 'anthropic':
            return ChatAnthropic(
                model="claude-3-sonnet-20240229",
                temperature=0.7,
                api_key=os.getenv("ANTHROPIC_API_KEY")
            )
        else:
            # Default to OpenAI
            return ChatOpenAI(
                model="gpt-4",
                temperature=0.7,
                api_key=os.getenv("OPENAI_API_KEY")
            )
    
    def _create_graph(self):
        workflow = StateGraph(dict)
        
        # Definir nodos
        workflow.add_node("entry", self.entry_node)
        workflow.add_node("context_loader", self.context_loader_node)
        workflow.add_node("classifier", self.classifier_node)
        workflow.add_node("general_response", self.general_response_node)
        workflow.add_node("lead_capture", self.lead_capture_node)
        workflow.add_node("appointment_scheduler", self.appointment_scheduler_node)
        workflow.add_node("finalizer", self.finalizer_node)
        
        # Definir flujo
        workflow.set_entry_point("entry")
        workflow.add_edge("entry", "context_loader")
        workflow.add_edge("context_loader", "classifier")
        
        # Condicionales desde classifier
        workflow.add_conditional_edges(
            "classifier",
            self.route_conversation,
            {
                "general": "general_response",
                "lead_capture": "lead_capture",
                "appointment": "appointment_scheduler"
            }
        )
        
        # Todos los nodos van al finalizador
        workflow.add_edge("general_response", "finalizer")
        workflow.add_edge("lead_capture", "finalizer")
        workflow.add_edge("appointment_scheduler", "finalizer")
        workflow.add_edge("finalizer", END)
        
        return workflow.compile()
    
    async def entry_node(self, state: Dict) -> Dict:
        """Nodo de entrada - procesa el mensaje inicial"""
        print(f"🚀 Entry Node - Procesando: {state.get('user_message', '')}")
        
        state['timestamp'] = datetime.now().isoformat()
        state['session_data'] = self.session_data
        
        return state
    
    async def context_loader_node(self, state: Dict) -> Dict:
        """Carga el contexto de la inmobiliaria"""
        print("📚 Context Loader - Cargando contexto de la inmobiliaria")
        
        context = {
            "business_name": self.session_data.get('business_name'),
            "location": self.session_data.get('location'),
            "property_types": self.session_data.get('property_types'),
            "working_hours": self.session_data.get('working_hours'),
            "phone": self.session_data.get('phone'),
            "website": self.session_data.get('website')
        }
        
        state['context'] = context
        return state
    
    async def classifier_node(self, state: Dict) -> Dict:
        """Clasifica el tipo de consulta del usuario"""
        print("🔍 Classifier - Analizando intención del usuario")
        
        user_message = state.get('user_message', '').lower()
        
        # Clasificación simple basada en palabras clave
        if any(word in user_message for word in ['mi nombre', 'me llamo', 'contacto', 'teléfono', 'email']):
            intent = 'lead_capture'
        elif any(word in user_message for word in ['cita', 'visita', 'ver', 'agendar', 'reunión']):
            intent = 'appointment'
        else:
            intent = 'general'
        
        state['intent'] = intent
        print(f"   Intención detectada: {intent}")
        
        return state
    
    async def general_response_node(self, state: Dict) -> Dict:
        """Genera respuesta general sobre la inmobiliaria"""
        print("💬 General Response - Generando respuesta general")
        
        context = state['context']
        system_prompt = f"""Eres un asistente de IA para {context['business_name']} ubicada en {context['location']}.

Información de la empresa:
- Nombre: {context['business_name']}
- Ubicación: {context['location']}
- Tipos de propiedades: {context['property_types']}
- Horarios: {context['working_hours']}
- Teléfono: {context['phone']}
{f"- Sitio web: {context['website']}" if context['website'] else ''}

Responde de manera amable y profesional. Si no tienes información específica sobre propiedades, deriva al usuario a contactar directamente."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": state['user_message']}
        ]
        
        response = await self.llm.ainvoke([
            AIMessage(content=system_prompt),
            HumanMessage(content=state['user_message'])
        ])
        
        state['response'] = response.content
        state['response_type'] = 'general'
        
        return state
    
    async def lead_capture_node(self, state: Dict) -> Dict:
        """Maneja la captura de leads"""
        print("👤 Lead Capture - Procesando información de lead")
        
        context = state['context']
        response = f"""¡Perfecto! Me da mucho gusto poder ayudarte. Soy el asistente de {context['business_name']}.

Para poder darte la mejor información sobre {context['property_types']} en {context['location']}, me gustaría conocerte mejor.

¿Podrías compartirme:
- ¿Qué tipo de propiedad estás buscando específicamente?
- ¿En qué zona te interesa más?
- ¿Cuál es tu presupuesto aproximado?

Puedes contactarnos directamente al {context['phone']} o durante nuestros horarios: {context['working_hours']}"""
        
        state['response'] = response
        state['response_type'] = 'lead_capture'
        state['metadata'] = {'lead_info_requested': True}
        
        return state
    
    async def appointment_scheduler_node(self, state: Dict) -> Dict:
        """Maneja el agendamiento de citas"""
        print("📅 Appointment Scheduler - Gestionando cita")
        
        context = state['context']
        response = f"""¡Excelente! Me encanta que quieras conocer nuestras propiedades en persona.

Para agendar tu visita a {context['business_name']}:

📞 Llámanos al {context['phone']}
🕒 Horarios: {context['working_hours']}
📍 Ubicación: {context['location']}

Nuestro equipo te contactará para coordinar el mejor horario y preparar una selección personalizada de {context['property_types']} que se ajusten a lo que buscas.

¿Hay algún día y horario que te convenga más?"""
        
        state['response'] = response
        state['response_type'] = 'appointment'
        state['metadata'] = {'appointment_requested': True}
        
        return state
    
    async def finalizer_node(self, state: Dict) -> Dict:
        """Nodo final que prepara la respuesta"""
        print("✅ Finalizer - Preparando respuesta final")
        
        # Agregar información adicional si es necesario
        if not state.get('response'):
            state['response'] = "Lo siento, no pude procesar tu consulta. ¿Podrías reformularla?"
        
        # Timestamp final
        state['completed_at'] = datetime.now().isoformat()
        
        return state
    
    def route_conversation(self, state: Dict) -> str:
        """Enruta la conversación según la intención"""
        return state.get('intent', 'general')
    
    async def process_message(self, user_message: str, conversation_history: List[Dict] = None) -> Dict:
        """Procesa un mensaje del usuario usando LangGraph"""
        initial_state = {
            'user_message': user_message,
            'conversation_history': conversation_history or []
        }
        
        result = await self.graph.ainvoke(initial_state)
        
        return {
            'response': result.get('response', ''),
            'response_type': result.get('response_type', 'general'),
            'metadata': result.get('metadata', {}),
            'intent': result.get('intent', 'general')
        }
