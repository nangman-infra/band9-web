pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        DEV_SERVER_IP = "172.16.0.8"
        TARGET_DIR = "/var/www/band9-web"
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
    }

    stages {
        stage('1. 환경 확인') {
            steps {
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "대상 서버: ${env.DEV_SERVER_IP}"
            }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                echo ">>> nvm 로드 및 빌드 시작"
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
                    // ./dist/ 안의 내용물을 서버의 /var/www/band9-web/dist/ 폴더로 보냅니다.
                    sh """
                        rsync -avz --delete \
                        -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' \
                        ./dist/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/dist/
                    """
                }
                echo "✅ 배포 완료"
            }
        }

        stage('4-2. 배포: Staging') {
            when { branch 'stage' }
            steps { echo "🚧 Staging Skip" }
        }

        stage('4-3. 배포: Production') {
            when { branch 'main' }
            steps { echo "🔥 Production Skip" }
        }
    }

    post {
        success { echo "🎉 CI/CD 성공!" }
        failure { echo "❌ 빌드 실패" }
    }
}