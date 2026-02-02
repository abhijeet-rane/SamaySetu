# Quick Start: AWS EC2 Free Tier (FREE for 12 months)

## Why EC2 Free Tier?
- ✅ **FREE for 12 months** (750 hours/month)
- ✅ t2.micro (1 GB RAM, 1 vCPU)
- ✅ 30 GB storage
- ✅ Full control over server
- ✅ Only ~$8/month after free tier

## Step 1: Launch EC2 Instance (10 min)

1. **AWS Console** → EC2 → "Launch Instance"
2. **Settings:**
   - Name: `samaysetu-backend`
   - AMI: `Ubuntu Server 22.04 LTS`
   - Instance type: `t2.micro` ✅ Free tier
   - Key pair: Create new → `samaysetu-key` → Download `.pem` file
   - Security group: Create new
     - SSH (22): My IP
     - HTTP (80): Anywhere
     - HTTPS (443): Anywhere
     - Custom TCP (8080): Anywhere
   - Storage: `30 GB` ✅ Free tier
3. Click "Launch instance"

## Step 2: Connect to Instance (2 min)

**Option A: Browser (Easiest)**
1. EC2 Console → Select instance → "Connect"
2. Choose "EC2 Instance Connect" → "Connect"

**Option B: SSH**
```bash
ssh -i samaysetu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 3: Install Software (5 min)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17, Git, Maven, Nginx
sudo apt install openjdk-17-jdk git maven nginx -y

# Verify
java -version
```

## Step 4: Deploy Application (5 min)

```bash
# Clone repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/SamaySetu.git
cd SamaySetu/Backend

# Build
chmod +x mvnw
./mvnw clean package -DskipTests
```

## Step 5: Create Service (3 min)

```bash
sudo nano /etc/systemd/system/samaysetu.service
```

Paste this:
```ini
[Unit]
Description=SamaySetu Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/SamaySetu/Backend
ExecStart=/usr/bin/java -jar /home/ubuntu/SamaySetu/Backend/target/samaysetu-0.0.1-SNAPSHOT.jar
Restart=always
Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://db.tehdpecquwvgwpombtbl.supabase.co:5432/postgres"
Environment="SPRING_DATASOURCE_USERNAME=postgres"
Environment="SPRING_DATASOURCE_PASSWORD=samaysetumitaoe"
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="PORT=8080"

[Install]
WantedBy=multi-user.target
```

Save: `Ctrl+X` → `Y` → `Enter`

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable samaysetu
sudo systemctl start samaysetu
sudo systemctl status samaysetu
```

## Step 6: Configure Nginx (3 min)

```bash
sudo nano /etc/nginx/sites-available/samaysetu
```

Paste this:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save: `Ctrl+X` → `Y` → `Enter`

Enable:
```bash
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/samaysetu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Test (1 min)

Get your EC2 Public IP from AWS Console, then test:
```
http://YOUR_EC2_PUBLIC_IP/actuator/health
```

Should return: `{"status":"UP"}` ✅

## Done! 🎉

Your backend is now:
- ✅ Running on AWS EC2
- ✅ FREE for 12 months
- ✅ Auto-starts on reboot
- ✅ Connected to Supabase

## Common Commands

**View logs:**
```bash
sudo journalctl -u samaysetu -f
```

**Restart app:**
```bash
sudo systemctl restart samaysetu
```

**Update app:**
```bash
cd /home/ubuntu/SamaySetu
git pull
cd Backend
./mvnw clean package -DskipTests
sudo systemctl restart samaysetu
```

## Add HTTPS (Optional, 5 min)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

**App not starting?**
```bash
sudo journalctl -u samaysetu -n 50
```

**Can't connect?**
- Check security group allows port 80
- Check nginx is running: `sudo systemctl status nginx`
- Check app is running: `sudo systemctl status samaysetu`

**Database connection failed?**
- Check environment variables: `sudo systemctl show samaysetu | grep Environment`
- Test connection: `telnet db.tehdpecquwvgwpombtbl.supabase.co 5432`

## Cost

**First 12 months:** FREE ✅
**After 12 months:** ~$8-10/month

## Next: Deploy Frontend

Use AWS Amplify (also FREE):
1. Amplify Console → "New app"
2. Connect GitHub → Select repository
3. Build settings: Auto-detected
4. Environment variable: `VITE_API_URL = http://YOUR_EC2_IP`
5. Deploy!
