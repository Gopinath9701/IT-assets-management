pipeline {
    agent any

    environment {
        DEVOPS_EMAIL = "24211A6718@bvrit.ac.in"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out branch: ${env.BRANCH_NAME}"
            }
        }

        // ---------------- Product Owner ----------------
        stage('Product Owner') {
            when {
                branch 'Scrum-Master/Product-Owner'
            }
            steps {
                echo 'Product Owner branch'
                bat 'dir'
                echo 'Validate sprint documents, backlog, user stories.'
            }
        }

        // ---------------- Lead Developer ----------------
        stage('Lead Developer') {
            when {
                branch 'Lead-Developer'
            }
            steps {
                echo 'Lead Developer branch'
                bat 'dir'
                echo 'Review project structure and integration.'
            }
        }

        // ---------------- Frontend ----------------
        stage('Frontend CI') {
            when {
                branch 'frontend-developer'
            }
            steps {
                echo 'Running Frontend CI'

                bat 'dir'

                // Later replace these
                // bat 'npm install'
                // bat 'npm run build'
                // bat 'npm test'
            }
        }

        // ---------------- Backend ----------------
        stage('Backend CI') {
            when {
                branch 'BackendEngineer'
            }
            steps {
                echo 'Running Backend CI'

                bat 'dir'

                // Later replace these
                // bat 'mvn clean install'
                // bat 'mvn test'
            }
        }

        // ---------------- QA ----------------
        stage('QA CI') {
            when {
                branch 'QA-Engineer'
            }
            steps {
                echo 'Running QA Validation'

                bat 'dir'

                // Later
                // Selenium
                // Postman
                // Integration tests
            }
        }

        // ---------------- DevOps (Git/Jenkins) ----------------
        stage('DevOps Monitoring') {
            when {
                branch 'DevopsEngineer'
            }
            steps {
                echo 'Monitoring all CI Pipelines'

                bat 'dir'

                echo 'Checking pipeline health'
                echo 'Checking build history'
                echo 'Monitoring notifications'
            }
        }

        // ---------------- Deployment ----------------
        stage('Deployment') {
            when {
                branch 'Deployment-1'
            }
            steps {
                echo 'Deployment Pipeline'

                bat 'dir'

                // Later replace with

                // docker build
                // docker push
                // kubectl apply
            }
        }

        // ---------------- Main ----------------
        stage('Main Integration') {
            when {
                branch 'main'
            }
            steps {
                echo 'Main Branch'

                bat 'dir'

                echo 'Final integration successful'
            }
        }
    }

    post {

        success {

            script {

                def recipients = ""

                switch(env.BRANCH_NAME) {

                    case "frontend-developer":
                        recipients = "24211A6708@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "BackendEngineer":
                        recipients = "24211A6701@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "QA-Engineer":
                        recipients = "24211A657@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "Lead-Developer":
                        recipients = "24211A6702@bvrit.ac.in"
                        break

                    case "Scrum-Master/Product-Owner":
                        recipients = "24211A6716@bvrit.ac.in"
                        break

                    case "Deployment-1":
                        recipients = "24211A6719@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "DevopsEngineer":
                        recipients = "24211A6718@bvrit.ac.in"
                        break

                    case "main":
                        recipients = "chintalapatigopinath02@gmail.com"
                        break
                }

                emailext(
                    to: recipients,
                    subject: "SUCCESS : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
Build Status : SUCCESS

Project : IT Asset Management System

Branch : ${env.BRANCH_NAME}

Job : ${env.JOB_NAME}

Build Number : ${env.BUILD_NUMBER}

Build URL :
${env.BUILD_URL}

Regards,
Jenkins CI Pipeline
"""
                )
            }
        }

        failure {

            script {

                def recipients = ""

                switch(env.BRANCH_NAME) {

                    case "frontend-developer":
                        recipients = "24211A6708@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "BackendEngineer":
                        recipients = "24211A6701@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "QA-Engineer":
                        recipients = "24211A657@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "Lead-Developer":
                        recipients = "24211A6702@bvrit.ac.in"
                        break

                    case "Scrum-Master/Product-Owner":
                        recipients = "24211A6716@bvrit.ac.in"
                        break

                    case "Deployment-1":
                        recipients = "24211A6719@bvrit.ac.in,${DEVOPS_EMAIL}"
                        break

                    case "DevopsEngineer":
                        recipients = "24211A6718@bvrit.ac.in"
                        break

                    case "main":
                        recipients = "chintalapatigopinath02@gmail.com"
                        break
                }

                emailext(
                    to: recipients,
                    subject: "FAILED : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
Build Status : FAILED

Project : IT Asset Management System

Branch : ${env.BRANCH_NAME}

Job : ${env.JOB_NAME}

Build Number : ${env.BUILD_NUMBER}

Build URL :
${env.BUILD_URL}

Please check the Jenkins console logs.

Regards,
Jenkins CI Pipeline
"""
                )
            }
        }
    }
}
