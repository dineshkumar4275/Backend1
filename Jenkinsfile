pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        stage('Test') {
            steps {
                echo 'Testing Jenkins pipeline...'
                sh 'ls -la'
                sh 'pwd'
            }
        }
    }
}
