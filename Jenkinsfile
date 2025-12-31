def failureReason = "빌드 또는 배포 중 알 수 없는 오류 발생"

pipeline {
    // 1. Swarm Agent를 사용하도록 변경 (라벨을 'swarm' 혹은 설정하신 이름으로 바꾸세요)
    agent any

    environment {
        APP_NAME = "Band9-Web"
        DEV_SERVER = "band9-dev" 
        TARGET_DIR = "/var/www/band9-web"
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
        
        SLACK_CHANNEL = "cicd-notification"
        SLACK_CREDENTIAL_ID = "Mr.Jenkins"
        SLACK_BASE_URL = "https://hooks.slack.com/services/"
    }

    // 2. 빌드 이력 관리 추가 (디스크 용량 확보를 위해 추천)
    options {
        buildDiscarder(logRotator(numToKeepStr: '10')) // 최신 10개만 보관
        timeout(time: 15, unit: 'MINUTES') // 15분 이상 걸리면 자동 종료
    }

    stages {
        // 기존 0번 단계 앞에 Checkout 단계를 명시적으로 넣어주는 것이 좋습니다.
        stage('Source Checkout') {
            steps {
                script { failureReason = "소스 코드 체크아웃 실패" }
                checkout scm
            }
        }

        stage('0. 알림: 빌드 시작') {
            steps {
                slackSend(
                    baseUrl: "${env.SLACK_BASE_URL}",
                    tokenCredentialId: "${env.SLACK_CREDENTIAL_ID}",
                    channel: "#${env.SLACK_CHANNEL}",
                    color: "#FFFF00",
                    message: """*🚀 빌드 시작: [${env.APP_NAME}]*
                    *Target:* `${env.DEV_SERVER}`
                    *Branch:* `${env.BRANCH_NAME ?: 'manual'}`
                    *Build:* #${env.BUILD_NUMBER}"""
                )
            }
        }

        stage('1. 환경 확인') {
            steps { 
                script { failureReason = "1단계(환경 확인) 실패" }
                // shell에서 nvm, pnpm 등이 있는지 미리 체크해보면 좋습니다.
                sh 'node -v'
                sh 'pnpm -v'
            }
        }

       stage('2. Node.js 빌드 (pnpm)') {
            steps {
                script { failureReason = "2단계(Node.js 빌드) 실패" }
                sh '''#!/bin/bash
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    
                    # 🔍 [핵심 추가] 빌드 직전에 환경 변수 파일을 활성화합니다.
                    # .env.dev 파일이 레포지토리에 포함되어 있다고 가정합니다.
                    cp .env.dev .env
                    
                    pnpm install --no-frozen-lockfile
                    pnpm build
                '''
            }
        }

        stage('3. SSH 접속 확인') {
            steps {
                script { failureReason = "3단계(SSH 접속 확인) 실패 - ${env.DEV_SERVER}에 연결할 수 없습니다." }
                echo ">>> 배포 대상 서버(${env.DEV_SERVER}) 연결 확인."
                sh "ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no -o ConnectTimeout=5 wisoft@${env.DEV_SERVER} 'exit'"
            }
        }

        stage('4-1. 배포: Development') {
            // Webhook으로 실행될 때 브랜치 필터링
            when { branch 'develop' } 
            steps {
                script { failureReason = "4-1단계(배포) 실패 - rsync 오류" }
                echo "🚀 [DEV] ${env.DEV_SERVER}로 배포를 시작합니다."
                sh "rsync -avz --delete -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' ./dist/ wisoft@${env.DEV_SERVER}:${env.TARGET_DIR}/dist/"
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
                *환경:* `${env.BRANCH_NAME ?: 'manual'}`
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