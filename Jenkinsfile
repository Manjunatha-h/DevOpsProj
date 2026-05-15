pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = 'manjunathah7'
        FRONTEND_IMAGE = "${DOCKERHUB_REPO}/email-writer-react"
        BACKEND_IMAGE = "${DOCKERHUB_REPO}/email-writer-sb"

        // Change this later if deploying with Docker Compose/Kubernetes
        VITE_API_URL = 'http://localhost:8080'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                script {

                    def cmd = "docker build -t ${BACKEND_IMAGE}:latest -f email-writer-sb/Dockerfile email-writer-sb"

                    if (isUnix()) {
                        sh cmd
                    } else {
                        bat cmd
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {

                    def cmd = "docker build --build-arg VITE_API_URL=${VITE_API_URL} -t ${FRONTEND_IMAGE}:latest -f email-writer-react/Dockerfile email-writer-react"

                    if (isUnix()) {
                        sh cmd
                    } else {
                        bat cmd
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    script {

                        if (isUnix()) {

                            sh '''
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            '''

                        } else {

                            bat '''
                            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                            '''
                        }
                    }
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                script {

                    def cmd = "docker push ${BACKEND_IMAGE}:latest"

                    if (isUnix()) {
                        sh cmd
                    } else {
                        bat cmd
                    }
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {

                    def cmd = "docker push ${FRONTEND_IMAGE}:latest"

                    if (isUnix()) {
                        sh cmd
                    } else {
                        bat cmd
                    }
                }
            }
        }
    }

    post {

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }

        always {

            script {

                if (isUnix()) {
                    sh 'docker logout'
                } else {
                    bat 'docker logout'
                }
            }
        }
    }
}