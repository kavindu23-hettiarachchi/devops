# GitHub Webhook Setup for Jenkins Pipeline Automation

This guide helps you automatically trigger Jenkins builds when you push code to GitHub.

---

## **Complete Setup Process**

### **STEP 1: Expose Jenkins with ngrok (Create Public URL)**

#### **1.1 Download and Install ngrok**

1. Go to: https://ngrok.com
2. Sign up for free account (recommended)
3. Download for Windows
4. Extract to a folder (e.g., `C:\ngrok`)

#### **1.2 Add Your ngrok Authtoken (One Time)**

From your ngrok dashboard, copy your authtoken and run:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

**Example:**
```bash
ngrok config add-authtoken 39q10eWV2cwb0i1N1LHrQzCmM8X_2ZJ2vzih6m8c3TNz5shFJ
```

This saves your token for permanent static domains.

#### **1.3 Start ngrok Tunnel**

Open **Command Prompt** or **PowerShell** and run:

```bash
ngrok http 8080
```

**Output will show:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Account                       your-email@example.com
Version                       3.3.5
Region                        us (United States)
Latency                       11ms
Web Interface                 http://127.0.0.1:4040

Forwarding                    https://dona-overpartial-noncritically.ngrok-free.dev -> http://localhost:8080
```

**IMPORTANT:** 
- Keep this terminal **RUNNING**
- Copy the Forwarding URL: `https://dona-overpartial-noncritically.ngrok-free.dev`
- Your Jenkins URL is now public!
- This domain stays the same each time (because you added authtoken)

---

### **STEP 2: Get Jenkins Public URL**

From ngrok output, use:
```
https://a1b2c3d4e5f6.ngrok-free.app
```

**This is your Jenkins public address!**

---

### **STEP 3: Configure Jenkins URL (Important!)**

1. Go to **Jenkins Dashboard**
2. Click **Manage Jenkins** → **Configure System**
3. Find **Jenkins Location**
4. Set **Jenkins URL** to:
   ```
   https://a1b2c3d4e5f6.ngrok-free.app/
   ```
   *(Include trailing slash)*
5. Click **Save**

---

### **STEP 4: Set Up GitHub Webhook**

#### **4.1 Go to Your GitHub Repository**

1. Open: https://github.com/kavindu23-hettiarachchi/devops
2. Click **Settings** (top right)
3. Click **Webhooks** (left sidebar)
4. Click **Add webhook** (green button)

#### **4.2 Fill the Webhook Form**

```
Payload URL: https://a1b2c3d4e5f6.ngrok-free.app/github-webhook/

Content type: application/json

Which events would you like to trigger this webhook?
  ✓ Just the push event (selected by default)

Active: ✓ (checkbox checked)

Click: Add webhook (green button)
```

