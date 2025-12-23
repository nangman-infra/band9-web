def failureReason = "빌드 또는 배포 중 알 수 없는 오류 발생"

pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        // IP 대신 도메인을 사용합니다.
        DEV_SERVER = "band9-dev" 
        TARGET_DIR = "/var/www/band9-web"
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
        
        SLACK_CHANNEL = "cicd-notification"
        SLACK_CREDENTIAL_ID = "Mr.Jenkins"
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
                    *Target:* `${env.DEV_SERVER}`
                    *Branch:* `${env.BRANCH_NAME}`
                    *Build:* #${env.BUILD_NUMBER}"""
                )
            }
        }

        stage('1. 환경 확인') {
            steps { 
                script { failureReason = "1단계(환경 확인) 실패" }
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "대상 서버: ${env.DEV_SERVER}"
            }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                script { failureReason = "2단계(Node.js 빌드) 실패" }
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

        stage('3. SSH 접속 확인') {
            steps {
                script { failureReason = "3단계(SSH 접속 확인) 실패 - ${env.DEV_SERVER}에 연결할 수 없습니다." }
                echo ">>> 배포 대상 서버(${env.DEV_SERVER}) 연결 확인."
                // 도메인을 사용하여 접속 테스트
                sh "ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no -o ConnectTimeout=5 wisoft@${env.DEV_SERVER} 'exit'"
            }
        }

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                script { failureReason = "4-1단계(배포) 실패 - rsync 오류" }
                echo "🚀 [DEV] ${env.DEV_SERVER}로 배포를 시작합니다."
                script {
                    // rsync 목적지도 도메인으로 변경
                    sh "rsync -avz --delete -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' ./dist/ wisoft@${env.DEV_SERVER}:${env.TARGET_DIR}/dist/"
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
                *환경:* `${env.BRANCH_NAME}`
                *주소:* http://${env.DEV_SERVER}
                *빌드:* #${env.BUILD_NUMBER}"""
            )
        }
        failure {
            slackSend(
                baseUrl: "${env.SLACK_BASE_URL}",
                tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                channel: "#${env.SLACK_CHANNEL}",
                color: "danger",
                message: """*❌ 빌드 실패: [${env.APP_NAME}]*
                *실패 원인:* `${failureReason}`
                *로그:* ${env.BUILD_URL}console"""
            )
        }
    }
}