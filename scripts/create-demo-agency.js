require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/postgresql');
const mongoose = require('mongoose');
const connectMongoDB = require('../config/mongodb');
const AgencyChatbot = require('../models/AgencyChatbot');
const AgencyWebsite = require('../models/AgencyWebsite');

async function createDemoAgency() {
  try {
    await connectMongoDB();

    const agency_id = 'agency_demo_001';
    const company_name = '바스코투어 (데모)';
    const username = 'vasco01';
    const password = 'vasco2024!';

    console.log('🚀 데모 여행사 생성 중...\n');

    const agencyResult = await pool.query(
      `INSERT INTO agencies (
        agency_id, company_name, business_number, subscription_plan,
        monthly_fee, contact_name, contact_email, contact_phone, 
        primary_domain, ai_employee_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (agency_id) DO UPDATE
      SET company_name = $2, subscription_plan = $4, monthly_fee = $5
      RETURNING *`,
      [
        agency_id,
        company_name,
        '123-45-67890',
        'pro',
        150000,
        '김대표',
        'vasco@example.com',
        '010-1234-5678',
        'vasco-tour.localhost',
        '바스코 AI'
      ]
    );

    console.log('✅ 여행사 생성 완료');

    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO agency_admins (agency_id, username, password_hash, name, email)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO UPDATE
       SET password_hash = $3`,
      [agency_id, username, password_hash, '김대표', 'vasco@example.com']
    );

    console.log('✅ 관리자 계정 생성 완료');

    let chatbot = await AgencyChatbot.findOne({ agency_id });
    if (!chatbot) {
      chatbot = new AgencyChatbot({
        agency_id,
        chatbot_name: '바스코 AI',
        greeting_message: '안녕하세요! 바스코투어입니다. 괌 여행에 대해 무엇이든 물어보세요!',
        system_prompt: '당신은 바스코투어의 친절한 여행 상담원입니다. 괌 전문 여행사로서 고객에게 최고의 여행 상품을 추천합니다.'
      });
      await chatbot.save();
      console.log('✅ AI 챗봇 생성 완료');
    }

    let website = await AgencyWebsite.findOne({ agency_id });
    if (!website) {
      website = new AgencyWebsite({
        agency_id,
        template_id: 'modern',
        branding: {
          logo_url: '',
          primary_color: '#4FC3F7',
          secondary_color: '#667eea',
          font_family: 'Noto Sans KR'
        },
        navigation: {
          header_menu: [
            { label: '홈', url: '/' },
            { label: '블로그', url: '/blog' },
            { label: '상품', url: '/packages' }
          ],
          footer_menu: []
        }
      });
      await website.save();
      console.log('✅ 웹사이트 생성 완료');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  데모 여행사: 바스코투어');
    console.log('  아이디: vasco01');
    console.log('  비밀번호: vasco2024!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n로그인 URL: http://localhost:3000/auth/agency-admin/login\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ 데모 여행사 생성 실패:', error);
    process.exit(1);
  }
}

createDemoAgency();
