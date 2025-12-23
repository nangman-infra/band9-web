pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        DEV_SERVER_IP = "172.16.0.8"
        TARGET_DIR = "/var/www/band9-web"
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
        
        // 슬랙 설정
        SLACK_CHANNEL = "cicd-notification"
        SLACK_CREDENTIAL_ID = "Mr.Jenkins"
        // 웹훅 방식일 때 필수 설정
        SLACK_BASE_URL = "https://hooks.slack.com/services/"
    }

    stages {
        stage('0. 알림: 빌드 시작') {
            steps {
                slackSend(
                    baseUrl: "${env.SLACK_BASE_URL}",
                    tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                    channel: "#${env.SLACK_CHANNEL}",
                    color: "#FFFF00",
                    message: """*🚀 빌드 시작: [${env.APP_NAME}]*
                    *Branch:* `${env.BRANCH_NAME}`
                    *Build:* #${env.BUILD_NUMBER}
                    *URL:* ${env.BUILD_URL}"""
                )
            }
        }

        stage('1. 환경 확인') {
            steps { echo "현재 브랜치: ${env.BRANCH_NAME}" }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                script {
                    sh '''#!/bin/bash
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        nvm use
                        npx pnpm install --no-frozen-lockfile
                        npx pnpm build
                    '''
                }
            }
        }

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                script {
                    sh "rsync -avz --delete -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' ./dist/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/dist/"
                }
            }
        }
    }

    post {
        success {
            slackSend(
                baseUrl: "${env.SLACK_BASE_URL}",
                tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                channel: "#${env.SLACK_CHANNEL}",
                color: "good",
                message: """*✅ 배포 성공: [${env.APP_NAME}]*
                *Status:* `${env.BRANCH_NAME}` 완료
                *URL:* http://${env.DEV_SERVER_IP}
                *Duration:* ${currentBuild.durationString.replace(' and counting', '')}"""
            )
        }
        failure {
            slackSend(
                baseUrl: "${env.SLACK_BASE_URL}",
                tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                channel: "#${env.SLACK_CHANNEL}",
                color: "danger",
                message: """*❌ 빌드 실패: [${env.APP_NAME}]*
                *Log:* ${env.BUILD_URL}console"""
            )
        }
    }
}