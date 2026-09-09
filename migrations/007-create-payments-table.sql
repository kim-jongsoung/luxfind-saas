-- 결제 테이블 (구독료)
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) REFERENCES agencies(agency_id) ON DELETE CASCADE,
  
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  
  billing_period_start DATE,
  billing_period_end DATE,
  
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_payments_agency ON payments(agency_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_period ON payments(billing_period_start, billing_period_end);
