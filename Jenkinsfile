pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Frontend developer branch (existing)
        stage('Frontend Developer Branch') {
            when {
                branch 'frontend-developer'   // frontend dev branch
            }
            steps {
                echo 'Frontend developer branch build is running.'
                bat 'dir'
                // here you can later add npm install / frontend build commands
            }
        }

        // Backend developer branch (new)
        stage('Backend Developer Branch') {
            when {
                branch 'BackendEngineer'   // your backend-dev branch name
            }
            steps {
                echo 'Backend developer branch build is running.'
                bat 'dir'
                // here you can later add backend build/test commands (npm, Maven, etc.)
            }
        }

        // Tester / QA branch (shared for both)
        stage('Tester Branch') {
            when {
                branch 'QA-Engineer'
            }
            steps {
                echo 'Tester branch validation is running.'
                bat 'dir'
                // later: run test suites, API tests, integration tests, etc.
            }
        }

        // Main branch (stable)
        stage('Main Branch') {
            when {
                branch 'main'
            }
            steps {
                echo 'Main branch final integration is running.'
                bat 'dir'
                // later: optional deploy or release steps
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
            // Email on successful build
            emailext(
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Build Succeeded.

Job: ${env.JOB_NAME}
Build: ${env.BUILD_NUMBER}
Branch: ${env.BRANCH_NAME}
URL: ${env.BUILD_URL}
""",
                to: "24211A6701@bvrit.ac.in"
            )
        }
        failure {
            echo 'Pipeline failed.'
            // Email on failed build
            emailext(
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Build Failed.

Job: ${env.JOB_NAME}
Build: ${env.BUILD_NUMBER}
Branch: ${env.BRANCH_NAME}
URL: ${env.BUILD_URL}
""",
                to: "24211A6701@bvrit.ac.in"
            )
        }
    }
}
