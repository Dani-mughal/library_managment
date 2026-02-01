# Deployment Guide

Production deployment guide for the MUST Library Management System.

---

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Database backed up
- [ ] Environment variables configured
- [ ] HTTPS certificate obtained
- [ ] Domain name configured
- [ ] Server resources allocated
- [ ] Security audit completed

---

## Server Requirements

### Minimum Specifications

- **OS**: Ubuntu 20.04 LTS or Windows Server 2019+
- **RAM**: 2GB (4GB recommended)
- **Storage**: 10GB (20GB+ for growth)
- **CPU**: 2 cores
- **Network**: Static IP address

### Software Requirements

- Node.js v14+ (v18 LTS recommended)
- MySQL 8.0+
- Nginx or Apache (for reverse proxy)
- PM2 (process manager)
- SSL certificate (Let's Encrypt)

---

## Deployment Options

### Option 1: Traditional VPS (Recommended for Production)

**Providers**: DigitalOcean, Linode, AWS EC2, Azure VM

**Steps:**
1. Provision server
2. Install dependencies
3. Configure firewall
4. Set up reverse proxy
5. Enable HTTPS
6. Deploy application
7. Configure auto-restart

### Option 2: Platform as a Service (PaaS)

**Providers**: Heroku, Render, Railway

**Pros**: Simplified deployment, auto-scaling
**Cons**: Less control, potentially higher cost

### Option 3: Docker Container

**Providers**: AWS ECS, Google Cloud Run, Azure Container Instances

**Pros**: Isolated environment, easy scaling
**Cons**: Requires Docker knowledge

---

## Step-by-Step Deployment (Ubuntu VPS)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### Step 2: Create Application User

```bash
sudo adduser library
sudo usermod -aG sudo library
su - library
```

### Step 3: Transfer Files

**From local machine:**
```bash
# Using SCP
scp -r library_managment library@your-server-ip:/home/library/

# Or using Git
ssh library@your-server-ip
git clone <your-repo-url> library_managment
```

### Step 4: Database Setup

```bash
# Login to MySQL
sudo mysql -u root -p

# Create production database
CREATE DATABASE library_system;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON library_system.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
cd ~/library_managment/database
mysql -u library_user -p library_system < 01_create_database.sql
mysql -u library_user -p library_system < 02_create_users_table.sql
mysql -u library_user -p library_system < 03_create_books_table.sql
mysql -u library_user -p library_system < 05_borrowings_table.sql
mysql -u library_user -p library_system < 04_update_book_images.sql
```

### Step 5: Configure Environment

```bash
cd ~/library_managment/backend
nano .env
```

**Production `.env`:**
```env
# Database
DB_HOST=localhost
DB_USER=library_user
DB_PASSWORD=your_strong_password
DB_NAME=library_system

# Server
PORT=3000
NODE_ENV=production

# Security
SESSION_SECRET=generate_random_string_here
```

### Step 6: Install Dependencies

```bash
npm install --production
```

### Step 7: Start Application with PM2

```bash
cd ~/library_managment/backend
pm2 start server.js --name library-system
pm2 save
pm2 startup
# Follow the command it gives you to enable auto-start on boot
```

### Step 8: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/library-system
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Serve static files directly
    location /images/ {
        alias /home/library/library_managment/front_end/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/library-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Enable HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow prompts. Certbot will auto-configure Nginx for HTTPS.

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Step 10: Configure Firewall

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
sudo ufw status
```

---

## Security Hardening

### 1. Environment Variables

Never commit `.env` to version control!

```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

### 2. Update CORS for Production

Edit `backend/server.js`:
```javascript
const corsOptions = {
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

### 3. Add Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Enable Helmet for Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 5. Implement JWT Tokens

Replace sessionStorage with JWT for better security:
```bash
npm install jsonwebtoken
```

### 6. SQL Injection Protection

Already using parameterized queries ✅

### 7. XSS Protection

Sanitize inputs on backend:
```bash
npm install xss-clean
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit          # Real-time monitoring
pm2 logs           # View logs
pm2 list           # List processes
pm2 restart library-system  # Restart app
```

### Setup Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Application Logging

Add Winston logger:
```bash
npm install winston
```

---

## Database Backups

### Automated Daily Backups

Create backup script:
```bash
nano ~/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/library/backups"
mkdir -p $BACKUP_DIR

mysqldump -u library_user -p'your_password' library_system > $BACKUP_DIR/library_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "library_*.sql" -mtime +7 -delete
```

Make executable:
```bash
chmod +x ~/backup-db.sh
```

Add to crontab:
```bash
crontab -e
# Add: Daily backup at 2 AM
0 2 * * * /home/library/backup-db.sh
```

---

## Performance Optimization

### 1. Enable Gzip Compression (Nginx)

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Enable Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Connection Pooling

Already configured in `db.js` ✅

### 4. Use CDN for Static Assets

Upload images to CDN and update `image_url` in database.

---

## Scaling Strategies

### Vertical Scaling

- Upgrade server resources (RAM, CPU)
- Increase MySQL buffer pool size

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Deploy multiple Node.js instances
- Use PM2 cluster mode:
  ```bash
  pm2 start server.js -i max --name library-system
  ```

### Database Scaling

- Read replicas for queries
- Master-slave replication
- Database sharding for large datasets

---

## Updating the Application

### Zero-Downtime Deployment

```bash
cd ~/library_managment
git pull origin main
cd backend
npm install --production
pm2 reload library-system
```

**PM2 reload** gracefully restarts the app without downtime.

---

## Troubleshooting Production Issues

### Application Won't Start

```bash
pm2 logs library-system --err
```

Check for:
- Database connection errors
- Missing environment variables
- Port conflicts

### Database Connection Failed

```bash
mysql -u library_user -p
```

Verify:
- Credentials in `.env`
- MySQL service running: `sudo systemctl status mysql`

### Nginx 502 Bad Gateway

```bash
sudo nginx -t
sudo systemctl status nginx
pm2 status
```

Ensure Node.js app is running on correct port.

---

## Rollback Procedure

```bash
cd ~/library_managment
git log
git checkout <previous-commit-hash>
cd backend
pm2 reload library-system
```

---

## Health Checks

### Create Health Endpoint

Add to `backend/server.js`:
```javascript
app.get ('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
```

### Monitor with Uptime Robot

- Sign up at uptimerobot.com
- Add monitor for `https://your-domain.com/health`
- Get alerts if site goes down

---

## Production Checklist

Before going live:

- [ ] HTTPS enabled
- [ ] `.env` secure and not in Git
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] Database backups automated
- [ ] PM2 configured for auto-restart
- [ ] Nginx optimized
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Error logging enabled
- [ ] Performance tested
- [ ] Security audit passed

---

**Ready for Production! 🚀**

Your application is now deployed and accessible at `https://your-domain.com`
