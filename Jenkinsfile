pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        DEV_SERVER_IP = "172.16.0.8"
        // Nginx 배포 경로
        TARGET_DIR = "/var/www/band9-web"
        // SSH 키 경로
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
    }

    stages {
        stage('1. 환경 확인') {
            steps {
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "패키지 매니저: pnpm (via npx)"
            }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                echo ">>> nvm 로드 및 pnpm 빌드를 시작합니다."
                script {
                    sh '''#!/bin/bash
                        # 1. nvm 환경 로드
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        
                        # 2. .nvmrc 버전 사용
                        nvm use
                        
                        # 3. pnpm으로 의존성 설치
                        # npx를 사용하면 pnpm이 설치되지 않은 환경에서도 실행 가능합니다.
                        echo ">>> Installing dependencies with pnpm..."
                        npx pnpm install --no-frozen-lockfile
                        
                        # 4. 리액트 빌드 수행
                        echo ">>> Building React application..."
                        npx pnpm build
                    '''
                }
            }
        }

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                echo "🚀 [DEV] 개발 서버로 빌드 결과물 전송 (Nginx)"
                
                script {
                    // rsync로 빌드 폴더 전송
                    sh """
                        rsync -avz --delete \
                        -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' \
                        ./build/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/build/
                    """
                }
                
                echo "✅ [DEV] Nginx 배포 완료!"
            }
        }

        // Staging 및 Production 단계는 동일한 방식으로 유지
    }

    post {
        success {
            echo "🎉 [${env.BRANCH_NAME}] pnpm 빌드 및 배포 성공!"
        }
        failure {
            echo "❌ [${env.BRANCH_NAME}] 빌드 실패. 로그를 확인하세요."
        }
    }
}