
import React from 'react';
import { AgentUI } from '@ag-ui/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Phone, Users, Clock } from 'lucide-react';

interface AgentInterfaceProps {
  userData: {
    businessName?: string;
    location?: string;
    propertyTypes?: string;
  };
}

const AgentInterface = ({ userData }: AgentInterfaceProps) => {
  // Mock data para la demo del dashboard
  const dashboardData = {
    totalCalls: 47,
    totalMinutes: 234,
    leads: 12,
    scheduledVisits: 8
  };

  const handleAgentMessage = (message: any) => {
    console.log('Agent message:', message);
  };

  return (
    <div className="space-y-6">
      <AgentUI
        onMessage={handleAgentMessage}
        config={{
          apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'demo-key',
          model: 'gpt-4',
          systemPrompt: `Eres un asistente especializado para ${userData.businessName || 'esta inmobiliaria'}. 
          Puedes mostrar dashboards, estadísticas y ayudar con la configuración del agente de voz.
          Cuando el usuario pida ver estadísticas o dashboard, puedes mostrar componentes dinámicos.`
        }}
      />
      
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
