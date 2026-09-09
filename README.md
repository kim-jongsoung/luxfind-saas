# 럭스파인드 (LuxFind) - 여행사 AI 직원 SaaS 플랫폼

여행사 100곳에 AI 직원(상담/견적/예약) + 블로그 자동화를 제공하는 멀티테넌트 SaaS 플랫폼

## 🎯 프로젝트 개요

- **목표**: 여행사 100곳 관리
- **핵심 기능**: 
  - 여행사별 독립 AI 직원 (LoRA 파인튜닝)
  - 블로그 자동 생성 시스템
  - 완전 자동화 상담/견적/예약
- **수익 모델**: 월 ₩15,000,000 (100곳 × 평균 ₩150,000)

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 수정

# 데이터베이스 마이그레이션
npm run migrate

# 개발 서버 시작
npm run dev
```

## 📁 프로젝트 구조

```
luxfind-saas/
├─ config/          # 설정 파일
├─ models/          # 데이터베이스 모델
├─ routes/          # API 라우트
├─ services/        # 비즈니스 로직
├─ views/           # EJS 템플릿
├─ public/          # 정적 파일
├─ uploads/         # 업로드 파일
├─ migrations/      # DB 마이그레이션
└─ utils/           # 유틸리티
```

## 💾 데이터베이스

- **PostgreSQL**: 관계형 데이터 (여행사, 구독, 결제)
- **MongoDB**: 콘텐츠 & RAG (블로그, 챗봇, 상담)
- **Redis**: 세션 & 캐시

## 🔧 기술 스택

- Node.js + Express.js
- PostgreSQL + MongoDB + Redis
- EJS + Bootstrap 5
- vLLM (AI 서버)

## 📊 구독 플랜

- **스타터**: ₩50,000/월
- **프로**: ₩150,000/월 (추천)
- **엔터프라이즈**: ₩300,000/월

## 📖 문서

상세한 플랜은 `.windsurf/plans/luxfind-travel-saas-platform-db70ab.md` 참조
