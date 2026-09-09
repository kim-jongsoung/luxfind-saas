const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/postgresql');

router.get('/super-admin/login', (req, res) => {
  res.render('auth/super-admin-login', {
    error: null
  });
});

router.post('/super-admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM super_admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.render('auth/super-admin-login', {
        error: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return res.render('auth/super-admin-login', {
        error: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    req.session.superAdmin = {
      id: admin.super_admin_id,
      username: admin.username,
      name: admin.name
    };

    res.redirect('/super-admin/dashboard');
  } catch (error) {
    console.error('Super admin login error:', error);
    res.render('auth/super-admin-login', {
      error: '로그인 중 오류가 발생했습니다.'
    });
  }
});

router.get('/agency-admin/login', (req, res) => {
  res.render('auth/agency-admin-login', {
    error: null
  });
});

router.post('/agency-admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      `SELECT aa.*, a.company_name, a.subscription_status 
       FROM agency_admins aa
       JOIN agencies a ON aa.agency_id = a.agency_id
       WHERE aa.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.render('auth/agency-admin-login', {
        error: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const admin = result.rows[0];

    if (admin.subscription_status !== 'active') {
      return res.render('auth/agency-admin-login', {
        error: '구독이 일시 중지되었습니다. 관리자에게 문의하세요.'
      });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return res.render('auth/agency-admin-login', {
        error: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    req.session.agencyAdmin = {
      id: admin.admin_id,
      username: admin.username,
      name: admin.name,
      agency_id: admin.agency_id,
      company_name: admin.company_name
    };

    res.redirect('/agency-admin/dashboard');
  } catch (error) {
    console.error('Agency admin login error:', error);
    res.render('auth/agency-admin-login', {
      error: '로그인 중 오류가 발생했습니다.'
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
