import os
import zipfile

SAMPLES_DIR = os.path.dirname(os.path.abspath(__file__))


def create_samples():
    os.makedirs(SAMPLES_DIR, exist_ok=True)

    # 1. Demo Node.js Project (Secrets + npm CVEs)
    node_zip_path = os.path.join(SAMPLES_DIR, "demo_node_project.zip")
    with zipfile.ZipFile(node_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "package.json",
            """{
  "name": "demo-node-app",
  "version": "1.0.0",
  "description": "Sample vulnerable Node.js application for KeyScanner",
  "dependencies": {
    "lodash": "4.17.15",
    "axios": "0.21.1",
    "express": "4.16.1"
  }
}
"""
        )
        zf.writestr(
            ".env",
            """# Environment Credentials (VULNERABLE: Exposed in repo!)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
DATABASE_URL=postgres://postgres:SuperSecretAdminPass123@prod-db.internal:5432/main_db
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T12345678/B12345678/123456789012345678901234
"""
        )
        zf.writestr(
            "src/index.js",
            """const axios = require('axios');
const lodash = require('lodash');

// Exposed Personal Access Token
const GITHUB_PAT = "ghp_1234567890abcdefghijklmnopqrstuvwxyz";

console.log("App starting with token:", GITHUB_PAT);
"""
        )

    # 2. Demo Python Project (Secrets + PyPI CVEs)
    python_zip_path = os.path.join(SAMPLES_DIR, "demo_python_project.zip")
    with zipfile.ZipFile(python_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "requirements.txt",
            """# Known vulnerable dependencies for KeyScanner demo
requests==2.20.0
urllib3==1.24.1
jinja2==2.10.1
"""
        )
        zf.writestr(
            "config.py",
            """# Cloud and Third-Party API Keys (VULNERABLE)
GOOGLE_MAPS_KEY = "AIzaSyD12345678901234567890123456789"
STRIPE_LIVE_SECRET = "sk_live_51Abcdefghijklmnopqrstuvw"
AWS_ACCESS_KEY = "AKIA9876543210FEDCBA"

# Generic High-Entropy Token
API_SECRET_TOKEN = "zP9#mK2$vL5@8jR!1tY6bN4cF0wX3qA7"
"""
        )
        zf.writestr(
            "app.py",
            """import requests

def main():
    print("Demo Python service ready.")

if __name__ == "__main__":
    main()
"""
        )

    # 3. Demo Clean Project (0 Secrets, 0 CVEs)
    clean_zip_path = os.path.join(SAMPLES_DIR, "demo_clean_project.zip")
    with zipfile.ZipFile(clean_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "package.json",
            """{
  "name": "clean-modern-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.21.2"
  }
}
"""
        )
        zf.writestr(
            "index.js",
            """// Clean project using standard environment variable references
const port = process.env.PORT || 3000;
console.log(`Server starting on port ${port}`);
"""
        )

    # 4. NEW: Demo Full-Stack Monorepo (Multi-ecosystem PyPI + npm lockfile + RSA Key + MongoDB + Slack Bot)
    fullstack_zip_path = os.path.join(SAMPLES_DIR, "demo_fullstack_monorepo.zip")
    with zipfile.ZipFile(fullstack_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "backend/requirements.txt",
            """django==3.1.1
pyyaml==5.3
cryptography==3.2
"""
        )
        zf.writestr(
            "backend/settings.py",
            """# Fullstack Backend Settings with exposed credentials
MONGO_Cluster_URI = "mongodb+srv://admin_root:M0ng0Pr0dP4ssw0rd99!@cluster0.mongodb.net/production"
aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
SLACK_BOT_TOKEN = "xoxb-123456789012-1234567890123-AbCdEfGhIjKlMnOpQrStUvWx"
"""
        )
        zf.writestr(
            "backend/certs/id_rsa_deploy.pem",
            """-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy0AHB7M+wDemoKeyOnly
-----END RSA PRIVATE KEY-----
"""
        )
        zf.writestr(
            "frontend/package-lock.json",
            """{
  "name": "monorepo-web-client",
  "version": "2.1.0",
  "lockfileVersion": 2,
  "packages": {
    "node_modules/jsonwebtoken": {
      "version": "8.5.1"
    },
    "node_modules/minimist": {
      "version": "1.2.5"
    }
  }
}
"""
        )
        zf.writestr(
            "frontend/src/config.ts",
            """export const STRIPE_TEST_PUBLIC = "pk_test_51H8zX2AbcdefghijklmnopQRST1234";
export const INTERNAL_AUTH_TOKEN = "auth_token_9876543210abcdef12345678";
"""
        )

    # 5. NEW: Demo DevOps & Cloud Infrastructure (Secrets Only - 0 Vulnerable Dependencies)
    devops_zip_path = os.path.join(SAMPLES_DIR, "demo_devops_keys_only.zip")
    with zipfile.ZipFile(devops_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "infra/terraform.tfvars",
            """# Cloud Provisioning Variables
aws_access_key = "AKIA5566778899ABCDEF"
aws_secret_key = "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789/+Ab"
gcp_api_key    = "AIzaSyB9876543210zyxwvutsrqponmlkjihgfe"
"""
        )
        zf.writestr(
            "scripts/db_backup.sh",
            """#!/bin/bash
# Automated nightly MySQL dump
MYSQL_CONN="mysql://backup_operator:B4ckupM4st3rK3y2026@10.0.14.85:3306/billing_prod"
GITHUB_RELEASE_TOKEN="gho_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
echo "Starting backup..."
"""
        )
        zf.writestr(
            "ssh/deploy_ed25519",
            """-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
-----END OPENSSH PRIVATE KEY-----
"""
        )
        zf.writestr(
            "payment/stripe_sandbox.env",
            """# Low severity sandbox key + medium generic secret
STRIPE_SANDBOX_KEY=sk_test_51SandboxKeyForTestingOnly123456
WEBHOOK_SECRET_KEY="whsec_custom_signing_secret_key_998877"
"""
        )

    # 6. NEW: Demo Legacy Supply-Chain Project (Vulnerable Dependencies Only - 0 Leaked Secrets)
    legacy_cves_zip_path = os.path.join(SAMPLES_DIR, "demo_legacy_cves_only.zip")
    with zipfile.ZipFile(legacy_cves_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "requirements.txt",
            """# Legacy Python backend dependencies with multiple CVEs
flask==0.12.2
werkzeug==0.14.1
pillow==8.1.0
sqlalchemy==1.3.0
paramiko==2.4.1
"""
        )
        zf.writestr(
            "package.json",
            """{
  "name": "legacy-dashboard-ui",
  "version": "0.9.4",
  "dependencies": {
    "semver": "5.7.1",
    "socket.io": "2.3.0",
    "node-fetch": "2.6.0"
  }
}
"""
        )
        zf.writestr(
            "server.py",
            """import os
from flask import Flask

app = Flask(__name__)
# Good practice: reading secrets strictly from environment variables (0 secrets exposed)
DB_URI = os.environ.get("PROD_DATABASE_URI")
JWT_SECRET = os.environ.get("PROD_JWT_SECRET")

@app.route("/status")
def status():
    return {"ok": True}
"""
        )

    print("Created 6 sample zip archives:")
    for path in (
        node_zip_path,
        python_zip_path,
        clean_zip_path,
        fullstack_zip_path,
        devops_zip_path,
        legacy_cves_zip_path,
    ):
        print(" -", path)


if __name__ == "__main__":
    create_samples()
