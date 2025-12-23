stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                echo "🚀 [DEV] 개발 서버로 배포를 시작합니다."
                // 큰따옴표 대신 작은따옴표(' ')를 사용하세요.
                sh 'echo "[DEV] Deploying at $(date)" >> deploy.log'
                echo "✅ DEV 배포 완료!"
            }
        }

        stage('4-2. 배포: Staging') {
            when { branch 'stage' }
            steps {
                echo "🚧 [STAGE] 검증 서버로 배포를 시작합니다."
                sh 'echo "[STAGE] Deploying at $(date)" >> deploy.log'
                echo "✅ STAGE 배포 완료!"
            }
        }

        stage('4-3. 배포: Production (Main)') {
            when { branch 'main' }
            steps {
                input message: "⚠️ [운영] 실제 서비스에 배포하시겠습니까?", ok: "배포 승인"
                echo "🔥 [MAIN] 운영 서버로 실제 배포를 진행합니다!"
                sh 'echo "[PROD] Deploying at $(date)" >> deploy.log'
                echo "🎊 MAIN(Production) 환경 배포가 성공적으로 완료되었습니다!"
            }
        }