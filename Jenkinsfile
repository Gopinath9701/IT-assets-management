pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Frontend Developer Branch') {
            when {
                branch 'coder-1'
            }
            steps {
                echo 'Frontend developer branch build is running.'
                bat 'dir'
            }
        }

        stage('Tester Branch') {
            when {
                branch 'QA-Engineer'
            }
            steps {
                echo 'Tester branch validation is running.'
                bat 'dir'
            }
        }

        stage('Main Branch') {
            when {
                branch 'main'
            }
            steps {
                echo 'Main branch final integration is running.'
                bat 'dir'
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
    }
}
