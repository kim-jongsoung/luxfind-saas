-- 여행사 관리자 계정 테이블
CREATE TABLE IF NOT EXISTS agency_admins (
  admin_id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) REFERENCES agencies(agency_id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  email VARCHAR(200),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_agency_admins_agency ON agency_admins(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_admins_username ON agency_admins(username);
