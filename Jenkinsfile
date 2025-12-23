pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        // 서버 정보
        DEV_SERVER_IP = "172.16.0.8"
        // Nginx가 바라보는 개발 서버의 배포 경로
        TARGET_DIR = "/var/www/band9-web"
        // 빌드 서버 내 Jenkins 계정이 사용하는 SSH 키 경로
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
    }

    stages {
        stage('1. 환경 확인') {
            steps {
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "대상 서버: ${env.DEV_SERVER_IP}"
                echo "패키지 매니저: pnpm (via npx)"
            }
        }

        stage('2. Node.js 빌드 (pnpm)') {
            steps {
                echo ">>> nvm 로드 및 pnpm 빌드를 시작합니다."
                script {
                    sh '''#!/bin/bash
                        # 1. nvm 환경 로드 (bash 환경 명시)
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        
                        # 2. .nvmrc에 명시된 Node.js 버전 사용
                        nvm use
                        
                        # 3. pnpm으로 의존성 설치
                        echo ">>> Installing dependencies with pnpm..."
                        npx pnpm install --no-frozen-lockfile
                        
                        # 4. Vite 빌드 수행 (결과물은 dist/ 폴더에 생성됨)
                        echo ">>> Building React application with Vite..."
                        npx pnpm build
                    '''
                }
            }
        }

        stage('4-1. 배포: Development') {
            when { 
                branch 'develop' 
            }
            steps {
                echo "🚀 [DEV] 개발 서버로 빌드 결과물(dist) 전송"
                
                script {
                    // Vite 빌드 결과물인 ./dist/ 폴더를 전송합니다.
                    // 뒤에 '/'를 붙여 폴더 내용물만 전송하도록 설정했습니다.
                    sh """
                        rsync -avz --delete \
                        -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' \
                        ./dist/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/dist/
                    """
                }
                
                echo "✅ [DEV] Nginx 배포 경로로 파일 전송 완료!"
            }
        }

        stage('4-2. 배포: Staging') {
            when { branch 'stage' }
            steps {
                echo "🚧 [STAGE] 배포 단계 (향후 서버 확충 시 IP 추가)"
            }
        }

        stage('4-3. 배포: Production') {
            when { branch 'main' }
            steps {
                input message: "운영 서버(Main) 배포를 승인하시겠습니까?", ok: "승인"
                echo "🔥 [MAIN] 운영 배포 시작"
            }
        }
    }

    post {
        success {
            echo "🎉 [${env.BRANCH_NAME}] 모든 단계가 성공적으로 완료되었습니다!"
        }
        failure {
            echo "❌ [${env.BRANCH_NAME}] 빌드 또는 배포 중 에러가 발생했습니다. 로그를 확인하세요."
        }
    }
}