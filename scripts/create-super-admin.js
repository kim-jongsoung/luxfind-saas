require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/postgresql');

async function createSuperAdmin() {
  try {
    const username = 'luxfind01';
    const password = 'luxfind2024!';
    const name = '럭스파인드 관리자';
    const email = 'admin@luxfind.com';

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO super_admins (username, password_hash, name, email)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE
       SET password_hash = $2, name = $3, email = $4
       RETURNING *`,
      [username, password_hash, name, email]
    );

    console.log('✅ 슈퍼 관리자 계정 생성 완료!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  아이디: luxfind01');
    console.log('  비밀번호: luxfind2024!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('로그인 URL: http://localhost:3000/auth/super-admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ 슈퍼 관리자 생성 실패:', error);
    process.exit(1);
  }
}

createSuperAdmin();
