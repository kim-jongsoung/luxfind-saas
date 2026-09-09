-- 여행사 (고객사) 테이블
CREATE TABLE IF NOT EXISTS agencies (
  agency_id VARCHAR(50) PRIMARY KEY,
  company_name VARCHAR(200) NOT NULL,
  business_number VARCHAR(50),
  
  -- 구독 정보
  subscription_plan VARCHAR(50) DEFAULT 'starter', -- 'starter', 'pro', 'enterprise'
  subscription_status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
  monthly_fee DECIMAL(10,2) DEFAULT 50000.00,
  
  -- 연락처
  contact_name VARCHAR(100),
  contact_email VARCHAR(200),
  contact_phone VARCHAR(50),
  
  -- 도메인
  primary_domain VARCHAR(200),
  custom_domains JSONB DEFAULT '[]'::jsonb,
  
  -- AI 직원 설정
  lora_adapter_path VARCHAR(500),
  ai_employee_name VARCHAR(100) DEFAULT 'AI 상담원',
  
  -- 사용량
  ai_chat_quota INTEGER DEFAULT 1000,
  ai_chat_used INTEGER DEFAULT 0,
  blog_quota INTEGER DEFAULT 10,
  blog_used INTEGER DEFAULT 0,
  
  -- 브랜딩
  logo_url VARCHAR(500),
  primary_color VARCHAR(20) DEFAULT '#4FC3F7',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_agencies_status ON agencies(subscription_status);
CREATE INDEX IF NOT EXISTS idx_agencies_plan ON agencies(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_agencies_domain ON agencies(primary_domain);
