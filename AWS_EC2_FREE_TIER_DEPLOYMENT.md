# AWS EC2 Free Tier Deployment (FREE for 12 months)

Deploy your Spring Boot backend on AWS EC2 completely FREE for 12 months.

## AWS Free Tier Benefits
- ✅ **FREE for 12 months** (750 hours/month)
- ✅ t2.micro instance (1 GB RAM, 1 vCPU)
- ✅ 30 GB SSD storage
- ✅ 15 GB data transfer out/month
- ✅ After 12 months: ~$8-10/month

## Prerequisites
- AWS Account (free tier eligible)
- GitHub repository
- Supabase database (already configured)

## Deployment Steps (30 minutes)

### Step 1: Launch EC2 Instance (10 minutes)

1. **Go to AWS Console** → Search "EC2" → Click "Launch Instance"

2. **Name and tags:**
   - Name: `samaysetu-backend`

3. **Application and OS Images:**
   - AMI: `Ubuntu Server 22.04 LTS` (Free tier eligible)
   - Architecture: `64-bit (x86)`

4. **Instance type:**
   - Type: `t2.micro` (Free tier eligible)
   - 1 vCPU, 1 GB RAM

5. **Key pair (login):**
   - Click "Create new key pair"
   - Key pair name: `samaysetu-key`
   - Key pair type: `RSA`
   - Private key format: `.pem` (for SSH) or `.ppk` (for PuTTY)
   - Click "Create key pair"
   - **Save the downloaded file** - you'll need it to connect

6. **Network settings:**
   - Click "Edit"
   - Auto-assign public IP: `Enable`
   - Firewall (security groups): `Create security group`
   - Security group name: `samaysetu-backend-sg`
   
   **Add these rules:**
   - Rule 1: SSH (port 22) - Source: `My IP` (for security)
   - Rule 2: HTTP (port 80) - Source: `Anywhere` (0.0.0.0/0)
   - Rule 3: HTTPS (port 443) - Source: `Anywhere` (0.0.0.0/0)
   - Rule 4: Custom TCP (port 8080) - Source: `Anywhere` (0.0.0.0/0)

7. **Configure storage:**
   - Size: `30 GB` (Free tier eligible)
   - Volume type: `gp3`

8. **Advanced details:**
   - Leave as default

9. Click "Launch instance"

10. Wait 2-3 minutes for instance to start

### Step 2: Connect to EC2 Instance (5 minutes)

#### Option A: Using EC2 Instance Connect (Easiest)

1. Go to EC2 Console → Instances
2. Select your instance
3. Click "Connect" button
4. Choose "EC2 Instance Connect"
5. Click "Connect" - opens a browser terminal

#### Option B: Using SSH (Windows)

1. Open PowerShell or Command Prompt
2. Navigate to where you saved the key file:
```bash
cd Downloads
```

3. Connect:
```bash
ssh -i samaysetu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Replace `YOUR_EC2_PUBLIC_IP` with your instance's public IP (find it in EC2 console)

### Step 3: Install Java and Dependencies (5 minutes)

Once connected to your EC2 instance:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Verify Java installation
java -version

# Install Git
sudo apt install git -y

# Install Maven
sudo apt install maven -y

# Install nginx (for reverse proxy)
sudo apt install nginx -y
```

### Step 4: Clone and Build Your Application (5 minutes)

```bash
# Clone your repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/SamaySetu.git
cd SamaySetu/Backend

# Make mvnw executable
chmod +x mvnw

# Build the application
./mvnw clean package -DskipTests

# Verify JAR was created
ls -lh target/samaysetu-0.0.1-SNAPSHOT.jar
```

### Step 5: Create Environment Variables (2 minutes)

```bash
# Create environment file
sudo nano /etc/environment
```

Add these lines:
```bash
SPRING_DATASOURCE_URL="jdbc:postgresql://db.tehdpecquwvgwpombtbl.supabase.co:5432/postgres"
SPRING_DATASOURCE_USERNAME="postgres"
SPRING_DATASOURCE_PASSWORD="samaysetumitaoe"
SPRING_PROFILES_ACTIVE="prod"
PORT="8080"
```

