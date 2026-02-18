# ngrok Quick Start - Commands to Run Now

## **FOLLOW THESE STEPS IN ORDER**

---

## **Step 1: Add Your ngrok Authtoken (One Time)**

Copy this command from your ngrok dashboard and run it in PowerShell:

```bash
ngrok config add-authtoken 39q10eWV2cwb0i1N1LHrQzCmM8X_2ZJ2vzih6m8c3TNz5shFJ
```

**Expected output:**
```
Authtoken saved to configuration file: C:\Users\ASUS\AppData\Local\ngrok\ngrok.yml
```

---

## **Step 2: Start ngrok (Keep Terminal Open)**

Run this command:

```bash
ngrok http 8080
```

**Expected output:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Account                       your@email.com
Version                        3.x.x

Forwarding                    https://dona-overpartial-noncritically.ngrok-free.dev -> http://localhost:8080
Forwarding                    http://dona-overpartial-noncritically.ngrok-free.dev -> http://localhost:8080

Web Interface                 http://127.0.0.1:4040
```

**👉 COPY THIS URL: `https://dona-overpartial-noncritically.ngrok-free.dev`**

---

## **Step 3: Update Jenkins (In Jenkins UI)**

1. Go to: `http://localhost:8080` (or your Jenkins address)
2. Click **Manage Jenkins** → **Configure System**
3. Find **Jenkins Location**
4. Set **Jenkins URL** to:
   ```
   https://dona-overpartial-noncritically.ngrok-free.dev/
   ```
5. Click **Save**

---

## **Step 4: Add GitHub Webhook**

1. Go to: https://github.com/kavindu23-hettiarachchi/devops/settings/hooks
2. Click **Add webhook**
3. Fill in:
   ```
   Payload URL: https://dona-overpartial-noncritically.ngrok-free.dev/github-webhook/
   Content type: application/json
   Active: ✓ (checked)
   ```
4. Click **Add webhook**

---

## **Step 5: Test It Works**

### **Test Option 1: Make a Git Push**
```bash
cd C:\Users\ASUS\Desktop\DevopsProject
git add .
git commit -m "test webhook trigger"
git push origin main
```

Then go to Jenkins dashboard and watch for automatic build.

### **Test Option 2: Manual Webhook Test**
1. GitHub repo → Settings → Webhooks
2. Click your webhook
3. Scroll to **Recent Deliveries**
4. Click a delivery
5. Click **Redeliver**
6. Watch Jenkins for automatic build

---

## **What Should Happen**

```
1. You run: git push
           ↓
2. GitHub sends webhook to: https://dona-overpartial-noncritically.ngrok-free.dev/github-webhook/
           ↓
3. ngrok forwards to: http://localhost:8080/github-webhook/
           ↓
4. Jenkins receives webhook
           ↓
5. Jenkins starts build automatically
           ↓
6. Frontend image builds
7. Backend image builds
           ↓
8. Both images pushed to Docker Hub
           ↓
✓ SUCCESS!
```

---

## **Important Notes**

⚠️ **Keep terminal with ngrok RUNNING the entire time**
- If you close it, the tunnel stops and webhooks won't work
- URL will still be the same (because you added authtoken)

📝 **Replace these values in all examples with your actual ones:**
- `dona-overpartial-noncritically.ngrok-free.dev` = Your forwarding URL
- `8080` = Your Jenkins port
- `kavindu23-hettiarachchi` = Your GitHub username

✓ **Once working:**
- Every code push automatically triggers Jenkins
- Jenkins automatically builds & pushes Docker images
- No manual builds needed!

---

## **Troubleshooting**

### ❌ ngrok command not found
**Solution:** ngrok not installed yet, download from Microsoft Store first

### ❌ Jenkins shows red X on webhook
**Solution:** 
1. Check ngrok terminal is still running
2. Copy exact URL from ngrok output
3. Check Jenkins URL in Jenkins settings

### ❌ No build triggered after push
**Solution:**
1. Check GitHub webhook recent deliveries for errors
2. Make sure you're pushing to `main` branch
3. Verify ngrok URL in webhook matches exactly

---

## **Commands Cheat Sheet**

```bash
# Add authtoken (one time only)
ngrok config add-authtoken 39q10eWV2cwb0i1N1LHrQzCmM8X_2ZJ2vzih6m8c3TNz5shFJ

# Start ngrok tunnel
ngrok http 8080

# Test git push
git add .
git commit -m "test"
git push origin main

# Check Jenkins logs
# Go to: http://localhost:8080/log
```

---

**Ready? Run Step 1 command above in PowerShell now! 👆**
