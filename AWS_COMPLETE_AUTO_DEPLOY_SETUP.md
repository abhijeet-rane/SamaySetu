# Complete AWS Auto-Deploy Setup with GitHub Actions

**One-time setup for automatic deployment, load balancing, and auto-scaling on AWS Free Tier**

This guide sets up:
- ✅ Auto-deploy on git push to main branch
- ✅ Load balancer for high availability
- ✅ Auto-scaling (handles traffic spikes)
- ✅ FREE for 12 months (AWS Free Tier)
- ✅ ~$15-20/month after free tier

**Total Setup Time: 60 minutes**

---

## Architecture Overview

```
GitHub Push → GitHub Actions → Build JAR → Deploy to EC2 → Load Balancer → Your App
                                              ↓
                                         Auto Scaling Group
                                         (1-3 instances)
```

---

## Part 1: AWS Infrastructure Setup (30 minutes)

### Step 1: Create EC2 Launch Template (10 min)

1. **Go to AWS Console** → EC2 → "Launch Templates" → "Create launch template"

2. **Launch template name and description:**
   - Name: `samaysetu-backend-template`
   - Description: `Template for SamaySetu backend auto-scaling`

3. **Application and OS Images:**
   - AMI: `Ubuntu Server 22.04 LTS` (Free tier eligible)
   - Architecture: `64-bit (x86)`

4. **Instance type:**
   - Type: `t3.small` (Free tier eligible)

5. **Key pair:**
   - Create new key pair: `samaysetu-deploy-key`
   - Download and save the `.pem` file

6. **Network settings:**
   - Don't include in launch template (we'll configure in Auto Scaling Group)

7. **Storage:**
   - Size: `8 GB` (sufficient for app)
   - Volume type: `gp3`

8. **Advanced details:**
   - Scroll to "User data" section
   - Paste this script:

```bash
#!/bin/bash
# Update system
apt-get update
apt-get upgrade -y

# Install Java 17
apt-get install -y openjdk-17-jdk

# Install AWS CLI
apt-get install -y awscli

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb

# Create app directory
mkdir -p /opt/samaysetu
cd /opt/samaysetu

# Download application from S3 (will be uploaded by GitHub Actions)
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
ExecStart=/usr/bin/java -jar /opt/samaysetu/app.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://db.tehdpecquwvgwpombtbl.supabase.co:5432/postgres"
Environment="SPRING_DATASOURCE_USERNAME=postgres"
Environment="SPRING_DATASOURCE_PASSWORD=samaysetumitaoe"
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="SERVER_PORT=8080"

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
```

9. Click "Create launch template"

### Step 2: Create S3 Bucket for Deployments (3 min)

1. **Go to S3** → "Create bucket"
2. **Bucket name:** `samaysetu-deployments` (must be globally unique, add random numbers if needed)
3. **Region:** `ap-south-1` (Mumbai)
4. **Block Public Access:** Keep all blocked (default)
5. Click "Create bucket"

### Step 3: Create IAM Role for EC2 (5 min)

1. **Go to IAM** → "Roles" → "Create role"
2. **Trusted entity type:** AWS service
3. **Use case:** EC2
4. Click "Next"
5. **Add permissions:** Search and select these policies:
   - `AmazonS3ReadOnlyAccess`
   - `CloudWatchAgentServerPolicy`
6. Click "Next"
7. **Role name:** `samaysetu-ec2-role`
8. Click "Create role"

### Step 4: Create Security Groups (5 min)

#### Security Group 1: Load Balancer

1. **EC2** → "Security Groups" → "Create security group"
2. **Name:** `samaysetu-alb-sg`
3. **Description:** `Security group for Application Load Balancer`
4. **VPC:** Default VPC
5. **Inbound rules:**
   - Type: HTTP, Port: 80, Source: Anywhere (0.0.0.0/0)
   - Type: HTTPS, Port: 443, Source: Anywhere (0.0.0.0/0)
6. Click "Create security group"

#### Security Group 2: EC2 Instances

1. **Create security group**
2. **Name:** `samaysetu-ec2-sg`
3. **Description:** `Security group for EC2 instances`
4. **VPC:** Default VPC
5. **Inbound rules:**
   - Type: HTTP, Port: 80, Source: Custom → Select `samaysetu-alb-sg`
   - Type: SSH, Port: 22, Source: My IP (for debugging)