Save and exit (Ctrl+X, then Y, then Enter)

Load the environment:
```bash
source /etc/environment
```

### Step 6: Create Systemd Service (3 minutes)

Create a service file to run your app automatically:

```bash
sudo nano /etc/systemd/system/samaysetu.service
```

Paste this content:
```ini
[Unit]
Description=SamaySetu Backend Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/SamaySetu/Backend
ExecStart=/usr/bin/java -jar /home/ubuntu/SamaySetu/Backend/target/samaysetu-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=samaysetu

Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://db.tehdpecquwvgwpombtbl.supabase.co:5432/postgres"
Environment="SPRING_DATASOURCE_USERNAME=postgres"
Environment="SPRING_DATASOURCE_PASSWORD=samaysetumitaoe"
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="PORT=8080"

[Install]
WantedBy=multi-user.target
```

Save and exit (Ctrl+X, then Y, then Enter)

Enable and start the service:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable samaysetu

# Start the service
sudo systemctl start samaysetu

# Check status
sudo systemctl status samaysetu
```

You should see "active (running)" in green.

### Step 7: Configure Nginx Reverse Proxy (5 minutes)

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/samaysetu
```

Paste this content:
```nginx
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
}
```

Save and exit (Ctrl+X, then Y, then Enter)

Enable the site:
```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Enable our site
sudo ln -s /etc/nginx/sites-available/samaysetu /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 8: Test Your Deployment (2 minutes)

1. Get your EC2 public IP from AWS Console
2. Test in browser:
   - `http://YOUR_EC2_PUBLIC_IP/actuator/health`
   - Should return: `{"status":"UP"}`

3. Test API endpoints:
   - `http://YOUR_EC2_PUBLIC_IP/api/auth/login`

## Managing Your Application

### View Logs
```bash
# View application logs
sudo journalctl -u samaysetu -f

# View last 100 lines
sudo journalctl -u samaysetu -n 100
```

### Restart Application
```bash
sudo systemctl restart samaysetu
```

### Stop Application
```bash
sudo systemctl stop samaysetu
```

### Update Application
```bash
# Pull latest code
cd /home/ubuntu/SamaySetu
git pull origin main

# Rebuild
cd Backend
./mvnw clean package -DskipTests

# Restart service
sudo systemctl restart samaysetu
```

## Add HTTPS with Let's Encrypt (Optional, 10 minutes)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

## Monitoring

### Check if app is running
```bash
sudo systemctl status samaysetu
```

### Check memory usage
```bash
free -h
```

### Check disk usage
```bash
df -h
```

### Check CPU usage
```bash
top
```

## Troubleshooting

### Application won't start
```bash
# Check logs
sudo journalctl -u samaysetu -n 50

# Check if port 8080 is in use
sudo netstat -tulpn | grep 8080

# Restart service
sudo systemctl restart samaysetu
```

### Can't connect to database
```bash
# Test database connection
telnet db.tehdpecquwvgwpombtbl.supabase.co 5432

# Check environment variables
sudo systemctl show samaysetu | grep Environment
```

### Nginx errors
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Security Best Practices

1. **Update security group:**
   - Remove port 8080 access (only allow nginx on port 80/443)
   - Restrict SSH to your IP only

2. **Keep system updated:**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Enable firewall:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Cost After Free Tier (12 months)

- t2.micro: ~$8-10/month
- Or upgrade to t3.micro: ~$7-9/month (better performance)

## Advantages

✅ **FREE for 12 months**
✅ **Full control** over server
✅ **No vendor lock-in**
✅ **Can run multiple apps**
✅ **SSH access**
✅ **Cheap after free tier** (~$8/month)

## Next Steps

1. **Add custom domain** (optional)
2. **Set up HTTPS** with Let's Encrypt
3. **Configure CloudWatch** for monitoring
4. **Set up automated backups**
5. **Deploy frontend** to AWS Amplify (also free)
