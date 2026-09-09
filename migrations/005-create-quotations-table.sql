-- 견적서 테이블
CREATE TABLE IF NOT EXISTS quotations (
  quotation_id VARCHAR(50) PRIMARY KEY,
  agency_id VARCHAR(50) REFERENCES agencies(agency_id) ON DELETE CASCADE,
  
  customer_name VARCHAR(100),
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50),
  
  products JSONB DEFAULT '[]'::jsonb,
  total_amount DECIMAL(10,2),
  
  pdf_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'viewed', 'accepted', 'rejected'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_quotations_agency ON quotations(agency_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_email ON quotations(customer_email);
