#!/bin/bash

# Business Directory Deployment Script
# This script automates deployment to a VPS server

set -e  # Exit on error

echo "🚀 Business Directory Deployment Script"
echo "========================================"

# Configuration
APP_NAME="businessdiary"
APP_DIR="/var/www/$APP_NAME"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
SYSTEMD_SERVICE="/etc/systemd/system/$APP_NAME.service"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Update system
print_info "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Step 2: Install dependencies
print_info "Installing dependencies..."
apt install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib nodejs npm git
print_success "Dependencies installed"

# Step 3: Create application directory
print_info "Creating application directory..."
mkdir -p $APP_DIR
mkdir -p /var/log/gunicorn
print_success "Directory created: $APP_DIR"

# Step 4: Setup PostgreSQL
print_info "Setting up PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE DATABASE businessdiary_prod;
CREATE USER dbuser WITH PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE businessdiary_prod TO dbuser;
\q
EOF
print_success "PostgreSQL configured"

# Step 5: Clone or copy application
print_info "Deploying application files..."
# You would typically git clone or rsync here
# git clone https://github.com/yourusername/businessdiary.git $APP_DIR
print_info "Copy your application files to $APP_DIR manually"

# Step 6: Setup Python virtual environment
print_info "Setting up Python virtual environment..."
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
print_success "Backend dependencies installed"

# Step 7: Build React frontend
print_info "Building React frontend..."
cd $FRONTEND_DIR
npm install
npm run build
print_success "Frontend built"

# Step 8: Setup environment variables
print_info "Setting up environment variables..."
if [ ! -f "$APP_DIR/.env" ]; then
    cp $APP_DIR/.env.example $APP_DIR/.env
    print_info "Please edit $APP_DIR/.env with your configuration"
fi

# Step 9: Database migration
print_info "Running database migrations..."
cd $BACKEND_DIR
source venv/bin/activate
python recreate_db.py
python add_categories.py
python add_subcategories.py
python populate_data.py
print_success "Database initialized"

# Step 10: Configure Nginx
print_info "Configuring Nginx..."
cp $APP_DIR/nginx.conf $NGINX_CONF
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
print_success "Nginx configured"

# Step 11: Setup Systemd service
print_info "Setting up systemd service..."
cp $APP_DIR/businessdiary.service $SYSTEMD_SERVICE
systemctl daemon-reload
systemctl enable $APP_NAME
systemctl start $APP_NAME
print_success "Systemd service configured"

# Step 12: Setup SSL with Let's Encrypt
print_info "Setting up SSL certificate..."
apt install -y certbot python3-certbot-nginx
print_info "Run: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"

# Step 13: Configure Firewall
print_info "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
print_success "Firewall configured"

# Step 14: Set permissions
print_info "Setting permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
print_success "Permissions set"

# Final status check
echo ""
echo "=========================================="
print_success "Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit $APP_DIR/.env with your configuration"
echo "2. Update domain in $NGINX_CONF"
echo "3. Run: sudo certbot --nginx -d yourdomain.com"
echo "4. Check service status: sudo systemctl status $APP_NAME"
echo "5. View logs: sudo journalctl -u $APP_NAME -f"
echo ""
echo "Application URLs:"
echo "  Backend API: http://your-server-ip:5000/api"
echo "  Frontend: http://your-server-ip"
echo ""
