# KeyScanner - Escáner de Claves Secretas y Dependencias Vulnerables

<p align="center">
  <img src="logo.png" alt="KeyScanner Logo" width="160" />
</p>

<p align="center">
  <img src="preview.png" alt="KeyScanner Web Application Preview" width="100%" />
</p>

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

Para facilitar las pruebas sin necesidad de crear archivos manuales, se han generado 6 archivos ZIP con distintas configuraciones listos para subir:

1. **`samples/demo_node_project.zip`** (Node.js — Mixto):
   - Dependencias vulnerables (`lodash: 4.17.15`, `axios: 0.21.1`, `express: 4.16.1`).
   - Secretos expuestos en `.env` (AWS Access Key, Slack Webhook, PostgreSQL URI) y GitHub PAT en `src/index.js`.
2. **`samples/demo_python_project.zip`** (Python — Mixto):
   - Dependencias vulnerables (`requests==2.20.0`, `urllib3==1.24.1`, `jinja2==2.10.1`).
   - Secretos en `config.py` (Google Cloud API Key, Stripe Live Key, AWS Key y Entropía de Shannon).
3. **`samples/demo_clean_project.zip`** (Proyecto Limpio — Riesgo `NONE`):
   - Proyecto sin secretos y con dependencias actualizadas (0 hallazgos).
4. **`samples/demo_fullstack_monorepo.zip`** (Monorepo Full-Stack Multi-Ecosistema):
   - Combina `backend/requirements.txt` (`django==3.1.1`, `pyyaml==5.3`, `cryptography==3.2`) y `frontend/package-lock.json` v2 (`jsonwebtoken: 8.5.1`, `minimist: 1.2.5`).
   - Incluye llave privada RSA (`id_rsa_deploy.pem`), URI de MongoDB Atlas (`mongodb+srv://`), Slack Bot Token (`xoxb-...`), AWS Secret Key y Stripe Test Key.
5. **`samples/demo_devops_keys_only.zip`** (Infraestructura DevOps — Solo Secretos, 0 CVEs):
   - Archivos de infraestructura (`terraform.tfvars`, `db_backup.sh`, llave privada `deploy_ed25519`, `stripe_sandbox.env`).
   - Contiene 12 secretos distribuidos en las 4 severidades (`CRITICAL`, `HIGH`, `MEDIUM` y `LOW`) y 0 dependencias vulnerables.
6. **`samples/demo_legacy_cves_only.zip`** (Deuda Técnica / Supply Chain — Solo CVEs, 0 Secretos):
   - Código fuente limpio que usa `os.environ.get()` correctamente (0 secretos filtrados).
   - Manifiestos con 8 paquetes legacy altamente vulnerables en PyPI y npm (`flask==0.12.2`, `pillow==8.1.0`, `paramiko==2.4.1`, `sqlalchemy==1.3.0`, `semver: 5.7.1`, `socket.io: 2.3.0`).

---

## Ejecución de Pruebas Automatizadas

Para correr toda la suite de pruebas (17 tests de integración y unitarios):
```powershell
$env:PYTHONPATH="backend"
.\.venv\Scripts\pytest.exe backend\tests -v
```

---

## Licencia

Este proyecto (Backend y Frontend) se distribuye bajo la **Licencia MIT**. Consulta el archivo `LICENSE` o [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT) para más detalles.

**Autora**: Emma Reyes Preciado — Universidad Politécnica de Chiapas (2026).