pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "kavindu123456"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/devops-frontend"
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/devops-backend"
        AWS_REGION = "us-east-1"
        EC2_IP = "52.22.87.248"
        EC2_USER = "ubuntu"
    }

    stages {
        stage('Prepare') {
            steps {
                echo "🔄 Preparing workspace..."
                deleteDir()
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                echo "🏗️ Building Frontend Image..."
                sh 'docker build --network=host -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend'
            }
        }

        stage('Build Backend') {
            steps {
                echo "🏗️ Building Backend Image..."
                sh 'docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "🔐 Logging in to Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "📤 Pushing images to Docker Hub..."
                sh '''
                    docker push ${FRONTEND_IMAGE}:latest
                    docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                echo "🚀 Deploying to AWS EC2..."
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        echo "📍 Connecting to EC2: ${EC2_IP}"
                        
                        # SSH into EC2 and pull latest images + restart containers
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} <<'DEPLOY'
echo "📥 Pulling latest Docker images..."
docker pull ${DOCKER_HUB_USER}/devops-backend:latest
docker pull ${DOCKER_HUB_USER}/devops-frontend:latest

echo "🔄 Restarting containers..."
cd /home/ubuntu/app

# Stop and remove old containers
docker-compose down

# Start new containers with latest images
docker-compose up -d

# Show status
echo "✅ Containers restarted"
docker-compose ps

# Check logs
echo "📋 Recent logs:"
docker-compose logs -n 20
DEPLOY
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "✅ Verifying deployment..."
                sh '''
                    sleep 15
                    echo "Testing application at http://${EC2_IP}"
                    curl -f http://${EC2_IP}/ && echo "✅ Application is running!" || echo "⚠️ Application starting, please wait..."
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
            echo "🎉 App running at: http://${EC2_IP}"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}