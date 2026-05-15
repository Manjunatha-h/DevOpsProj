pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = 'manjunathah7'
        FRONTEND_IMAGE = "${DOCKERHUB_REPO}/email-writer-react"
        BACKEND_IMAGE = "${DOCKERHUB_REPO}/email-writer-sb"
        VITE_API_URL = 'http://localhost:8080'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                script {
                    def buildCmds = [
                        "docker build -t ${BACKEND_IMAGE}:latest -f email-writer-sb/Dockerfile email-writer-sb",
                        "docker build --build-arg VITE_API_URL=${VITE_API_URL} -t ${FRONTEND_IMAGE}:latest -f email-writer-react/Dockerfile email-writer-react"
                    ]
                    buildCmds.each { cmd ->
                        if (isUnix()) {
                            sh cmd
                        } else {
                            bat cmd
                        }
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def loginCmd = "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        if (isUnix()) {
                            sh loginCmd
                        } else {
                            bat "@echo off\n" + loginCmd
                        }
                    }
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    def pushCmds = [
                        "docker push ${BACKEND_IMAGE}:latest",
                        "docker push ${FRONTEND_IMAGE}:latest"
                    ]
                    pushCmds.each { cmd ->
                        if (isUnix()) {
                            sh cmd
                        } else {
                            bat cmd
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def logoutCmd = "docker logout"
                if (isUnix()) {
                    sh logoutCmd
                } else {
                    bat logoutCmd
                }
            }
        }
    }
}
