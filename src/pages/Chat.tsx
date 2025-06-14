
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  component?: any; // For dynamic AG-UI components
}

interface UserData {
  businessName?: string;
  website?: string;
  location?: string;
  propertyTypes?: string;
  workingHours?: string;
  phone?: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy el asistente de CallFlow. Voy a ayudarte a crear tu agente de IA personalizado para tu inmobiliaria en solo unos minutos. ¿Cuál es el nombre de tu inmobiliaria?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onboardingSteps = [
    { field: 'businessName', question: '¡Perfecto! Ahora, ¿cuál es el sitio web de tu inmobiliaria? (opcional, pero nos ayuda a personalizar mejor el agente)' },
    { field: 'website', question: '¿En qué ciudad o zona opera tu inmobiliaria principalmente?' },
    { field: 'location', question: '¿Qué tipo de propiedades manejan principalmente? (casas, departamentos, comerciales, etc.)' },
    { field: 'propertyTypes', question: '¿Cuáles son sus horarios de atención habituales?' },
    { field: 'workingHours', question: '¿Cuál es el número de teléfono principal de la inmobiliaria?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, sender: 'user' | 'ai', component?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      component
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      handleOnboarding(userMessage);
      setIsLoading(false);
    }, 1000);
  };

  const handleOnboarding = (userResponse: string) => {
    // Update user data based on current step
    if (currentStep === 0) {
      setUserData(prev => ({ ...prev, businessName: userResponse }));
    } else if (currentStep === 1) {
      setUserData(prev => ({ ...prev, website: userResponse }));
    } else if (currentStep === 2) {
      setUserData(prev => ({ ...prev, location: userResponse }));
    } else if (currentStep === 3) {
      setUserData(prev => ({ ...prev, propertyTypes: userResponse }));
    } else if (currentStep === 4) {
      setUserData(prev => ({ ...prev, workingHours: userResponse }));
    } else if (currentStep === 5) {
      setUserData(prev => ({ ...prev, phone: userResponse }));
    }

    // Send next question or finish onboarding
    if (currentStep < onboardingSteps.length - 1) {
      addMessage(onboardingSteps[currentStep].question, 'ai');
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === onboardingSteps.length - 1) {
      // Finish onboarding and start creating agent
      addMessage('¡Excelente! Ya tengo toda la información necesaria. Ahora voy a crear tu agente de IA personalizado...', 'ai');
      setTimeout(() => createAgent(), 2000);
    } else {
      // Handle general conversation after onboarding
      addMessage('¿En qué más puedo ayudarte con tu agente de IA?', 'ai');
    }
  };

  const createAgent = () => {
    addMessage('🤖 Agente creado exitosamente! Ahora voy a llamarte para que puedas experimentar cómo tu nuevo agente interactúa con tus clientes potenciales...', 'ai');
    
    setTimeout(() => {
      addMessage('📞 Llamando a tu número en 3... 2... 1...', 'ai');
      
      setTimeout(() => {
        addMessage(`¡Increíble! ¿Viste cómo tu agente de IA puede manejar consultas sobre ${userData.propertyTypes} en ${userData.location}? 

Esto es solo una muestra básica. Con nuestros planes puedes:

🎯 **Plan Starter ($300/mes)**: 500 minutos, Google Sheets, agente básico
🚀 **Plan Pro ($500/mes)**: 1000 minutos, CRM integrado, personalización completa, agenda automática  
💎 **Plan Max ($750/mes)**: 2000 minutos, WhatsApp bot, CRM avanzado

¿Te gustaría que programe una llamada con nuestro equipo para personalizar tu agente o prefieres empezar con algún plan directamente?`, 'ai');
      }, 3000);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Phone className="h-6 w-6 text-orange-500 mr-2" />
            <span className="font-semibold text-gray-900">CallFlow</span>
          </div>
          <div className="text-sm text-gray-500">
            Creando tu agente de IA...
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.component && (
                  <div className="mt-2">
                    {message.component}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu respuesta..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
