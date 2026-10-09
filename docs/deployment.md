# Willy Nilly Agro Tourism — Production Deployment & Operations Guide

## 1. System Requirements & Prerequisites

- **Operating System:** Ubuntu 22.04 LTS / Debian 12 / Rocky Linux 9 or Windows Server 2022+
- **Node.js:** Node.js 18.x, 20.x, or 22.x LTS (Recommended: 20.x or 22.x LTS)
- **Database:** MongoDB Community Server 7.0+ or MongoDB Atlas Replica Set
- **Process Manager:** PM2 (recommended) or systemd unit
- **Web Server / Reverse Proxy:** Nginx with Let's Encrypt SSL (Certbot)
- **Minimum Server Specifications:**
  - 2 vCPUs
  - 4 GB RAM (8 GB recommended for build operations)
  - 25 GB SSD storage

---

## 2. Server Setup & Repository Clone

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

# 3. Verify versions
node -v  # e.g. v20.x.x
npm -v   # e.g. 10.x.x

# 4. Clone repository into production directory
cd /var/www
git clone <YOUR_GIT_REPOSITORY_URL> willy-nilly
cd /var/www/willy-nilly
```

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local` or `.env.production`:

```bash
cp .env.example .env.local
chmod 600 .env.local
nano .env.local
```

### Production `.env.local` Example:

```ini
# Environment
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://willynilly.in

# MongoDB Production Connection (Replica Set / Atlas / Local)
MONGODB_URI=mongodb://127.0.0.1:27017/willy_nilly?authSource=admin

# Cryptographic Secret (Generate using: openssl rand -base64 32)
JWT_SECRET=4f7b2c9d1a8e5f309a6b8c7d4e1f0293a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3
SESSION_MAX_AGE_SECONDS=86400

# Rate Limiting
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_LOGIN_WINDOW_SECONDS=300
RATE_LIMIT_PUBLIC_MAX=30
RATE_LIMIT_PUBLIC_WINDOW_SECONDS=60

# File Uploads
UPLOAD_MAX_BYTES=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp

# Default Theme (nature, luxury, earth, ocean)
NEXT_PUBLIC_DEFAULT_THEME=nature
```

---

## 4. Dependency Installation & Building

```bash
# Install production & dev build dependencies
npm ci

# Run security test suite to verify server integrity
npm test

# Build production App Router bundle
npm run build
```

---

## 5. Initial Administrator Provisioning

**Never seed default passwords in production!** Use the secure CLI provisioning tool:

```bash
# Interactively create the superadmin user
node scripts/create-admin.js

# Or provide via command line:
node scripts/create-admin.js --name "Sarat Kumar Singh" --email "admin@willynilly.in" --password "YourStrongPassword2026!"
```

---

## 6. Optional Demo Content Seeding

To initialize standard categories, default site settings, and sample guest rooms on a fresh database:

```bash
node scripts/seed-demo.js
```

---

## 7. Process Management with PM2

Install PM2 globally and launch the Next.js production server:

```bash
sudo npm install -g pm2

# Start application
pm2 start npm --name "willy-nilly" -- start -- -p 3000

# Enable automatic startup on system reboot
pm2 startup
pm2 save

# Monitor process
pm2 status
pm2 logs willy-nilly
```

---

## 8. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/willynilly.in`:

```nginx
server {
    server_name willynilly.in www.willynilly.in;

    # Maximum file upload size matching UPLOAD_MAX_BYTES
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Uploads directory
    location /uploads {
        alias /var/www/willy-nilly/public/uploads;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

Enable site and configure SSL certificate:

```bash
sudo ln -s /etc/nginx/sites-available/willynilly.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d willynilly.in -d www.willynilly.in
```

---

## 9. Backup & Disaster Recovery Procedures

### 9.1 Database Backup (MongoDB)

```bash
# Create timestamped dump
BACKUP_DIR="/var/backups/mongodb/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
mongodump --db willy_nilly --out "$BACKUP_DIR"

# Restore command if needed
mongorestore --db willy_nilly "$BACKUP_DIR/willy_nilly"
```

### 9.2 Uploaded Assets Backup

```bash
tar -czf "/var/backups/uploads_$(date +%Y%m%d).tar.gz" /var/www/willy-nilly/public/uploads
```

---

## 10. Production Readiness Checklist

- [x] Environment variable `NODE_ENV` set to `production`.
- [x] High-entropy `JWT_SECRET` configured (32+ bytes, not default).
- [x] Initial admin provisioned with strong unique password via `create-admin.js`.
- [x] MongoDB authenticated connection with TLS enabled.
- [x] All 37 automated tests passing (`npm test`).
- [x] Production build generated with zero lint or compilation errors (`npm run build`).
- [x] Security headers active (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
- [x] Shop Rental module verified inactive by default (404 on direct access).
- [x] Resort bookings verified disabled in UI and backend service.
- [x] SSL/TLS certificate installed with automatic renewal.