6. Click "Create security group"

### Step 5: Create Application Load Balancer (7 min)

1. **EC2** → "Load Balancers" → "Create load balancer"
2. **Load balancer type:** Application Load Balancer
3. Click "Create"

**Basic configuration:**
- Name: `samaysetu-alb`
- Scheme: `Internet-facing`
- IP address type: `IPv4`

**Network mapping:**
- VPC: Default VPC
- Mappings: Select at least 2 availability zones (e.g., ap-south-1a, ap-south-1b)

**Security groups:**
- Remove default
- Select: `samaysetu-alb-sg`

**Listeners and routing:**
- Protocol: HTTP
- Port: 80
- Click "Create target group"

**Create Target Group (in new tab):**
1. Target type: `Instances`
2. Target group name: `samaysetu-tg`
3. Protocol: HTTP
4. Port: 80
5. VPC: Default VPC
6. Health check:
   - Protocol: HTTP
   - Path: `/actuator/health`
   - Healthy threshold: 2
   - Unhealthy threshold: 3
   - Timeout: 5 seconds
   - Interval: 30 seconds
7. Click "Next"
8. Don't register any targets yet
9. Click "Create target group"

**Back to Load Balancer:**
- Refresh target groups
- Select: `samaysetu-tg`
- Click "Create load balancer"

**Copy the Load Balancer DNS name** (e.g., `samaysetu-alb-xxxxx.ap-south-1.elb.amazonaws.com`)

### Step 6: Create Auto Scaling Group (10 min)

1. **EC2** → "Auto Scaling Groups" → "Create Auto Scaling group"

**Step 1: Choose launch template**
- Name: `samaysetu-asg`
- Launch template: `samaysetu-backend-template`
- Click "Next"

**Step 2: Choose instance launch options**
- VPC: Default VPC
- Availability Zones: Select at least 2 (same as load balancer)
- Click "Next"

**Step 3: Configure advanced options**
- Load balancing: `Attach to an existing load balancer`
- Choose from your load balancer target groups: `samaysetu-tg`
- Health checks:
  - Turn on `ELB health checks`
  - Health check grace period: `300` seconds
- Click "Next"

**Step 4: Configure group size and scaling**
- Desired capacity: `1`
- Minimum capacity: `1`
- Maximum capacity: `3`

**Scaling policies:**
- Select: `Target tracking scaling policy`
- Metric type: `Average CPU utilization`
- Target value: `70`
- Instances need: `300` seconds warm up

Click "Next"

**Step 5: Add notifications (Optional)**
- Skip for now
- Click "Next"

**Step 6: Add tags**
- Key: `Name`, Value: `samaysetu-backend-instance`
- Click "Next"

**Step 7: Review**
- Review all settings
- Click "Create Auto Scaling group"

---

## Part 2: GitHub Actions Setup (15 minutes)

### Step 7: Create AWS Access Keys (5 min)

1. **Go to IAM** → "Users" → "Create user"
2. **User name:** `github-actions-deploy`
3. Click "Next"
4. **Permissions:** Attach policies directly
   - `AmazonS3FullAccess`
   - `AmazonEC2FullAccess` (for triggering instance refresh)
