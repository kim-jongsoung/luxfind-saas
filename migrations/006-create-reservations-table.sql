-- 예약 테이블
CREATE TABLE IF NOT EXISTS reservations (
  reservation_id VARCHAR(50) PRIMARY KEY,
  quotation_id VARCHAR(50) REFERENCES quotations(quotation_id),
  agency_id VARCHAR(50) REFERENCES agencies(agency_id) ON DELETE CASCADE,
  
  customer_info JSONB DEFAULT '{}'::jsonb,
  travelers JSONB DEFAULT '[]'::jsonb,
  
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  payment_amount DECIMAL(10,2),
  payment_url VARCHAR(500),
  
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reservations_agency ON reservations(agency_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_payment_status ON reservations(payment_status);
