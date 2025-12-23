pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
        DEV_SERVER_IP = "172.16.0.8"
        // Nginx가 바라보는 배포 경로
        TARGET_DIR = "/var/www/band9-web"
        // 준호님이 설정하신 SSH 키의 전체 경로
        SSH_KEY_PATH = "/var/lib/jenkins/.ssh/band9-dev-ssh"
    }

    stages {
        stage('1. 환경 확인') {
            steps {
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "대상 서버: ${env.DEV_SERVER_IP}"
            }
        }

        stage('2. Node.js 빌드') {
            steps {
                echo ">>> Node.js 환경 구성 및 빌드 시작"
                script {
                    sh '''
                        # nvm 로드
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                        
                        # .nvmrc 또는 LTS 버전 사용
                        if [ -f .nvmrc ]; then
                            nvm install && nvm use
                        else
                            nvm use --lts
                        fi
                        
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                echo "🚀 [DEV] 개발 서버로 빌드 결과물 전송 (Nginx)"
                
                script {
                    // rsync 명령어에 -i 옵션을 포함하여 키를 명시적으로 지정합니다.
                    // StrictHostKeyChecking=no는 첫 접속 시 묻는 창을 방지합니다.
                    sh """
                        rsync -avz --delete \
                        -e 'ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no' \
                        ./build/ wisoft@${env.DEV_SERVER_IP}:${env.TARGET_DIR}/build/
                    """
                }
                
                echo "✅ [DEV] 배포 완료! 이제 브라우저에서 확인 가능합니다."
            }
        }

        stage('4-2. 배포: Staging') {
            when { branch 'stage' }
            steps {
                echo "🚧 [STAGE] 배포 (설정은 DEV와 동일하며 IP 등만 변경 가능)"
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
            echo "🎉 [${env.BRANCH_NAME}] 파이프라인이 성공적으로 완료되었습니다!"
        }
        failure {
            echo "❌ [${env.BRANCH_NAME}] 빌드 또는 배포 중 에러가 발생했습니다."
        }
    }
}