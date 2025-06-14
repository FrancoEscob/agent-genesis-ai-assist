
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Phone, MessageSquare, Calendar, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: 300,
      description: "Perfecto para inmobiliarias pequeñas",
      features: [
        "500 minutos de llamadas al mes",
        "Agente de voz básico",
        "Integración con Google Sheets",
        "Reportes básicos de leads"
      ],
      limitations: [
        "Sin personalización de nombre/tono",
        "Sin agenda automática"
      ]
    },
    {
      name: "Pro",
      price: 500,
      description: "Para inmobiliarias en crecimiento",
      features: [
        "1,000 minutos de llamadas al mes",
        "Personalización completa del agente",
        "CRM integrado en la plataforma",
        "Agenda automática de visitas",
        "Reportes avanzados"
      ],
      popular: true
    },
    {
      name: "Max",
      price: 750,
      description: "Solución empresarial completa",
      features: [
        "2,000 minutos de llamadas al mes",
        "Personalización completa del agente",
        "CRM avanzado integrado",
        "Agenda automática de visitas",
        "Chatbot de WhatsApp incluido",
        "Reportes empresariales"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">CallFlow</span>
            </div>
            <Button 
              onClick={() => navigate('/chat')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Crear mi agente
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Agente de IA para tu{" "}
            <span className="text-orange-500">inmobiliaria</span>{" "}
            en minutos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mientras las agencias tardan meses en crear tu asistente de IA, 
            nosotros lo hacemos en minutos. Sin conocimientos técnicos necesarios.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/chat')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
          >
            Crear mi agente ahora
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué CallFlow?
            </h2>
            <p className="text-lg text-gray-600">
              La diferencia entre esperar meses o tener tu agente hoy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatización inmediata</h3>
              <p className="text-gray-600">
                Tu agente está listo en minutos, no en meses como las agencias tradicionales
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Más leads calificados</h3>
              <p className="text-gray-600">
                Atiende consultas 24/7 y nunca pierdas un cliente potencial
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sin conocimientos técnicos</h3>
              <p className="text-gray-600">
                Solo describes tu negocio y nosotros creamos el agente perfecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planes para cada inmobiliaria
            </h2>
            <p className="text-lg text-gray-600">
              Comienza con una demo gratuita, luego elige el plan que mejor se adapte
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-orange-500 border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                      Más popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/mes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, idx) => (
                      <li key={idx} className="flex items-center opacity-60">
                        <span className="h-5 w-5 mr-3 flex-shrink-0">×</span>
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/chat')}
                  >
                    Comenzar demo gratuita
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para revolucionar tu inmobiliaria?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a las inmobiliarias que ya están usando IA para cerrar más ventas
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/chat')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
          >
            Crear mi agente gratis
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
