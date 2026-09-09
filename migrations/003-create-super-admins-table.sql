-- 슈퍼 관리자 테이블 (럭스파인드 운영팀)
CREATE TABLE IF NOT EXISTS super_admins (
  super_admin_id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  email VARCHAR(200),
  role VARCHAR(50) DEFAULT 'super_admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 기본 슈퍼 관리자 생성 (비밀번호: luxfind2024!)
-- bcrypt hash for 'luxfind2024!'
INSERT INTO super_admins (username, password_hash, name, email)
VALUES ('luxfind01', '$2b$10$YourHashHere', '럭스파인드 관리자', 'admin@luxfind.com')
ON CONFLICT (username) DO NOTHING;
