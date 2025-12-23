pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        DEV_SERVER_IP = "172.16.0.8"
        TARGET_DIR = "/var/www/band9-web"
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
        
        // 슬랙 설정
        SLACK_CHANNEL = "cicd-notification"
        SLACK_CREDENTIAL_ID = "slack-webhook-url"
    }

    stages {
        stage('0. 알림: 빌드 시작') {
            steps {
                // 시작 알림: 노란색 테두리
                slackSend(
                    tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                    channel: "#${env.SLACK_CHANNEL}",
                    color: "#FFFF00",
                    message: """🚀 *빌드 시작: [${env.APP_NAME}]*
                    *Branch:* `${env.BRANCH_NAME}`
                    *Build Number:* #${env.BUILD_NUMBER}
                    *URL:* ${env.BUILD_URL}"""
                )
            }
        }

        stage('1. 환경 확인') {
            steps {
                echo "현재 브랜치: ${env.BRANCH_NAME}"
            }
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
                echo "🚀 [DEV] 개발 서버로 파일 전송"
                script {
                    sh """
                        rsync -avz --delete \
                        -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' \
                        ./dist/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/dist/
                    """
                }
            }
        }
    }

    post {
        success {
            // 성공 알림: 초록색 테두리
            slackSend(
                tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                channel: "#${env.SLACK_CHANNEL}",
                color: "good",
                message: """✅ *배포 성공: [${env.APP_NAME}]*
                *Status:* `${env.BRANCH_NAME}` 환경 배포 완료
                *Server:* http://${env.DEV_SERVER_IP}
                *Build:* #${env.BUILD_NUMBER}"""
            )
        }
        failure {
            // 실패 알림: 빨간색 테두리
            slackSend(
                tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                channel: "#${env.SLACK_CHANNEL}",
                color: "danger",
                message: """❌ *빌드 실패: [${env.APP_NAME}]*
                *Status:* `${env.BRANCH_NAME}` 빌드 중 오류 발생
                *Log:* ${env.BUILD_URL}console"""
            )
        }
    }
}