require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/postgresql');

async function runMigrations() {
  try {
    console.log('🚀 마이그레이션 시작...\n');

    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`📄 실행 중: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
      console.log(`✅ 완료: ${file}\n`);
    }

    console.log('🎉 모든 마이그레이션 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

runMigrations();
