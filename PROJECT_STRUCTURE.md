# 럭스파인드 SaaS 플랫폼 - 프로젝트 구조

## 📁 전체 파일 구조

```
luxfind-saas/
├── 📄 package.json                    # 프로젝트 설정 및 의존성
├── 📄 package-lock.json               # 의존성 잠금 파일
├── 📄 .env.example                    # 환경 변수 예시
├── 📄 .gitignore                      # Git 무시 파일
├── 📄 README.md                       # 프로젝트 소개
├── 📄 QUICKSTART.md                   # 빠른 시작 가이드
├── 📄 PROJECT_STRUCTURE.md            # 이 파일
├── 📄 server.js                       # 메인 서버 파일
│
├── 📁 config/                         # 설정 파일
│   ├── postgresql.js                  # PostgreSQL 연결
│   ├── mongodb.js                     # MongoDB 연결
│   └── redis.js                       # Redis 연결
│
├── 📁 middleware/                     # 미들웨어
│   ├── tenant.js                      # 멀티테넌트 미들웨어
│   └── auth.js                        # 인증 미들웨어
│
├── 📁 migrations/                     # 데이터베이스 마이그레이션
│   ├── run-migrations.js              # 마이그레이션 실행 스크립트
│   ├── 001-create-agencies-table.sql
│   ├── 002-create-agency-admins-table.sql
│   ├── 003-create-super-admins-table.sql
│   ├── 004-create-products-table.sql
│   ├── 005-create-quotations-table.sql
│   ├── 006-create-reservations-table.sql
│   └── 007-create-payments-table.sql
│
├── 📁 models/                         # MongoDB 모델
│   ├── AgencyChatbot.js               # AI 챗봇 설정
│   ├── AgencyBlogArticle.js           # 블로그 글
│   ├── AgencyConsultation.js          # 상담 내역
│   └── AgencyWebsite.js               # 웹사이트 설정
│
├── 📁 routes/                         # 라우트
│   ├── auth.js                        # 인증 (로그인/로그아웃)
│   ├── super-admin.js                 # 슈퍼 관리자
│   ├── agency-admin.js                # 여행사 관리자
│   └── agency-site.js                 # 고객용 사이트
│
├── 📁 scripts/                        # 유틸리티 스크립트
│   ├── create-super-admin.js          # 슈퍼 관리자 생성
│   └── create-demo-agency.js          # 데모 여행사 생성
│
├── 📁 views/                          # EJS 템플릿
│   ├── layout.ejs                     # 기본 레이아웃
│   │
│   ├── 📁 auth/                       # 인증 페이지
│   │   ├── super-admin-login.ejs
│   │   └── agency-admin-login.ejs
│   │
│   ├── 📁 super-admin/                # 슈퍼 관리자 페이지
│   │   ├── dashboard.ejs
│   │   ├── agencies.ejs
│   │   ├── payments.ejs
│   │   └── monitoring.ejs
│   │
│   ├── 📁 agency-admin/               # 여행사 관리자 페이지
│   │   ├── dashboard.ejs
│   │   ├── ai-employee.ejs
│   │   ├── blog-automation.ejs
│   │   ├── products.ejs
│   │   ├── consultations.ejs
│   │   ├── quotations.ejs
│   │   └── reservations.ejs
│   │
│   ├── 📁 agency-site/                # 고객용 사이트
│   │   ├── home.ejs
│   │   ├── blog-list.ejs
│   │   ├── blog-detail.ejs
│   │   └── packages.ejs
│   │
│   ├── 📁 landing/                    # 랜딩 페이지
│   │   └── main.ejs
│   │
│   ├── 📁 partials/                   # 공통 컴포넌트
│   │   └── super-admin-navbar.ejs
│   │
│   └── 📁 errors/                     # 에러 페이지
│       └── 404.ejs
│
├── 📁 public/                         # 정적 파일 (CSS, JS, 이미지)
│   └── .gitkeep
│
├── 📁 uploads/                        # 업로드 파일
│   └── .gitkeep
│
└── 📁 node_modules/                   # npm 패키지 (gitignore)
```

## 🗄️ 데이터베이스 구조

### PostgreSQL (관계형 데이터)
- `agencies` - 여행사 정보
- `agency_admins` - 여행사 관리자 계정
- `super_admins` - 슈퍼 관리자 계정
- `products` - 상품 정보
- `quotations` - 견적서
- `reservations` - 예약
- `payments` - 결제 (구독료)

### MongoDB (콘텐츠 & RAG)
- `AgencyChatbot` - AI 챗봇 설정
- `AgencyBlogArticle` - 블로그 글
- `AgencyConsultation` - 상담 내역
- `AgencyWebsite` - 웹사이트 설정

## 🔑 주요 기능별 파일

### 멀티테넌트 시스템
- `middleware/tenant.js` - 도메인별 여행사 식별
- `routes/agency-site.js` - 고객용 사이트 라우팅

### 인증 시스템
- `middleware/auth.js` - 권한 체크
- `routes/auth.js` - 로그인/로그아웃
- `views/auth/` - 로그인 페이지

### 슈퍼 관리자
- `routes/super-admin.js` - 여행사 관리, 결제, 모니터링
- `views/super-admin/` - 관리자 대시보드

### 여행사 관리자
- `routes/agency-admin.js` - AI 직원, 블로그, 상품 관리
- `views/agency-admin/` - 여행사 대시보드

### AI 직원 시스템
- `models/AgencyChatbot.js` - 챗봇 설정 및 학습 데이터
- `models/AgencyConsultation.js` - 상담 내역 저장

### 블로그 자동화
- `models/AgencyBlogArticle.js` - 블로그 글 저장
- `views/agency-site/blog-*.ejs` - 블로그 표시

## 📦 주요 의존성

### 백엔드
- `express` - 웹 프레임워크
- `pg` - PostgreSQL 클라이언트
- `mongoose` - MongoDB ODM
- `redis` - Redis 클라이언트
- `bcrypt` - 비밀번호 해싱
- `express-session` - 세션 관리

### 프론트엔드
- `ejs` - 템플릿 엔진
- Bootstrap 5 (CDN)
- jQuery (CDN)

### 유틸리티
- `dotenv` - 환경 변수
- `axios` - HTTP 클라이언트
- `multer` - 파일 업로드
- `nodemailer` - 이메일 발송
- `uuid` - 고유 ID 생성
- `jsonwebtoken` - JWT 토큰

## 🚀 실행 순서

1. `.env` 파일 생성
2. `node migrations/run-migrations.js` - DB 테이블 생성
3. `node scripts/create-super-admin.js` - 관리자 계정 생성
4. `npm run dev` - 서버 실행
5. http://localhost:3000 접속

## 📝 다음 구현 예정

- [ ] AI 서버 연동 (Vultr GPU)
- [ ] 블로그 자동 생성 서비스
- [ ] 이미지 업로드 시스템
- [ ] 결제 시스템 (토스페이먼츠)
- [ ] 이메일 발송 시스템
- [ ] 도메인 관리 시스템
- [ ] SSL 자동화
- [ ] 통계 대시보드
- [ ] 여행사 관리자 추가 기능들
