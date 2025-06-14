
# CallFlow Frontend - Documentación Completa

## 📋 Tabla de Contenidos
1. [Arquitectura General](#arquitectura-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Páginas y Rutas](#páginas-y-rutas)
5. [Componentes](#componentes)
6. [Servicios y Hooks](#servicios-y-hooks)
7. [Integración con Backend](#integración-con-backend)
8. [Flujo de Usuario](#flujo-de-usuario)
9. [Gestión de Estado](#gestión-de-estado)
10. [Configuración y Deployment](#configuración-y-deployment)

## 🏗️ Arquitectura General

CallFlow es una aplicación SPA (Single Page Application) construida con React que simula un asistente de IA para inmobiliarias. La aplicación está diseñada para demostrar las capacidades de un agente de IA que puede manejar consultas inmobiliarias, capturar leads y mostrar estadísticas en tiempo real.

### Diagrama de Flujo
```
Usuario → Landing Page → Chat (Onboarding) → Agent Interface → Dashboard
```

## 🛠️ Tecnologías Utilizadas

### Core Stack
- **React 18.3.1** - Biblioteca principal de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM 6.26.2** - Enrutamiento

### UI/UX
- **Tailwind CSS** - Framework de estilos
- **Shadcn/UI** - Componentes de UI pre-construidos
- **Lucide React** - Iconografía
- **class-variance-authority** - Variantes de componentes

### Estado y Datos
- **TanStack React Query 5.56.2** - Gestión de estado del servidor
- **LocalStorage** - Persistencia local de sesiones

### Comunicación
- **Fetch API** - Comunicación con backend Python
- **WebSockets** (preparado) - Para actualizaciones en tiempo real

## 📁 Estructura de Archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de Shadcn/UI
│   └── AgentInterface.tsx  # Interfaz principal del agente
├── pages/              # Páginas principales
│   ├── Landing.tsx     # Página de inicio
│   ├── Chat.tsx        # Chat de onboarding
│   └── NotFound.tsx    # Página 404
├── hooks/              # Custom hooks
│   └── useSession.ts   # Manejo de sesiones
├── services/           # Servicios de API
│   └── AgentService.ts # Comunicación con backend
└── App.tsx            # Componente raíz
```

## 🎯 Páginas y Rutas

### 1. Landing Page (`/`)
**Archivo:** `src/pages/Landing.tsx`

**Propósito:** Página de bienvenida que presenta CallFlow y sus características.

**Características:**
- Hero section con llamada a la acción
- Sección de características principales
- Planes de precios (Starter, Pro, Max)
- Footer con información de contacto
- Botón principal que redirige a `/chat`

### 2. Chat Page (`/chat`)
**Archivo:** `src/pages/Chat.tsx` (276 líneas)

**Propósito:** Interfaz de chat para onboarding del usuario y creación del agente personalizado.

**Funcionalidades:**
- **Onboarding interactivo:** Recolecta información de la inmobiliaria paso a paso
- **Creación de agente:** Genera agente personalizado basado en los datos
- **Simulación de llamadas:** Demuestra capacidades del agente
- **Chat dinámico:** Respuestas contextuales post-onboarding
- **Integración con AgentInterface:** Muestra dashboard cuando se solicita

**Estados principales:**
```typescript
interface UserData {
  businessName?: string;
  website?: string;
  location?: string;
  propertyTypes?: string;
  workingHours?: string;
  phone?: string;
}
```

### 3. Not Found (`/*`)
**Archivo:** `src/pages/NotFound.tsx`

**Propósito:** Página 404 para rutas no encontradas.

## 🧩 Componentes

### AgentInterface
**Archivo:** `src/components/AgentInterface.tsx`

**Propósito:** Componente que simula la interfaz del agente de IA y muestra estadísticas.

**Características:**
- **MockAgentUI:** Chat simulado con el agente personalizado
- **Dashboard Cards:** Métricas de llamadas, minutos, leads y visitas
- **Responsive Design:** Adaptable a diferentes tamaños de pantalla

**Props:**
```typescript
interface AgentInterfaceProps {
  userData: {
    businessName?: string;
    location?: string;
    propertyTypes?: string;
  };
}
```

**Métricas mostradas:**
- Llamadas realizadas (47)
- Minutos consumidos (234/500)
- Leads generados (12)
- Visitas agendadas (8)

## 🔧 Servicios y Hooks

### AgentService
**Archivo:** `src/services/AgentService.ts`

**Propósito:** Servicio principal para gestionar sesiones de usuario y configuración de agentes.

**Funcionalidades principales:**
```typescript
class AgentService {
  // Crear nueva sesión de usuario
  createSession(userData): string
  
  // Obtener sesión existente
  getSession(sessionId): UserSession | undefined
  
  // Obtener configuración del agente
  getAgentConfig(sessionId): AgentConfig | undefined
  
  // Actualizar prompt del agente
  updateAgentPrompt(sessionId, newPrompt): boolean
  
  // Simular llamada telefónica
  simulateCall(sessionId, phoneNumber): Promise<boolean>
}
```

**Tipos de datos:**
```typescript
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
```

### useSession Hook
**Archivo:** `src/hooks/useSession.ts`

**Propósito:** Custom hook para gestionar el estado de la sesión del usuario.

**Funcionalidades:**
```typescript
export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>()
  const [session, setSession] = useState<UserSession | null>()
  
  // Crear nueva sesión
  const createSession = (userData) => string
  
  // Limpiar sesión actual
  const clearSession = () => void
  
  return {
    sessionId,
    session,
    createSession,
    clearSession,
    hasSession: boolean
  }
}
```

**Persistencia:** Utiliza `localStorage` para mantener la sesión entre recargas de página.

## 🔌 Integración con Backend

### Configuración Actual
Actualmente el frontend usa **servicios mock** que simulan la funcionalidad del backend. Está preparado para conectarse al backend de Python via APIs REST.

### APIs Preparadas para Integración

#### 1. Sesiones
```typescript
// Crear sesión
POST /api/sessions
Body: {
  businessName: string,
  location: string,
  propertyTypes: string,
  workingHours: string,
  phone: string,
  website?: string,
  apiProvider: string
}
Response: { sessionId: string }

// Obtener sesión
GET /api/sessions/{sessionId}
Response: UserSession
```

#### 2. Chat
```typescript
// Procesar mensaje
POST /api/chat
Body: {
  sessionId: string,
  message: string,
  context?: object
}
Response: {
  response: string,
  action?: string,
  data?: object
}
```

#### 3. Dashboard
```typescript
// Obtener métricas
GET /api/dashboard/{sessionId}
Response: {
  totalCalls: number,
  totalMinutes: number,
  leads: number,
  scheduledVisits: number
}
```

#### 4. Llamadas
```typescript
// Simular llamada
POST /api/calls/simulate
Body: {
  sessionId: string,
  phoneNumber: string
}
Response: { success: boolean, callId?: string }
```

### Migración a Backend Real

Para conectar con el backend de Python, se necesita:

1. **Actualizar AgentService.ts:**
```typescript
class AgentService {
  private apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  async createSession(userData: Omit<UserSession, 'id' | 'createdAt'>): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    return data.sessionId;
  }
  
  // ... resto de métodos con fetch
}
```

2. **Configurar variables de entorno:**
```env
REACT_APP_API_URL=https://tu-dominio.com
REACT_APP_WS_URL=wss://tu-dominio.com/ws
```

3. **Agregar manejo de errores:**
```typescript
// En los componentes
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## 🔄 Flujo de Usuario

### 1. Llegada a la Landing
- Usuario llega a `/`
- Ve información sobre CallFlow
- Hace clic en "Crear mi agente gratis"
- Redirige a `/chat`

### 2. Proceso de Onboarding (Chat)
1. **Paso 1:** Nombre de la inmobiliaria
2. **Paso 2:** Sitio web (opcional)
3. **Paso 3:** Ciudad/zona de operación
4. **Paso 4:** Tipos de propiedades
5. **Paso 5:** Horarios de atención
6. **Paso 6:** Número de teléfono

### 3. Creación del Agente
- Se procesa la información recolectada
- Se genera un `systemPrompt` personalizado
- Se crea la sesión en `AgentService`
- Se simula una llamada de demostración

### 4. Interacción Post-Onboarding
- Usuario puede solicitar ver dashboard
- Puede pedir hacer llamadas de prueba
- Chat se vuelve dinámico y contextual
- Se muestra el componente `AgentInterface` cuando se solicita

## 💾 Gestión de Estado

### Estado Local (React)
- **useState:** Para estado de componentes individuales
- **useEffect:** Para efectos secundarios y ciclo de vida
- **Custom hooks:** Para lógica reutilizable (`useSession`)

### Persistencia
- **localStorage:** Para mantener `sessionId` entre sesiones
- **Servicios mock:** Simulan base de datos en memoria

### Estado Global (Preparado)
- **React Query:** Configurado para cuando se conecte al backend real
- **Context API:** Disponible para estado global si se necesita

## ⚙️ Configuración y Deployment

### Variables de Entorno
```env
# API Backend
REACT_APP_API_URL=https://tu-backend.tu-dominio.com
REACT_APP_WS_URL=wss://tu-backend.tu-dominio.com/ws

# Configuración opcional
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Build y Deploy
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Integración con Backend Python
Una vez que el backend esté desplegado en tu VPS con EasyPanel:

1. **Configurar CORS** en el backend para permitir tu dominio frontend
2. **Actualizar URLs** en `AgentService.ts`
3. **Configurar SSL** para HTTPS (requerido para WebSockets)
4. **Testear endpoints** uno por uno

## 🚀 Características Avanzadas

### Preparado para el Futuro
- **WebSocket support:** Para chat en tiempo real
- **PWA ready:** Service workers configurables
- **Responsive design:** Funciona en todos los dispositivos
- **Accessibility:** Componentes accesibles con Shadcn/UI
- **TypeScript:** Tipado fuerte para menos errores

### Extensibilidad
- **Modular architecture:** Fácil agregar nuevas páginas/componentes
- **Service layer:** Abstraído para diferentes backends
- **Hook pattern:** Lógica reutilizable
- **Component composition:** Componentes pequeños y enfocados

## 🔧 Próximos Pasos

1. **Conectar con Backend Real:**
   - Actualizar `AgentService.ts` para usar APIs HTTP
   - Configurar variables de entorno
   - Implementar manejo de errores

2. **Mejoras de UX:**
   - Loading states más sofisticados
   - Error boundaries
   - Offline support

3. **Funcionalidades Adicionales:**
   - Historial de conversaciones
   - Configuración de agente en tiempo real
   - Analytics dashboard más detallado

---

Este frontend está completamente preparado para conectarse con el backend de Python que has implementado. Solo necesita la configuración de URLs y el reemplazo de los servicios mock por llamadas HTTP reales.
