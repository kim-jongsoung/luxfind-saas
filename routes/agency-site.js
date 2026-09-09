const express = require('express');
const router = express.Router();
const pool = require('../config/postgresql');
const AgencyWebsite = require('../models/AgencyWebsite');
const AgencyBlogArticle = require('../models/AgencyBlogArticle');

router.get('/', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.render('landing/main', {
        title: '럭스파인드 - 여행사 AI 직원 SaaS 플랫폼'
      });
    }

    const website = await AgencyWebsite.findOne({ 
      agency_id: req.tenant.agency_id 
    });

    const products = await pool.query(
      'SELECT * FROM products WHERE agency_id = $1 AND status = $2 LIMIT 6',
      [req.tenant.agency_id, 'active']
    );

    const blogs = await AgencyBlogArticle.find({
      agency_id: req.tenant.agency_id,
      status: 'published'
    }).sort({ published_at: -1 }).limit(3);

    res.render('agency-site/home', {
      agency: req.tenant,
      website,
      products: products.rows,
      blogs
    });
  } catch (error) {
    console.error('Agency site home error:', error);
    res.status(500).send('페이지 로드 실패');
  }
});

router.get('/blog', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.redirect('/');
    }

    const blogs = await AgencyBlogArticle.find({
      agency_id: req.tenant.agency_id,
      status: 'published'
    }).sort({ published_at: -1 });

    res.render('agency-site/blog-list', {
      agency: req.tenant,
      blogs
    });
  } catch (error) {
    console.error('Blog list error:', error);
    res.status(500).send('블로그 목록 로드 실패');
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.redirect('/');
    }

    const blog = await AgencyBlogArticle.findOne({
      agency_id: req.tenant.agency_id,
      slug: req.params.slug,
      status: 'published'
    });

    if (!blog) {
      return res.status(404).send('블로그를 찾을 수 없습니다.');
    }

    blog.views += 1;
    await blog.save();

    res.render('agency-site/blog-detail', {
      agency: req.tenant,
      blog
    });
  } catch (error) {
    console.error('Blog detail error:', error);
    res.status(500).send('블로그 로드 실패');
  }
});

router.get('/packages', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.redirect('/');
    }

    const products = await pool.query(
      'SELECT * FROM products WHERE agency_id = $1 AND status = $2',
      [req.tenant.agency_id, 'active']
    );

    res.render('agency-site/packages', {
      agency: req.tenant,
      products: products.rows
    });
  } catch (error) {
    console.error('Packages error:', error);
    res.status(500).send('상품 목록 로드 실패');
  }
});

module.exports = router;
