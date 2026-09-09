-- 상품 테이블 (RAG 지식베이스용)
CREATE TABLE IF NOT EXISTS products (
  product_id VARCHAR(50) PRIMARY KEY,
  agency_id VARCHAR(50) REFERENCES agencies(agency_id) ON DELETE CASCADE,
  
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  
  -- 가격
  base_price DECIMAL(10,2),
  adult_price DECIMAL(10,2),
  child_price DECIMAL(10,2),
  
  -- 포함 사항
  includes JSONB DEFAULT '{}'::jsonb,
  
  -- 재고
  stock INTEGER DEFAULT 0,
  available_dates JSONB DEFAULT '[]'::jsonb,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_products_agency ON products(agency_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
