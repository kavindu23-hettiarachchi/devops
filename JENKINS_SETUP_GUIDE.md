# Jenkins Pipeline Setup Guide - Docker Hub Automation

## Overview
This guide explains how to set up the Jenkins pipeline for automatic Docker image builds and deployment to Docker Hub.

## Prerequisites

1. **Jenkins Installation**
   - Jenkins server running (locally or in cloud)
   - Docker installed on Jenkins agent/server
   - Docker daemon running

2. **Docker Hub Account**
   - Active Docker Hub account (dockerhub.com)
   - Docker Hub credentials ready

3. **GitHub Access**
   - Git installed on Jenkins server
   - GitHub repository access

## Setup Steps

### 1. Jenkins Credentials Setup

**Add Docker Hub Credentials:**

1. Go to Jenkins Dashboard → **Manage Jenkins** → **Manage Credentials**
2. Click **System** under Stores scoped to Jenkins
3. Click **Global credentials (unrestricted)**
4. Click **Add Credentials**
5. Fill in:
   - **Kind**: Username with password
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub personal access token or password
   - **ID**: `dockerhub-creds` (must match Jenkinsfile)
   - **Description**: Docker Hub Credentials
6. Click **Create**

### 2. Create Jenkins Pipeline Job

1. Go to Jenkins Dashboard
2. Click **New Item**
3. Enter job name: `DevOps-Docker-Pipeline` (or your preferred name)
4. Select **Pipeline**
5. Click **OK**

### 3. Configure Pipeline

In the job configuration:

**Pipeline Section:**
- **Definition**: Pipeline script from SCM
- **SCM**: Git
  - **Repository URL**: `https://github.com/kavindu23-hettiarachchi/devops.git`
  - **Credentials**: Select GitHub credentials (if private repo)
  - **Branches to build**: `*/main`
  - **Script Path**: `Jenkinsfile` (default)

Or use **Pipeline script** directly and paste the Jenkinsfile content.

### 4. Configure Build Triggers (Optional)

**Webhook Trigger (Auto-build on push):**
1. Go to pipeline job → **Configure**
2. Check **GitHub hook trigger for GITScm polling**
3. Go to GitHub repo → **Settings** → **Webhooks**
4. Add webhook:
   - **Payload URL**: `http://your-jenkins-url/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: Push events
   - **Active**: ✓

**Poll SCM (Scheduled):**
1. In job configuration, check **Poll SCM**
2. Schedule: `H H * * *` (daily) or `H/15 * * * *` (every 15 mins)

### 5. Run the Pipeline

1. Click **Build Now** or push to main branch (if webhook enabled)
2. View console output in **Build History**

---

## Pipeline Features

### Multi-Tag Versioning
Each image gets three tags:
- **Build Number**: `kavindu123456/frontend-app:42`
- **Latest**: `kavindu123456/frontend-app:latest`
- **Commit SHA**: `kavindu123456/frontend-app:a1b2c3d`

### Parallel Builds
- Frontend and Backend build simultaneously (faster execution)
- Both images push in parallel to Docker Hub

### Build Parameters
- **PUSH_TO_DOCKER_HUB**: Toggle to build without pushing (for testing)

### Automatic Cleanup
- Docker logout after completion
- Removes dangling images to free disk space

### Build Limits
- Keeps last 10 builds
- 1-hour timeout per build
- Timestamps on all logs

---

## File Paths Referenced

- **Dockerfiles**:
  - Frontend: `frontend/Dockerfile`
  - Backend: `backend/Dockerfile`

- **Jenkins Config**: `Jenkinsfile` (root directory)

---

## Troubleshooting

### Docker Login Fails
```
Error: docker login failed
```
**Solution:**
- Verify credentials ID is `dockerhub-creds` in Jenkins
- Check Docker Hub username/password are correct
- Ensure credentials have proper access level

### Push Permission Denied
```
Error: denied: requested access to the resource is denied
```
**Solution:**
- Verify Docker Hub username matches image namespace
- Check Docker Hub account has push permissions
- Ensure image name format: `username/image-name`

### Docker Not Found
```
Error: docker: command not found
```
**Solution:**
- Install Docker on Jenkins agent
- Ensure Jenkins user has Docker permissions: `sudo usermod -aG docker jenkins`
- Restart Jenkins service

### Git Clone Fails
```
Error: fatal: repository not found
```
**Solution:**
- Verify GitHub URL is correct
- For private repos, add GitHub credentials to Jenkins
- Check branch name (currently `main`)

---

## Docker Hub Image Locations

After successful builds, images will be available at:

```
docker pull kavindu123456/frontend-app:latest
docker pull kavindu123456/backend-app:latest
```

View them at:
- Frontend: https://hub.docker.com/r/kavindu123456/frontend-app
- Backend: https://hub.docker.com/r/kavindu123456/backend-app

---

## Advanced Options

### Only Build on Tag
Add condition to Jenkinsfile:
```groovy
when {
    tag "v*"
}
```

### Send Notifications
Add to `post` section:
```groovy
post {
    success {
        mail to: 'your-email@example.com',
        subject: "Pipeline Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "Images pushed to Docker Hub successfully"
    }
}
```

### Build with Environment Variables
Add at job level:
```
BUILD_ENV=production
REGISTRY=docker.io
```

---

## Security Best Practices

✓ **DO:**
- Use Docker Hub personal access tokens instead of passwords
- Limit credentials scope to this pipeline only
- Rotate credentials regularly
- Use private repositories when necessary
- Restrict Jenkins server access

✗ **DON'T:**
- Store credentials in Jenkinsfile
- Use personal passwords in Jenkins
- Share Jenkins server access
- Commit .git credentials locally
- Use default/generic credentials

---

## Monitoring

**Build Dashboard:**
- Go to Jenkins job page
- View build history and console logs
- Check Success/Failure rate

**Docker Hub Monitoring:**
- https://hub.docker.com/repositories
- Track image pulls and versions
- Monitor storage usage

---

## Quick Reference Commands

```bash
# Manual Docker Hub push (for testing)
docker login -u kavindu123456
docker build -t kavindu123456/frontend-app:latest -f frontend/Dockerfile frontend
docker push kavindu123456/frontend-app:latest

# View Jenkins agent Docker status
docker ps
docker images

# Check Jenkins agent logs
tail -f /var/log/jenkins/jenkins.log
```

---

For more information, see:
- [Jenkinsfile Documentation](Jenkinsfile)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
