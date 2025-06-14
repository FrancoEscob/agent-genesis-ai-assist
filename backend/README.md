
# CallFlow AI Backend con LangGraph

Backend de Python para agentes de IA inmobiliarios usando FastAPI, LangGraph y PostgreSQL.

## Características

- 🤖 **LangGraph**: Flujo de conversación inteligente con nodos especializados
- 🚀 **FastAPI**: API rápida y moderna con documentación automática
- 🐘 **PostgreSQL**: Base de datos robusta para persistencia
- 📊 **Dashboard**: Estadísticas en tiempo real
- 🔄 **Redis**: Cache y manejo de sesiones
- 🐳 **Docker**: Containerización completa para EasyPanel
- 🔒 **SSL**: Configuración HTTPS con Nginx

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/           # Endpoints de la API
│   ├── core/          # Lógica central (LangGraph, DB)
│   ├── models/        # Modelos Pydantic
│   └── main.py        # Aplicación principal
├── Dockerfile         # Imagen Docker
├── docker-compose.yml # Orquestación completa
├── nginx.conf         # Configuración del proxy
└── requirements.txt   # Dependencias Python
```

## Instalación Local

1. **Clonar y configurar entorno**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con tus API keys
```

3. **Iniciar base de datos**:
```bash
docker-compose up postgres redis -d
```

4. **Ejecutar aplicación**:
```bash
uvicorn app.main:app --reload
```

## Despliegue en EasyPanel

1. **Subir archivos** al VPS
2. **Configurar dominio** en EasyPanel apuntando al puerto 80
3. **Variables de entorno** en EasyPanel:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - Otras según necesites

4. **Ejecutar**:
```bash
docker-compose up -d
```

## Endpoints Principales

- `POST /api/sessions/` - Crear sesión de agente
- `GET /api/sessions/{id}` - Obtener datos de sesión
- `POST /api/chat/` - Procesar mensaje de chat
- `GET /api/dashboard/{id}` - Estadísticas del agente
- `POST /api/calls/simulate` - Simular llamada
- `GET /docs` - Documentación interactiva de la API

## Flujo de LangGraph

1. **Entry Node**: Procesa mensaje inicial
2. **Context Loader**: Carga información de la inmobiliaria
3. **Classifier**: Determina intención (general/lead/cita)
4. **Response Nodes**: Genera respuesta específica
5. **Finalizer**: Prepara respuesta final

## Integración con Frontend

Reemplaza las llamadas a `AgentService.ts` con:

```typescript
const API_BASE = 'https://tudominio.com/api';

// Crear sesión
const response = await fetch(`${API_BASE}/sessions/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(sessionData)
});

// Enviar mensaje
const chatResponse = await fetch(`${API_BASE}/chat/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ session_id, message })
});
```

## Configuración SSL

1. Obtener certificados SSL (Let's Encrypt recomendado)
2. Colocar archivos en `ssl/cert.pem` y `ssl/key.pem`
3. Actualizar `nginx.conf` con tu dominio

## Monitoreo y Logs

```bash
# Ver logs de la aplicación
docker-compose logs -f api

# Ver logs de la base de datos
docker-compose logs -f postgres

# Estado de servicios
docker-compose ps
```

## Expansión Futura

- **WebSocket**: Chat en tiempo real
- **RetellAI**: Llamadas telefónicas reales
- **Webhook**: Notificaciones externas
- **Analytics**: Métricas avanzadas
- **Multi-tenant**: Múltiples inmobiliarias
