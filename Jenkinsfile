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

    stage('Frontend Developer Branch') {
            when {
                branch 'coder-1'
            }
            steps {
                echo 'Frontend developer pushed code.'
                bat 'dir'
            }
        }

        stage('Tester Branch') {
            when {
                branch 'tester'
            }
            steps {
                echo 'Tester branch received code for testing.'
                bat 'dir'
            }
        }

        stage('Main Branch') {
            when {
                branch 'main'
            }
            steps {
                echo 'Main branch ready for final integration.'
                bat 'dir'
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