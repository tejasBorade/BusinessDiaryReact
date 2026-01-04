# Production Deployment Guide - Business Directory

## 📋 Overview
This guide covers deploying your Business Directory application to production servers.

---

## 🏗️ Deployment Architecture Options

### **Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)**
- Full control over server
- Cost: $5-20/month
- Best for: Learning and flexibility

### **Option 2: Platform as a Service (Heroku, Render, Railway)**
- Easiest deployment
- Cost: $0-15/month
- Best for: Quick launch

### **Option 3: Cloud Hosting (AWS, Google Cloud, Azure)**
- Scalable and enterprise-ready
- Cost: Variable
- Best for: Large scale

---

## 🔧 Production Configuration Changes

### 1. Database Migration
**⚠️ Important: SQLite is NOT recommended for production**

**Recommended: PostgreSQL or MySQL**

#### Install PostgreSQL (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb businessdiary_prod
sudo -u postgres psql -c "CREATE USER dbuser WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE businessdiary_prod TO dbuser;"
```

#### Update requirements.txt:
```
psycopg2-binary==2.9.9  # For PostgreSQL
```

### 2. Environment Variables
Never hardcode sensitive data. Use environment variables.

### 3. HTTPS/SSL Setup
Always use HTTPS in production for security.

### 4. Static File Serving
Use Nginx to serve React build files efficiently.

### 5. Process Management
Use systemd or PM2 to keep applications running.

---

## 📝 Step-by-Step Deployment

### **STEP 1: Prepare Backend for Production**

1. Update `backend/config.py` with production settings
2. Install production dependencies
3. Set up PostgreSQL database
4. Configure Gunicorn as WSGI server
5. Set up Nginx as reverse proxy

### **STEP 2: Build React Frontend**

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/build/`

### **STEP 3: Configure Web Server (Nginx)**

Nginx will:
- Serve React static files
- Proxy API requests to Flask backend
- Handle SSL/TLS certificates

### **STEP 4: Set Up SSL Certificate**

Use Let's Encrypt (Free):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### **STEP 5: Configure Systemd Services**

Keep Flask app running as a background service.

---

## 📦 Deployment Options

### **Option A: Single VPS Server (Recommended for Start)**

**Server Requirements:**
- OS: Ubuntu 22.04 LTS or 24.04 LTS
- RAM: 2GB minimum (4GB recommended)
- Storage: 20GB minimum
- CPU: 1-2 cores

**Cost Estimate:** $10-15/month (DigitalOcean, Vultr, Linode)

### **Option B: Heroku (Easiest)**

**Pros:**
- Simple git-based deployment
- Free tier available
- Automatic HTTPS
- Built-in PostgreSQL

**Cons:**
- More expensive as you scale
- Less control

### **Option C: Docker Container**

Use Docker for consistent deployment across environments.

---

## 🔐 Security Checklist

- [ ] Change SECRET_KEY to strong random value
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall (UFW)
- [ ] Use PostgreSQL instead of SQLite
- [ ] Disable Flask debug mode (`DEBUG=False`)
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Use strong database passwords
- [ ] Regular backups
- [ ] Keep dependencies updated

---

## 🌐 Domain Setup

1. **Buy a domain** (Namecheap, GoDaddy, Google Domains)
2. **Point DNS to your server:**
   ```
   A Record: @ → Your_Server_IP
   A Record: www → Your_Server_IP
   ```
3. **Wait for DNS propagation** (5 minutes to 48 hours)

---

## 📊 Monitoring & Maintenance

### Essential Tools:
- **PM2**: Process monitoring
- **Nginx logs**: `/var/log/nginx/`
- **PostgreSQL backups**: Daily automated backups
- **Uptime monitoring**: UptimeRobot (free)

### Daily Backups:
```bash
# PostgreSQL backup
pg_dump businessdiary_prod > backup_$(date +%Y%m%d).sql
```

---

## 🚀 Quick Start Deployment Scripts

All configuration files have been created in your project. Check:

1. `backend/prod_config.py` - Production configuration
2. `backend/wsgi.py` - WSGI entry point
3. `nginx.conf` - Nginx configuration
4. `gunicorn_config.py` - Gunicorn settings
5. `businessdiary.service` - Systemd service file
6. `Dockerfile` - Docker configuration
7. `.env.example` - Environment variables template

---

## 📞 Next Steps

1. Choose your deployment option
2. Set up production configuration files
3. Test deployment on staging environment first
4. Monitor application after launch
5. Set up automatic backups

---

## 💡 Recommended Hosting Providers

### VPS Hosting:
- **DigitalOcean**: $6/month droplet (1GB RAM)
- **Vultr**: $6/month cloud compute
- **Linode**: $5/month Nanode

### PaaS:
- **Render**: Free tier available, $7/month paid
- **Railway**: Free tier, then pay-as-you-go
- **Heroku**: $7/month basic dynos

### Domain Registrars:
- **Namecheap**: ~$10/year
- **Google Domains**: ~$12/year
- **Cloudflare**: ~$9/year (includes DDoS protection)

---

## ⚠️ Common Issues

1. **502 Bad Gateway**: Flask app not running or wrong port
2. **CORS errors**: Update CORS configuration in Flask
3. **Static files not loading**: Check Nginx static file path
4. **Database connection failed**: Verify PostgreSQL credentials
5. **Permission denied**: Check file/folder permissions

---

## 📚 Additional Resources

- Flask deployment: https://flask.palletsprojects.com/en/2.3.x/deploying/
- Nginx documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
- PostgreSQL setup: https://www.postgresql.org/docs/

---

**Ready to deploy? Start with the configuration files created in your project!**
