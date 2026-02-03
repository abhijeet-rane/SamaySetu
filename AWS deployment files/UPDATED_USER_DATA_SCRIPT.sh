#!/bin/bash
# Updated User Data Script for Launch Template
# This script uses the Supabase Session Pooler for IPv4 compatibility

# Update system
apt-get update
apt-get upgrade -y

# Install Java 17
apt-get install -y openjdk-17-jdk

# Install AWS CLI
apt-get install -y awscli

# Create application directory
mkdir -p /opt/samaysetu

# Download JAR from S3
aws s3 cp s3://samaysetu-deployments/samaysetu-0.0.1-SNAPSHOT.jar /opt/samaysetu/app.jar

# Create systemd service
cat > /etc/systemd/system/samaysetu.service << 'EOF'
[Unit]
Description=SamaySetu Backend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/samaysetu
ExecStart=/usr/bin/java -Djava.net.preferIPv4Stack=true -Xmx768m -jar /opt/samaysetu/app.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
Environment="SPRING_DATASOURCE_USERNAME=postgres.tehdpecquwvgwpombtbl"
Environment="SPRING_DATASOURCE_PASSWORD=samaysetumitaoe"
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="SERVER_PORT=8080"
Environment="MANAGEMENT_HEALTH_MAIL_ENABLED=false"

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable samaysetu
systemctl start samaysetu

# Install and configure nginx
apt-get install -y nginx
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

systemctl restart nginx
