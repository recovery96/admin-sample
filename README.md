## 프로젝트 실행

```bash
# Node 버전 v18.19.0

# Mac OS인 경우
nvm use

# 프로젝트 의존성 설치
npm install

# 개발 모드에서 프로젝트 실행
npm run dev

# 환경변수 설정 예시
# 단, 개발 환경에서 MSW를 활용하여 Mock Server를 구성하고 있으므로, 프로젝트 실행 환경과 동일하게 설정해야 합니다.
# ex) VITE_SERVER_URL=http://127.0.0.1:8080 (MSW 사용 시, 프로젝트 실행 환경과 동일하게 설정!!!)
# ex) VITE_SERVER_URL=https://api.example.com (실제 API 서버 사용 시)
# env.example의 example을 제거해주세요.
VITE_SERVER_URL=http://127.0.0.1:8080
```

## 프로젝트 구조

```bash
프로젝트명/
│
├── src/
│   ├── assets/      # Assets 관련 파일들
│   │
│   ├── components/  # 컴포넌트 관련 파일들
│   │   └── common/
│   │       ├── CommonLayout/         # 페이지 레이아웃을 구성하는 합성 컴포넌트
│   │       │   ├── components/       # 합성 컴포넌트에서 사용되는 자식 컴포넌트 파일들
│   │       │   ├── context.ts        # 합성 컴포넌트의 상태 관리를 위한 Context API 파일
│   │       │   ├── index.tsx         # 합성 컴포넌트의 메인 파일
│   │       │ 	└── models.ts         # 합성 컴포넌트에서 사용되는 타입 정의 파일
│   │       │
│   │       └── CommonTable/
│   │           ├── components/       # 자식 컴포넌트 파일들 (합성 컴포넌트)
│   │           ├── context.ts        # Context API 파일 (합성 컴포넌트)
│   │           ├── index.tsx
│   │         	└── models.ts         # 타입 파일 (합성 컴포넌트)
│   │
│   ├── constants/   # 상수 관련 파일들
│   │
│   ├── hooks/       # 커스텀 훅스 관련 파일들
│   │   ├── useAuth.ts                # 사용자 인증을 관리하는 훅
│   │   ├── useConfirm.ts             # 사용자로부터의 확인을 요구하는 동작을 처리하는 훅
│   │   ├── useDialog.ts              # 다이얼로그를 관리하는 훅
│   │   ├── useNProgress.ts           # 페이지 로딩 진행 상황을 시각적으로 표시하는 훅
│   │   └── useResponseive.ts         # 반응형을 관리하는 훅
│   │
│   ├── mocks/       # MSW 관련 파일들
│   │
│   ├── models/      # 타입 관련 파일들
│   │
│   ├── pages/       # 페이지 관련 파일들
│   │   ├── 기능명/
│   │   │   └── index.ts              # 기능별 페이지 파일
│   │   └── index.ts                  # 비동기적으로 로딩하기 위한 Lazy 페이지 메인 파일
│   │
│   ├── routes/      # 라우팅 관련 파일들
│   │   ├── 기능명/
│   │   │   └── index.ts              # 기능별 라우팅 파일
│   │   └── index.ts                  # 라우팅 메인 파일
│   │
│   ├── services/    # API 관련 파일들
│   │   └── 기능명/
│   │       ├── index.ts              # API 호출 함수 파일
│   │       └── queries.ts            # Query Keys와 API 호출 훅을 관리하는 파일
│   │
│   ├── theme/       # MUI Theme 관련 파일들
│   │
│   ├── utils/       # 유틸함수 관련 파일들
```

## CI / CD 파이프라인

```yaml
name: Deploy to S3

on:
  # 'sample-*' 패턴을 가진 태그가 push되면 워크플로우가 동작합니다.
  push:
    tags:
      - 'sample-*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # 레파지토리의 코드를 체크아웃합니다.
      - name: Checkout code
        uses: actions/checkout@v3

      # Node를 설정합니다.
      - name: Setup Node.js 18.19.0.
        uses: actions/setup-node@v3
        # 사용할 Node 버전을 지정합니다.
        with:
          node-version: '18.19.0'

      # 의존성을 설치하고 프로젝트를 빌드합니다.
      - name: Install dependencies and build
        run: |
          npm install
          npm run build
        # 환경 변수를 설정합니다.
        env:
          VITE_SERVER_URL: ${{ vars.VITE_SERVER_URL }}

      # AWS 자격 증명을 설정합니다.
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_S3_BUCKET_REGION }}

      # 빌드된 파일들을 S3 버킷에 업로드합니다.
      - name: Upload to S3
        # dist 폴더 내의 파일들을 S3 버킷으로 동기화합니다.
        # index.html은 캐시 제어 옵션을 다르게 설정하면서 따로 업로드합니다.
        run: |
          aws s3 sync ./dist s3://${{ secrets.AWS_S3_BUCKET_NAME }} --exclude "index.html" --follow-symlinks --delete --cache-control "max-age=31536000"
          aws s3 cp ./dist/index.html s3://${{ secrets.AWS_S3_BUCKET_NAME }}/index.html --cache-control "max-age=0, s-maxage=31536000"

      # CloudFront 캐시를 무효화합니다.
      - name: Invalidate CloudFront Distribution
        # index.html에 대한 캐시 무효화 명령을 실행합니다.
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID }} --paths "/index.html"
```