5. Click "Next" → "Create user"
6. Click on the user → "Security credentials" tab
7. Click "Create access key"
8. Use case: `Application running outside AWS`
9. Click "Next" → "Create access key"
10. **Copy and save:**
    - Access key ID
    - Secret access key
    (You won't be able to see the secret again!)

### Step 8: Add Secrets to GitHub (3 min)

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" for each:

**Add these secrets:**
- Name: `AWS_ACCESS_KEY_ID`, Value: [Your access key ID]
- Name: `AWS_SECRET_ACCESS_KEY`, Value: [Your secret access key]
- Name: `AWS_REGION`, Value: `ap-south-1`
- Name: `S3_BUCKET`, Value: `samaysetu-deployments` (or your bucket name)
- Name: `ASG_NAME`, Value: `samaysetu-asg`

### Step 9: Create GitHub Actions Workflow (7 min)

Create this file in your repository: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to AWS

on:
  push:
    branches:
      - main
    paths:
      - 'Backend/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: |
          cd Backend
          chmod +x mvnw
          ./mvnw clean package -DskipTests
          ls -lh target/

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload JAR to S3
        run: |
          aws s3 cp Backend/target/samaysetu-0.0.1-SNAPSHOT.jar \
            s3://${{ secrets.S3_BUCKET }}/samaysetu-0.0.1-SNAPSHOT.jar

      - name: Trigger Auto Scaling Group Instance Refresh
        run: |
          aws autoscaling start-instance-refresh \
            --auto-scaling-group-name ${{ secrets.ASG_NAME }} \
            --preferences '{"MinHealthyPercentage": 50, "InstanceWarmup": 300}'

      - name: Wait for deployment
        run: |
          echo "Waiting for instance refresh to complete..."
          sleep 60
          
          # Check refresh status
          aws autoscaling describe-instance-refreshes \
            --auto-scaling-group-name ${{ secrets.ASG_NAME }} \
            --max-records 1

      - name: Deployment complete
        run: |
          echo "✅ Deployment completed successfully!"
          echo "Your application is now running on AWS"
```

Commit and push this file:
```bash
git add .github/workflows/deploy-backend.yml
git commit -m "Add GitHub Actions auto-deploy workflow"
git push origin main
```

---

## Part 3: Initial Deployment (15 minutes)

### Step 10: Trigger First Deployment

1. **Push any change to trigger deployment:**
```bash
# Make a small change
echo "# Auto-deploy enabled" >> Backend/README.md
git add .
git commit -m "Trigger initial deployment"
git push origin main
```

2. **Watch deployment progress:**
   - Go to GitHub → Your repository → "Actions" tab
   - Click on the running workflow
   - Watch the build and deploy steps

3. **Wait for completion** (5-10 minutes for first deployment)

### Step 11: Verify Deployment

1. **Get your Load Balancer URL:**
   - EC2 → Load Balancers → Select `samaysetu-alb`
   - Copy DNS name

2. **Test endpoints:**
```bash
# Health check
curl http://YOUR-ALB-DNS-NAME/actuator/health

# Should return: {"status":"UP"}
```

3. **Check Auto Scaling Group:**
   - EC2 → Auto Scaling Groups → `samaysetu-asg`
   - Should show 1 instance running

---

## How It Works

### Automatic Deployment Flow:

1. **You push code** to `main` branch
2. **GitHub Actions triggers:**
   - Checks out code
   - Builds JAR with Maven
   - Uploads JAR to S3
   - Triggers Auto Scaling Group refresh
3. **AWS Auto Scaling:**
   - Launches new instance with updated code
   - Waits for health checks to pass
   - Terminates old instance
   - Zero downtime deployment!

### Load Balancing:

- Load balancer distributes traffic across instances
- Health checks every 30 seconds
- Automatically removes unhealthy instances
- Routes traffic only to healthy instances

### Auto Scaling:

- **Normal load:** 1 instance running
- **High CPU (>70%):** Scales up to 3 instances
- **Low CPU:** Scales down to 1 instance
- Handles traffic spikes automatically

---

## Testing Auto-Scaling

### Test Scale Up:

```bash
# Generate load (install Apache Bench)
ab -n 10000 -c 100 http://YOUR-ALB-DNS-NAME/actuator/health
```

Watch in AWS Console:
- CloudWatch → Metrics → EC2 → CPU Utilization
- Auto Scaling Groups → Activity tab
- Should launch new instances when CPU > 70%

---

## Monitoring and Logs

### View Application Logs:

1. **SSH into instance:**
```bash
ssh -i samaysetu-deploy-key.pem ubuntu@INSTANCE-PUBLIC-IP
```

2. **View logs:**
```bash
sudo journalctl -u samaysetu -f
```

### CloudWatch Metrics:

1. Go to CloudWatch → Dashboards
2. Create dashboard for:
   - CPU Utilization
   - Network In/Out
   - Request Count
   - Target Response Time

### Load Balancer Metrics:

1. EC2 → Load Balancers → Select your ALB
2. Click "Monitoring" tab
3. View:
   - Request count
   - Target response time
   - HTTP 4xx/5xx errors

---

## Updating Your Application

### Make Changes and Deploy:

```bash
# 1. Make your code changes
# Edit files in Backend/

# 2. Commit and push
git add .
git commit -m "Update feature X"
git push origin main

# 3. GitHub Actions automatically:
#    - Builds new JAR
#    - Uploads to S3
#    - Triggers rolling update
#    - Zero downtime!
```

### Monitor Deployment:

- GitHub → Actions tab → Watch workflow
- AWS Console → Auto Scaling Groups → Activity tab
- Load Balancer → Target Groups → Check health status

---

## Cost Breakdown

### Free Tier (12 months):
- ✅ EC2 t2.micro: 750 hours/month (FREE)
- ✅ Load Balancer: 750 hours/month (FREE)
- ✅ S3: 5 GB storage (FREE)
- ✅ Data transfer: 15 GB/month (FREE)

### After Free Tier:
- EC2 (1 instance): ~$8/month
- Load Balancer: ~$16/month
- S3: ~$0.50/month
- **Total: ~$25/month**

### During High Traffic (3 instances):
- EC2 (3 instances): ~$24/month
- Load Balancer: ~$16/month
- **Total: ~$40/month**

---

## Troubleshooting

### Deployment Fails:

**Check GitHub Actions logs:**
- GitHub → Actions → Click failed workflow
- Check which step failed

**Common issues:**
- Maven build fails: Check `pom.xml`
- S3 upload fails: Check AWS credentials
- Instance refresh fails: Check Auto Scaling Group settings

### Application Won't Start:

**SSH into instance:**
```bash
ssh -i samaysetu-deploy-key.pem ubuntu@INSTANCE-PUBLIC-IP
```

**Check logs:**
```bash
sudo journalctl -u samaysetu -n 100
```

**Check if JAR downloaded:**
```bash
ls -lh /opt/samaysetu/app.jar
```

**Restart service:**
```bash
sudo systemctl restart samaysetu
```

### Load Balancer Shows Unhealthy:

**Check target group health:**
- EC2 → Target Groups → `samaysetu-tg`
- Click "Targets" tab
- Check health status and reason

**Common issues:**
- App not listening on port 8080
- Health check path wrong
- Security group blocking traffic

**Fix:**
```bash
# SSH into instance
sudo systemctl status samaysetu
sudo netstat -tulpn | grep 8080
curl localhost:8080/actuator/health
```

### Auto Scaling Not Working:

**Check CloudWatch alarms:**
- CloudWatch → Alarms
- Should see alarms for CPU utilization

**Check scaling policies:**
- EC2 → Auto Scaling Groups → `samaysetu-asg`
- Click "Automatic scaling" tab
- Verify target tracking policy exists

---

## Security Best Practices

### 1. Restrict SSH Access:

```bash
# Update security group to allow SSH only from your IP
# EC2 → Security Groups → samaysetu-ec2-sg
# Edit inbound rules → SSH → Source: My IP
```

### 2. Enable HTTPS:

**Add SSL certificate to Load Balancer:**
1. Request certificate in AWS Certificate Manager
2. Add HTTPS listener to Load Balancer
3. Redirect HTTP to HTTPS

### 3. Rotate AWS Access Keys:

```bash
# Every 90 days, create new access keys
# Update GitHub secrets
# Delete old keys
```

### 4. Enable CloudTrail:

- Tracks all AWS API calls
- Helps with security auditing

---

## Advanced Features

### Add Custom Domain:

1. **Route 53:**
   - Create hosted zone for your domain
   - Add A record pointing to Load Balancer

2. **SSL Certificate:**
   - Request certificate in ACM
   - Add HTTPS listener to ALB

### Database Connection Pooling:

Update `application-prod.properties`:
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

### Enable Caching:

Add Redis/ElastiCache for session management and caching.

---

## Summary

You now have:
- ✅ **Auto-deploy** on git push
- ✅ **Load balancer** for high availability
- ✅ **Auto-scaling** (1-3 instances)
- ✅ **Zero downtime** deployments
- ✅ **Health checks** and monitoring
- ✅ **FREE for 12 months**

**Your Load Balancer URL:**
```
http://YOUR-ALB-DNS-NAME
```

**Test it:**
```bash
curl http://YOUR-ALB-DNS-NAME/actuator/health
```

**Deploy updates:**
```bash
git push origin main
# Automatically deploys in 5-10 minutes!
```

🎉 **Congratulations! Your production-ready AWS infrastructure is complete!**
