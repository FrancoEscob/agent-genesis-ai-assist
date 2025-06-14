
FROM python:3.11-slim

# Configurar variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Descargar modelos de spaCy (opcional, para análisis de texto avanzado)
RUN python -m spacy download es_core_news_sm

# Copiar código de la aplicación
COPY . .

# Crear usuario no-root
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
