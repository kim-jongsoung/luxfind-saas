const express = require('express');
const router = express.Router();
const { requireAgencyAdmin } = require('../middleware/auth');
const pool = require('../config/postgresql');
const AgencyChatbot = require('../models/AgencyChatbot');
const AgencyBlogArticle = require('../models/AgencyBlogArticle');
const AgencyConsultation = require('../models/AgencyConsultation');

router.use(requireAgencyAdmin);

router.get('/dashboard', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;

    const agencyInfo = await pool.query(
      'SELECT * FROM agencies WHERE agency_id = $1',
      [agency_id]
    );

    const todayStats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_quotations,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND status = 'accepted') as today_reservations
      FROM quotations
      WHERE agency_id = $1
    `, [agency_id]);

    const consultations = await AgencyConsultation.find({ 
      agency_id,
      created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }).countDocuments();

    const blogs = await AgencyBlogArticle.find({ 
      agency_id,
      status: 'published'
    }).countDocuments();

    res.render('agency-admin/dashboard', {
      admin: req.session.agencyAdmin,
      agency: agencyInfo.rows[0],
      stats: {
        consultations,
        quotations: todayStats.rows[0].today_quotations,
        reservations: todayStats.rows[0].today_reservations,
        blogs
      }
    });
  } catch (error) {
    console.error('Agency dashboard error:', error);
    res.status(500).send('대시보드 로드 실패');
  }
});

router.get('/ai-employee', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    
    let chatbot = await AgencyChatbot.findOne({ agency_id });
    
    if (!chatbot) {
      chatbot = new AgencyChatbot({ agency_id });
      await chatbot.save();
    }

    res.render('agency-admin/ai-employee', {
      admin: req.session.agencyAdmin,
      chatbot
    });
  } catch (error) {
    console.error('AI employee error:', error);
    res.status(500).send('AI 직원 페이지 로드 실패');
  }
});

router.post('/ai-employee/train', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    const { scenario, correct_response, feedback } = req.body;

    await AgencyChatbot.findOneAndUpdate(
      { agency_id },
      {
        $push: {
          training_conversations: {
            scenario,
            correct_response,
            feedback
          }
        }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('AI training error:', error);
    res.status(500).json({ error: '학습 저장 실패' });
  }
});

router.get('/blog-automation', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    
    const blogs = await AgencyBlogArticle.find({ agency_id })
      .sort({ created_at: -1 })
      .limit(20);

    res.render('agency-admin/blog-automation', {
      admin: req.session.agencyAdmin,
      blogs
    });
  } catch (error) {
    console.error('Blog automation error:', error);
    res.status(500).send('블로그 자동화 페이지 로드 실패');
  }
});

router.get('/products', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    
    const products = await pool.query(
      'SELECT * FROM products WHERE agency_id = $1 ORDER BY created_at DESC',
      [agency_id]
    );

    res.render('agency-admin/products', {
      admin: req.session.agencyAdmin,
      products: products.rows
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).send('상품 페이지 로드 실패');
  }
});

router.get('/consultations', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    
    const consultations = await AgencyConsultation.find({ agency_id })
      .sort({ created_at: -1 })
      .limit(50);

    res.render('agency-admin/consultations', {
      admin: req.session.agencyAdmin,
      consultations
    });
  } catch (error) {
    console.error('Consultations error:', error);
    res.status(500).send('상담 내역 로드 실패');
  }
});

router.get('/quotations', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    
    const quotations = await pool.query(
      'SELECT * FROM quotations WHERE agency_id = $1 ORDER BY created_at DESC',
      [agency_id]
    );

    res.render('agency-admin/quotations', {
      admin: req.session.agencyAdmin,
      quotations: quotations.rows
    });
  } catch (error) {
    console.error('Quotations error:', error);
    res.status(500).send('견적서 목록 로드 실패');
  }
});

router.get('/reservations', async (req, res) => {
  try {
    const agency_id = req.session.agencyAdmin.agency_id;
    
    const reservations = await pool.query(
      'SELECT * FROM reservations WHERE agency_id = $1 ORDER BY created_at DESC',
      [agency_id]
    );

    res.render('agency-admin/reservations', {
      admin: req.session.agencyAdmin,
      reservations: reservations.rows
    });
  } catch (error) {
    console.error('Reservations error:', error);
    res.status(500).send('예약 목록 로드 실패');
  }
});

module.exports = router;
