# 럭스파인드 SaaS 플랫폼 - 빠른 시작 가이드

## 1️⃣ 환경 설정

### .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력하세요:

```bash
# PostgreSQL (Railway 또는 로컬)
DATABASE_URL=postgresql://user:password@host:5432/luxfind_saas

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/luxfind_saas

# Redis (선택사항 - 없으면 메모리 세션 사용)
# REDIS_URL=redis://localhost:6379

# 세션 시크릿
SESSION_SECRET=your-super-secret-session-key-change-this-to-random-string

# JWT 시크릿
JWT_SECRET=your-jwt-secret-key-change-this-to-random-string

# 환경
NODE_ENV=development
PORT=3000
```

## 2️⃣ 데이터베이스 마이그레이션

PostgreSQL 테이블 생성:

```bash
node migrations/run-migrations.js
```

## 3️⃣ 슈퍼 관리자 계정 생성

```bash
node scripts/create-super-admin.js
```

생성되는 계정:
- 아이디: `luxfind01`
- 비밀번호: `luxfind2024!`

## 4️⃣ 데모 여행사 생성 (선택사항)

```bash
node scripts/create-demo-agency.js
```

생성되는 계정:
- 아이디: `vasco01`
- 비밀번호: `vasco2024!`

## 5️⃣ 서버 실행

### 개발 모드 (nodemon)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## 6️⃣ 접속

- **메인 페이지**: http://localhost:3000
- **슈퍼 관리자**: http://localhost:3000/auth/super-admin/login
- **여행사 관리자**: http://localhost:3000/auth/agency-admin/login

## 📋 체크리스트

- [ ] `.env` 파일 생성 및 설정
- [ ] PostgreSQL 데이터베이스 준비
- [ ] MongoDB Atlas 클러스터 준비
- [ ] `npm install` 실행
- [ ] 마이그레이션 실행
- [ ] 슈퍼 관리자 계정 생성
- [ ] 서버 실행
- [ ] 로그인 테스트

## 🚀 Railway 배포

1. Railway 프로젝트 생성
2. PostgreSQL 플러그인 추가
3. 환경 변수 설정 (위 .env 내용)
4. GitHub 연결 또는 CLI 배포

```bash
railway login
railway init
railway up
```

## 💡 다음 단계

1. 슈퍼 관리자로 로그인
2. 여행사 추가
3. 여행사 관리자로 로그인
4. AI 직원 학습 시작
5. 블로그 자동화 설정

## 🆘 문제 해결

### PostgreSQL 연결 오류
- DATABASE_URL 확인
- 방화벽 설정 확인
- SSL 설정 확인 (Railway는 SSL 필수)

### MongoDB 연결 오류
- MONGODB_URI 확인
- IP 화이트리스트 확인 (0.0.0.0/0 허용)

### 포트 충돌
- PORT 환경 변수 변경
- 다른 서버 종료

## 📞 지원

문제가 있으면 플랜 문서를 참조하세요:
`.windsurf/plans/luxfind-travel-saas-platform-db70ab.md`
