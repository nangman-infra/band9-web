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
        SLACK_BASE_URL = "https://hooks.slack.com/services/"
        
        // 실패 원인을 담을 변수 (초기값)
        FAILURE_REASON = "빌드 또는 배포 중 알 수 없는 오류 발생"
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
            steps { 
                script { env.FAILURE_REASON = "1단계(환경 확인) 실패" }
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "빌드 서버: ${NODE_NAME}"
            }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                script { env.FAILURE_REASON = "2단계(Node.js 빌드) 실패 - 소스 코드나 의존성을 확인하세요." }
                echo ">>> 빌드 파일 생성."
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
                echo ">>> 배포 대상 서버(${env.DEV_SERVER_IP}) 연결 상태 확인."
                script {
                    try {
                        // -o ConnectTimeout=5 옵션을 추가해 서버가 죽어있을 경우 빠르게 실패하도록 설정
                        sh "ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no -o ConnectTimeout=5 wisoft@${env.DEV_SERVER_IP} 'exit'"
                        echo "✅ SSH 연결 성공"
                    } catch (Exception e) {
                        // 접속 실패 시 슬랙에 보낼 문구 지정
                        env.FAILURE_REASON = "❌3단계(SSH 접속 확인) 실패 - SSH 설정 확인."
                        error "SSH 접속 실패로 빌드를 중단합니다."
                    }
                }
            }
        }

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                script { env.FAILURE_REASON = "4-1단계(배포) 실패 - 파일 전송 중 오류가 발생했습니다." }
                echo "🚀 [DEV] 개발 서버로 배포를 시작합니다."
                script {
                    sh "rsync -avz --delete -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' ./dist/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/dist/"
                }
            }
        }

        stage('4-2. 배포: Staging') {
            when { branch 'stage' }
            steps { echo "🚧 [STAGE] 스테이징 서버 배포 (준비 중)" }
        }

        stage('4-3. 배포: Production') {
            when { branch 'main' }
            steps { echo "🔥 [PROD] 운영 서버 배포 (준비 중)" }
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
                *원인:* `${env.FAILURE_REASON}`
                *Log:* ${env.BUILD_URL}console"""
            )
        }
    }
}