**Breakdown of the URL:**
- `https://a1b2c3d4e5f6.ngrok-free.app` = Your ngrok forwarding URL
- `/github-webhook/` = Jenkins plugin endpoint (don't change this)

---

### **STEP 5: Verify Webhook Connection**

After adding webhook, you should see:

```
✓ Green checkmark next to webhook URL
  (means GitHub successfully connected to Jenkins)
```

If you see ❌ red X, troubleshoot:
- Is ngrok still running?
- Is Jenkins URL correct in Jenkins settings?
- Copy webhook URL exactly with trailing slash

---

### **STEP 6: Test the Pipeline**

#### **Test Method 1: Make a Git Commit**

```bash
cd your-local-repo
echo "test" >> README.md
git add .
git commit -m "test webhook"
git push origin main
```

**Expected Result:**
- GitHub sends webhook event to Jenkins
- Jenkins automatically starts build
- Check Jenkins dashboard for new build

#### **Test Method 2: Manual Webhook Trigger**

In GitHub webhook settings:
1. Click on the webhook you just created
2. Scroll down to **Recent Deliveries**
3. Click the latest delivery (if any)
4. Click **Redeliver** button
5. Watch Jenkins for automatic build

---

## **Final Jenkins Configuration**

Your Jenkins Pipeline job should have:

```
GENERAL TAB:
  ✓ GitHub project
    Project url: https://github.com/kavindu23-hettiarachchi/devops

TRIGGERS TAB:
  ✓ GitHub hook trigger for GITScm polling
    (this is the key one!)

PIPELINE TAB:
  Definition: Pipeline script from SCM
  SCM: Git
    Repository: https://github.com/kavindu23-hettiarachchi/devops.git
    Branch: */main
    Script path: Jenkinsfile
```

---

## **Webhook URL Reference**

**Keep these URLs handy:**

| Service | URL |
|---------|-----|
| Jenkins Dashboard | `https://a1b2c3d4e5f6.ngrok-free.app/` |
| Jenkins Webhook | `https://a1b2c3d4e5f6.ngrok-free.app/github-webhook/` |
| GitHub Webhook Settings | https://github.com/kavindu23-hettiarachchi/devops/settings/hooks |
| ngrok Web Dashboard | `http://127.0.0.1:4040` |

---

## **Troubleshooting**

### ❌ Webhook shows RED X (failed)

**Solution:**
```
1. Make sure ngrok is running in terminal
2. Check Jenkins URL in Jenkins settings:
   - Manage Jenkins → Configure System → Jenkins Location
   - Should be: https://your-ngrok-url/
   
3. Restart Jenkins if needed
```

### ❌ Jenkins build doesn't start when pushing to GitHub

**Check GitHub webhook delivery:**
1. GitHub repo → Settings → Webhooks
2. Click on webhook
3. Scroll to "Recent Deliveries"
4. Click on a delivery to see the response
5. Look for error message

**Common errors:**
```
404 Not Found → Webhook URL is wrong
Connection refused → ngrok not running
403 Forbidden → Jenkins credentials issue
```

### ❌ ngrok URL keeps changing

**Solution: Get ngrok account**
- Sign up at ngrok.com
- Run: `ngrok config add-authtoken YOUR_TOKEN`
- With paid account, get static URL
- Free account URL changes each restart

---

## **Quick Reference: What Happens**

```
1. You push code to GitHub
          ↓
2. GitHub sends webhook notification
          ↓
3. ngrok forwards to Jenkins (through public tunnel)
          ↓
4. Jenkins receives webhook event
          ↓
5. Jenkins pipeline starts automatically
          ↓
6. Dockerfiles build
          ↓
7. Images push to Docker Hub
          ↓
✓ Done!
```

---

## **Keep Running**

**For continuous automation:**

Option 1: Keep terminal open (simple but less reliable)
```bash
ngrok http 8080
```

Option 2: Use ngrok service (recommended for production)
```bash
ngrok config add-authtoken YOUR_TOKEN
ngrok service install
ngrok service start
```

---

## **Security Notes**

⚠️ **Important:**
- ngrok URL is PUBLIC - anyone with it can access Jenkins
- Use ngrok only for development/testing
- For production, use proper domain + SSL certificate
- Always keep Jenkins behind authentication
- Don't expose Jenkins directly to internet without firewall

---

## **Next Steps**

1. ✓ Download ngrok
2. ✓ Start ngrok tunnel
3. ✓ Update Jenkins URL in settings
4. ✓ Add GitHub webhook
5. ✓ Test with git push
6. ✓ Monitor Jenkins builds

**Once working:**
- Every git push → Auto build
- Auto builds → Docker images
- Docker images → Push to Docker Hub
- ✓ Fully automated!

---

## **Files to Reference**

- [JENKINS_SETUP_GUIDE.md](JENKINS_SETUP_GUIDE.md) - Jenkins pipeline configuration
- [Jenkinsfile](Jenkinsfile) - Pipeline definition
- [docker-compose.yml](docker-compose.yml) - Local testing

---

For more info:
- [ngrok Documentation](https://ngrok.com/docs)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [Jenkins Webhooks Plugin](https://plugins.jenkins.io/github/)
