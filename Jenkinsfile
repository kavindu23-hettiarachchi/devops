pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {
        booleanParam(name: 'PUSH_TO_DOCKER_HUB', defaultValue: true, description: 'Push images to Docker Hub after build')
    }

    environment {
        DOCKER_REGISTRY = "docker.io"
        FRONTEND_IMAGE = "kavindu123456/frontend-app"
        BACKEND_IMAGE = "kavindu123456/backend-app"
        GIT_REPO = "https://github.com/kavindu23-hettiarachchi/devops.git"
        IMAGE_TAG = "${BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Preparation') {
            steps {
                echo "═══════════════════════════════════════════════════════"
                echo "Building Docker Images for Docker Hub"
                echo "═══════════════════════════════════════════════════════"
                echo "Frontend Image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                echo "Backend Image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                echo "Commit SHA: ${GIT_COMMIT_SHORT}"
                echo "═══════════════════════════════════════════════════════"
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                echo "Cloning repository from ${GIT_REPO}..."
                git branch: 'main', url: "${GIT_REPO}"
                echo "Repository cloned successfully"
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo "Building Frontend Docker Image..."
                            sh '''
                                docker build \
                                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                    -t ${FRONTEND_IMAGE}:latest \
                                    -t ${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT} \
                                    -f frontend/Dockerfile \
                                    --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                    --build-arg VCS_REF=${GIT_COMMIT_SHORT} \
                                    frontend
                            '''
                            echo "Frontend image built successfully"
                        }
                    }
                }

                stage('Build Backend Image') {
                    steps {
                        script {
                            echo "Building Backend Docker Image..."
                            sh '''
                                docker build \
                                    -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                    -t ${BACKEND_IMAGE}:latest \
                                    -t ${BACKEND_IMAGE}:${GIT_COMMIT_SHORT} \
                                    -f backend/Dockerfile \
                                    --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                    --build-arg VCS_REF=${GIT_COMMIT_SHORT} \
                                    backend
                            '''
                            echo "Backend image built successfully"
                        }
                    }
                }
            }
        }

        stage('Docker Hub Login') {
            when {
                expression { params.PUSH_TO_DOCKER_HUB == true }
            }
            steps {
                script {
                    echo "Logging in to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin ${DOCKER_REGISTRY}
                            echo "Docker Hub login successful"
                        '''
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                expression { params.PUSH_TO_DOCKER_HUB == true }
            }
            parallel {
                stage('Push Frontend Image') {
                    steps {
                        script {
                            echo "Pushing Frontend image to Docker Hub..."
                            sh '''
                                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                                docker push ${FRONTEND_IMAGE}:latest
                                docker push ${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}
                            '''
                            echo "Frontend image pushed successfully"
                        }
                    }
                }

                stage('Push Backend Image') {
                    steps {
                        script {
                            echo "Pushing Backend image to Docker Hub..."
                            sh '''
                                docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                                docker push ${BACKEND_IMAGE}:latest
                                docker push ${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}
                            '''
                            echo "Backend image pushed successfully"
                        }
                    }
                }
            }
        }

        stage('Cleanup') {
            when {
                expression { params.PUSH_TO_DOCKER_HUB == true }
            }
            steps {
                script {
                    echo "Cleaning up Docker resources..."
                    sh 'docker logout ${DOCKER_REGISTRY} || true'
                    echo "Cleanup completed"
                }
            }
        }
    }

    post {
        always {
            script {
                sh 'docker logout || true'
                // Remove dangling images to free up space
                sh 'docker image prune -f || true'
            }
        }
        success {
            echo "═══════════════════════════════════════════════════════"
            echo "✓ Pipeline completed successfully!"
            echo "Images pushed to Docker Hub:"
            echo "  - ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            echo "  - ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "═══════════════════════════════════════════════════════"
        }
        failure {
            echo "✗ Pipeline failed. Check logs above for details."
        }
    }
}