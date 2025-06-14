
interface UserSession {
  id: string;
  businessName: string;
  website?: string;
  location: string;
  propertyTypes: string;
  workingHours: string;
  phone: string;
  createdAt: Date;
  apiProvider: 'openai' | 'anthropic' | 'openrouter' | 'google';
}

interface AgentConfig {
  sessionId: string;
  systemPrompt: string;
  voice: {
    provider: 'retell' | 'elevenlabs';
    voiceId: string;
  };
  plan: 'starter' | 'pro' | 'max';
}

class AgentService {
  private sessions: Map<string, UserSession> = new Map();
  private configs: Map<string, AgentConfig> = new Map();

  createSession(userData: Omit<UserSession, 'id' | 'createdAt'>): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: UserSession = {
      id: sessionId,
      ...userData,
      createdAt: new Date()
    };

    this.sessions.set(sessionId, session);
    
    // Crear configuración básica del agente
    this.createAgentConfig(sessionId, userData);
    
    return sessionId;
  }

  private createAgentConfig(sessionId: string, userData: Partial<UserSession>) {
    const systemPrompt = this.generateSystemPrompt(userData);
    
    const config: AgentConfig = {
      sessionId,
      systemPrompt,
      voice: {
        provider: 'retell',
        voiceId: 'default-voice'
      },
      plan: 'starter' // Plan por defecto para la demo
    };

    this.configs.set(sessionId, config);
  }

  private generateSystemPrompt(userData: Partial<UserSession>): string {
    return `Eres un asistente de IA para ${userData.businessName || 'una inmobiliaria'} ubicada en ${userData.location || 'la ciudad'}.

Información de la empresa:
- Nombre: ${userData.businessName}
- Ubicación: ${userData.location}
- Tipos de propiedades: ${userData.propertyTypes}
- Horarios: ${userData.workingHours}
- Teléfono: ${userData.phone}
${userData.website ? `- Sitio web: ${userData.website}` : ''}

Tu trabajo es:
1. Responder consultas sobre propiedades disponibles
2. Proporcionar información de contacto y horarios
3. Ser amable y profesional
4. Capturar información de leads (nombre, teléfono, email, tipo de propiedad buscada)
5. NO inventar propiedades específicas - deriva a un agente humano para detalles

Siempre mantén un tono profesional pero cercano, y recuerda que representas a ${userData.businessName}.`;
  }

  getSession(sessionId: string): UserSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAgentConfig(sessionId: string): AgentConfig | undefined {
    return this.configs.get(sessionId);
  }

  updateAgentPrompt(sessionId: string, newPrompt: string): boolean {
    const config = this.configs.get(sessionId);
    if (config) {
      config.systemPrompt = newPrompt;
      this.configs.set(sessionId, config);
      return true;
    }
    return false;
  }

  // Simular llamada con RetellAI
  async simulateCall(sessionId: string, phoneNumber: string): Promise<boolean> {
    const config = this.getAgentConfig(sessionId);
    if (!config) return false;

    // Aquí iría la integración real con RetellAI
    console.log(`Simulando llamada para sesión ${sessionId} al número ${phoneNumber}`);
    console.log(`Usando prompt: ${config.systemPrompt.substring(0, 100)}...`);
    
    return true;
  }
}

export const agentService = new AgentService();
export type { UserSession, AgentConfig };
