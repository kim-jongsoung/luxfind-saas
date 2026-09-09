const express = require('express');
const router = express.Router();
const { requireSuperAdmin } = require('../middleware/auth');
const pool = require('../config/postgresql');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

router.use(requireSuperAdmin);

router.get('/dashboard', async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_agencies,
        COUNT(*) FILTER (WHERE subscription_status = 'active') as active_agencies,
        SUM(monthly_fee) FILTER (WHERE subscription_status = 'active') as monthly_revenue,
        SUM(ai_chat_used) as total_chats,
        SUM(blog_used) as total_blogs
      FROM agencies
    `);

    const recentAgencies = await pool.query(`
      SELECT agency_id, company_name, subscription_plan, subscription_status, created_at
      FROM agencies
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.render('super-admin/dashboard', {
      admin: req.session.superAdmin,
      stats: statsResult.rows[0],
      recentAgencies: recentAgencies.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('대시보드 로드 실패');
  }
});

router.get('/agencies', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        COUNT(aa.admin_id) as admin_count
      FROM agencies a
      LEFT JOIN agency_admins aa ON a.agency_id = aa.agency_id
      GROUP BY a.agency_id
      ORDER BY a.created_at DESC
    `);

    res.render('super-admin/agencies', {
      admin: req.session.superAdmin,
      agencies: result.rows
    });
  } catch (error) {
    console.error('Agencies list error:', error);
    res.status(500).send('여행사 목록 로드 실패');
  }
});

router.post('/agencies/create', async (req, res) => {
  try {
    const {
      company_name,
      business_number,
      subscription_plan,
      contact_name,
      contact_email,
      contact_phone,
      primary_domain,
      username,
      password
    } = req.body;

    const agency_id = `agency_${Date.now()}`;
    const monthly_fee = subscription_plan === 'starter' ? 50000 : 
                        subscription_plan === 'pro' ? 150000 : 300000;

    await pool.query(`
      INSERT INTO agencies (
        agency_id, company_name, business_number, subscription_plan,
        monthly_fee, contact_name, contact_email, contact_phone, primary_domain
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      agency_id, company_name, business_number, subscription_plan,
      monthly_fee, contact_name, contact_email, contact_phone, primary_domain
    ]);

    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(`
      INSERT INTO agency_admins (agency_id, username, password_hash, name, email)
      VALUES ($1, $2, $3, $4, $5)
    `, [agency_id, username, password_hash, contact_name, contact_email]);

    res.redirect('/super-admin/agencies');
  } catch (error) {
    console.error('Create agency error:', error);
    res.status(500).send('여행사 생성 실패');
  }
});

router.post('/agencies/:id/suspend', async (req, res) => {
  try {
    await pool.query(
      'UPDATE agencies SET subscription_status = $1 WHERE agency_id = $2',
      ['suspended', req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Suspend agency error:', error);
    res.status(500).json({ error: '일시 중지 실패' });
  }
});

router.post('/agencies/:id/activate', async (req, res) => {
  try {
    await pool.query(
      'UPDATE agencies SET subscription_status = $1 WHERE agency_id = $2',
      ['active', req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Activate agency error:', error);
    res.status(500).json({ error: '활성화 실패' });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        a.company_name
      FROM payments p
      JOIN agencies a ON p.agency_id = a.agency_id
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    res.render('super-admin/payments', {
      admin: req.session.superAdmin,
      payments: result.rows
    });
  } catch (error) {
    console.error('Payments error:', error);
    res.status(500).send('결제 내역 로드 실패');
  }
});

router.get('/monitoring', async (req, res) => {
  try {
    const usageStats = await pool.query(`
      SELECT 
        agency_id,
        ai_chat_quota,
        ai_chat_used,
        blog_quota,
        blog_used
      FROM agencies
      WHERE subscription_status = 'active'
    `);

    res.render('super-admin/monitoring', {
      admin: req.session.superAdmin,
      usageStats: usageStats.rows
    });
  } catch (error) {
    console.error('Monitoring error:', error);
    res.status(500).send('모니터링 로드 실패');
  }
});

module.exports = router;
