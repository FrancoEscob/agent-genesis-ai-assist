
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Phone, Users, Clock, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AgentInterfaceProps {
  userData: {
    businessName?: string;
    location?: string;
    propertyTypes?: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender: 'ai' | 'user';
}

// Mock AgentUI component que simula la funcionalidad de AG-UI
const MockAgentUI = ({ userData }: { userData: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `¡Hola! Soy tu asistente de IA personalizado para ${userData.businessName || 'tu inmobiliaria'}. ¿En qué puedo ayudarte hoy?`,
      sender: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), content: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    // Simular respuesta del agente
    setTimeout(() => {
      let response = '';
      if (inputValue.toLowerCase().includes('dashboard') || inputValue.toLowerCase().includes('estadísticas')) {
        response = '📊 Perfecto! Te estoy mostrando el dashboard con las estadísticas en tiempo real de tu agente.';
      } else if (inputValue.toLowerCase().includes('llamada')) {
        response = '📞 ¡Excelente! Puedo hacer una llamada de demostración. ¿A qué número te gustaría que llame?';
      } else {
        response = `Como asistente de ${userData.businessName}, puedo ayudarte con consultas sobre ${userData.propertyTypes} en ${userData.location}. ¿Qué información necesitas?`;
      }
      
      const aiMessage: Message = { id: (Date.now() + 1).toString(), content: response, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Agente de IA - {userData.businessName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AgentInterface = ({ userData }: AgentInterfaceProps) => {
  // Mock data para la demo del dashboard
  const dashboardData = {
    totalCalls: 47,
    totalMinutes: 234,
    leads: 12,
    scheduledVisits: 8
  };

  return (
    <div className="space-y-6">
      <MockAgentUI userData={userData} />
      
      {/* Dashboard de muestra que se puede mostrar dinámicamente */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Llamadas</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCalls}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalMinutes}</div>
            <p className="text-xs text-muted-foreground">de 500 disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.leads}</div>
            <p className="text-xs text-muted-foreground">Nuevos este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.scheduledVisits}</div>
            <p className="text-xs text-muted-foreground">Agendadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentInterface;
