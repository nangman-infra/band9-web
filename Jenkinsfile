pipeline {
    agent any

    environment {
        APP_NAME = "Band9-Web"
    }

    stages {
        stage('1. 환경 확인') {
            steps {
                echo "현재 브랜치: ${env.BRANCH_NAME}"
            }
        }

        stage('2. 가상 빌드') {
            steps {
                echo "빌드 시뮬레이션 중..."
                sh 'echo "Build Start: $(date)"'
            }
        }

        // --- 여기서부터 중요: when의 위치를 확인하세요 ---

        stage('4-1. 배포: Development') {
            when { 
                branch 'develop' 
            } // steps 블록 "위"에 있어야 합니다.
            steps {
                echo "🚀 [DEV] 개발 서버 배포 로그 기록"
                sh 'echo "[DEV] Deploy at $(date)" >> deploy.log'
            }
        }

        stage('4-2. 배포: Staging') {
            when { 
                branch 'stage' 
            }
            steps {
                echo "🚧 [STAGE] 검증 서버 배포 로그 기록"
                sh 'echo "[STAGE] Deploy at $(date)" >> deploy.log'
            }
        }

        stage('4-3. 배포: Production') {
            when { 
                branch 'main' 
            }
            steps {
                input message: "운영 서버 배포를 승인하시겠습니까?", ok: "승인"
                echo "🔥 [MAIN] 운영 서버 배포 로그 기록"
                sh 'echo "[PROD] Deploy at $(date)" >> deploy.log'
            }
        }
    }
}