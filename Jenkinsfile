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
        echo 'Lead Developer Integration Build'

        dir('frontend') {
            bat 'npm install'
            bat 'npm run build'
        }

        dir('backend') {
            bat 'mvn clean install'
        }

        echo 'Integration Build Successful'
    }
}

        // ---------------- Frontend ----------------
        stage('Frontend CI') {
    when {
        branch 'frontend-developer'
    }
    steps {
        echo 'Running Frontend CI'

        dir('frontend') {
            bat 'npm install'
            bat 'npm run build'
        
        }
    }
}

        // ---------------- Backend ----------------
        stage('Backend CI') {
    when {
        branch 'BackendEngineer'
    }
    steps {
        echo 'Running Backend CI'

        dir('backend') {
            bat 'mvn clean install'
        }
    }
}

        // ---------------- QA ----------------
        stage('QA CI') {
    when {
        branch 'QA-Engineer'
    }
    steps {
        echo 'Running QA Validation'

        dir('backend') {
            bat 'mvn test'
        }

        echo 'QA Tests Completed Successfully'
    }
}

        // ---------------- DevOps (Git/Jenkins) ----------------
        stage('DevOps Monitoring') {
    when {
        branch 'DevopsEngineer'
    }
    steps {
        echo 'Monitoring CI Pipeline'

        bat 'echo Workspace: %WORKSPACE%'
        bat 'echo Branch: %BRANCH_NAME%'

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
        echo 'Preparing Deployment'

        dir('backend') {
            bat 'mvn clean package'
        }

        echo 'Deployment Build Ready'
    }
}
        // ---------------- Main ----------------
       stage('Main Integration') {
    when {
        branch 'main'
    }
    steps {
        echo 'Running Final Integration'

        dir('frontend') {
            bat 'npm install'
            bat 'npm run build'
        }

        dir('backend') {
            bat 'mvn clean install'
        }

        echo 'Final Integration Successful'
    }
}
    }
    post {
        always {
            archiveArtifacts artifacts: 'backend/target/*.jar', allowEmptyArchive: true
            archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
        }


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
