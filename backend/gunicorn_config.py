"""
Gunicorn Configuration File
Production WSGI server configuration
"""
import multiprocessing

# Server Socket
bind = "127.0.0.1:5000"  # Bind to localhost (Nginx will proxy)
backlog = 2048

# Worker Processes
workers = multiprocessing.cpu_count() * 2 + 1  # Recommended formula
worker_class = "sync"  # Use 'gevent' or 'eventlet' for async
worker_connections = 1000
max_requests = 1000  # Restart workers after this many requests (prevents memory leaks)
max_requests_jitter = 50  # Add randomness to max_requests
timeout = 30  # Workers timeout after 30 seconds
keepalive = 2

# Logging
accesslog = "/var/log/gunicorn/access.log"  # Access log
errorlog = "/var/log/gunicorn/error.log"    # Error log
loglevel = "info"  # Logging level: debug, info, warning, error, critical
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process Naming
proc_name = "businessdiary"

# Server Mechanics
daemon = False  # Don't daemonize (systemd handles this)
pidfile = "/var/run/gunicorn/businessdiary.pid"
umask = 0
user = None  # Run as current user (set to 'www-data' if needed)
group = None
tmp_upload_dir = None

# SSL (if terminating SSL at Gunicorn instead of Nginx)
# keyfile = "/path/to/keyfile.key"
# certfile = "/path/to/certfile.crt"

# Preload app for faster worker boot times
preload_app = True

# Restart workers gracefully
graceful_timeout = 30

# Limit request line size
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190
