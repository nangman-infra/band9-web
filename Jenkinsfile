pipeline {
    agent any

    environment {
        // 프로젝트 명칭 및 가상 버전
        APP_NAME = "Band9-Web"
        APP_VERSION = "1.0.${env.BUILD_NUMBER}"
    }

    stages {
        stage('1. 환경 확인 (Environment Check)') {
            steps {
                echo "---------- 현재 실행 정보 ----------"
                echo "빌드 프로젝트: ${env.APP_NAME}"
                echo "빌드 번호: ${env.BUILD_NUMBER}"
                echo "현재 브랜치: ${env.BRANCH_NAME}"
                echo "실행 계정: ${sh(script: 'whoami', returnStdout: true).trim()}"
                echo "----------------------------------"
            }
        }

        stage('2. 의존성 설치 (Mock Install)') {
            steps {
                echo ">>> [${env.BRANCH_NAME}] 환경의 라이브러리를 설치합니다..."
                // 실제 설치 대신 3초 대기하며 시뮬레이션
                sleep time: 3, unit: 'SECONDS'
                echo "✔ 의존성 설치 완료 (node_modules 생성 시뮬레이션)"
            }
        }

        stage('3. 빌드 (Mock Build)') {
            steps {
                echo ">>> 프로젝트 빌드 중: ${env.APP_NAME} v${env.APP_VERSION}"
                // 가상의 빌드 파일 생성 테스트
                sh "echo 'Build Version: ${env.APP_VERSION}' > build_info.txt"
                sleep time: 5, unit: 'SECONDS'
                echo "✔ 빌드 성공: build_info.txt 파일이 생성되었습니다."
            }
        }

        // --- 환경별 배포 시뮬레이션 ---

        stage('4-1. 배포: Development') {
            when { branch 'develop' }
            steps {
                echo "🚀 [DEV] 개발 서버(nangman.cloud)로 배포를 시작합니다."
                sh "echo '[DEV] Deploying at $(date)' >> deploy.log"
                echo "DEBUG: 개발 환경 전용 환경변수(DB_HOST=localhost) 적용 완료"
                sleep 3
                echo "✅ DEV 배포 완료!"
            }
        }

        stage('4-2. 배포: Staging') {
            when { branch 'stage' }
            steps {
                echo "🚧 [STAGE] 검증 서버로 배포를 시작합니다."
                sh "echo '[STAGE] Deploying at $(date)' >> deploy.log"
                echo "DEBUG: 검증용 데이터베이스 스키마 체크 완료"
                sleep 3
                echo "✅ STAGE 배포 완료!"
            }
        }

        stage('4-3. 배포: Production (Main)') {
            when { branch 'main' }
            steps {
                // 운영 배포 전 사용자의 최종 확인을 기다립니다.
                input message: "⚠️ [운영] 실제 서비스에 배포하시겠습니까?", ok: "배포 승인"
                
                echo "🔥 [MAIN] 운영 서버로 실제 배포를 진행합니다!"
                sh "echo '[PROD] Deploying at $(date)' >> deploy.log"
                echo "DEBUG: 로드밸런서(ALB) 헬스체크 대기 중..."
                sleep 5
                echo "🎊 MAIN(Production) 환경 배포가 성공적으로 완료되었습니다!"
            }
        }
    }

    post {
        always {
            echo "---------- 파이프라인 종료 ----------"
        }
        success {
            echo "🎉 성공: ${env.BRANCH_NAME} 브랜치 빌드가 완료되었습니다."
        }
        failure {
            echo "❌ 실패: 빌드 도중 에러가 발생했습니다. 로그를 확인하세요."
        }
    }
}