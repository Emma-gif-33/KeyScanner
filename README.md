# KeyScanner - Escáner de Claves Secretas y Dependencias Vulnerables

Plataforma analítica basada en una API RESTful con FastAPI y PostgreSQL para auditar repositorios y archivos de código fuente, detectando de forma automatizada secretos expuestos y dependencias vulnerables.

Proyecto desarrollado para la materia de **Seguridad Informática** (UP Chiapas).

---

## Arquitectura y Tecnologías

- **Backend**: Python 3.12, FastAPI, Pydantic v2.
- **Base de Datos**: PostgreSQL 16 (Docker Compose) con SQLAlchemy 2.0 (asíncrono con `asyncpg`) y migraciones automáticas con Alembic.
- **Motor de Secretos**: RegEx de alta fidelidad para proveedores (AWS, GitHub, Google Cloud, Slack, Stripe, LLaves privadas SSH/RSA, Database URIs) y cálculo de **Entropía de Shannon** para secretos aleatorios genéricos con ofuscación defensiva.
- **Motor de Dependencias**: Análisis de manifiestos Python (`requirements.txt`) y Node.js (`package.json`, `package-lock.json`) consultando la base de datos de vulnerabilidades abiertas de Google (**OSV.dev**).
- **Procesamiento Asíncrono**: `BackgroundTasks` con máquina de estados (`QUEUED` ➔ `PROCESSING` ➔ `COMPLETED` / `FAILED`).
- **Seguridad**: Autenticación JWT con hashing Bcrypt.

---

## Puesta en Marcha

### Opción A: Despliegue Completo con Docker Compose (Recomendado)
Levanta toda la infraestructura (PostgreSQL + Backend FastAPI + Frontend React Nginx) en una sola red interna de contenedores:
```bash
docker compose up --build -d
```
- **Aplicación Web Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Backend & Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Base de Datos PostgreSQL**: `localhost:5432`

---

### Opción B: Ejecución Local para Desarrollo

#### 1. Iniciar Base de Datos (PostgreSQL)
```bash
docker compose up postgres -d
```

#### 2. Iniciar el Servidor Backend (FastAPI)
```powershell
$env:PYTHONPATH="backend"
.\.venv\Scripts\uvicorn app.main:app --reload
```
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

#### 3. Iniciar el Frontend (React TS + Tailwind + Vite)
En otra terminal:
```powershell
cd frontend
npm run dev
```
- **Frontend Local**: [http://localhost:3000](http://localhost:3000) (proxy automático a backend en `:8000`)

---

## Proyectos de Prueba Listos (Directorio `samples/`)

Para facilitar las pruebas sin necesidad de crear archivos manuales, se han generado 3 archivos ZIP listos para subir:

1. **`samples/demo_node_project.zip`** (Node.js):
   - Dependencias vulnerables reales (`lodash: 4.17.15`, `axios: 0.21.1`).
   - Secretos expuestos en `.env` (AWS Access Key, Slack Webhook, Database URI).
   - Token de GitHub en `src/index.js`.
2. **`samples/demo_python_project.zip`** (Python):
   - Dependencias vulnerables reales (`requests==2.20.0`, `urllib3==1.24.1`).
   - Secretos en `config.py` (Google Cloud API Key, Stripe Live Key, Entropía de Shannon).
3. **`samples/demo_clean_project.zip`** (Proyecto Limpio):
   - Proyecto sin secretos y con dependencias actualizadas (Riesgo: `NONE`, 0 hallazgos).

---

## Ejecución de Pruebas Automatizadas

Para correr toda la suite de pruebas (14 tests de integración y unitarios):
```powershell
$env:PYTHONPATH="backend"
.\.venv\Scripts\pytest.exe backend\tests -v
```