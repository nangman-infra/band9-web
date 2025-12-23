// 파이프라인 외부에서 전역 변수로 선언하여 post 블록까지 확실히 전달합니다.
def failureReason = "빌드 또는 배포 중 알 수 없는 오류 발생"

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
                script { failureReason = "1단계(환경 확인) 실패" }
                echo "현재 브랜치: ${env.BRANCH_NAME}"
            }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                // 이 단계에서 에러가 나면 아래 문구가 슬랙으로 갑니다.
                script { failureReason = "2단계(Node.js 빌드) 실패 - 소스 코드나 pnpm 설정을 확인하세요." }
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
                // 접속을 시도하기 전에 미리 이유를 설정합니다.
                script { failureReason = "3단계(SSH 접속 확인) 실패 - 서버가 꺼져있거나 SSH 키 경로/권한을 확인하세요." }
                echo ">>> 배포 대상 서버(${env.DEV_SERVER_IP}) 연결 상태 확인."
                // 명령어가 실패하면 바로 stage failure로 넘어가며 위 문구가 보존됩니다.
                sh "ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no -o ConnectTimeout=5 wisoft@${env.DEV_SERVER_IP} 'exit'"
            }
        }

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                script { failureReason = "4-1단계(배포) 실패 - 파일 전송(rsync) 중 오류가 발생했습니다." }
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
                *환경:* `${env.BRANCH_NAME}`
                *서버:* http://${env.DEV_SERVER_IP}
                *소요 시간:* ${currentBuild.durationString.replace(' and counting', '')}"""
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
                *로그 링크:* ${env.BUILD_URL}console"""
            )
        }
    }
}