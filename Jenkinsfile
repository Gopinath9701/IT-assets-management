pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Show Workspace Files') {
            steps {
                bat 'cd'
                bat 'dir'
            }
        }

        stage('CI Verification') {
            steps {
                echo 'Jenkins CI setup for wf branch is working.'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}