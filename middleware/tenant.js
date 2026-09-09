const pool = require('../config/postgresql');

const tenantMiddleware = async (req, res, next) => {
  try {
    const hostname = req.hostname;
    
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
      req.tenant = null;
      return next();
    }

    const result = await pool.query(
      `SELECT agency_id, company_name, subscription_status, primary_domain, custom_domains 
       FROM agencies 
       WHERE primary_domain = $1 
       OR custom_domains @> $2::jsonb`,
      [hostname, JSON.stringify([hostname])]
    );

    if (result.rows.length > 0) {
      req.tenant = result.rows[0];
      
      if (req.tenant.subscription_status !== 'active') {
        return res.status(403).render('errors/subscription-suspended', {
          agency: req.tenant
        });
      }
    } else {
      req.tenant = null;
    }

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    req.tenant = null;
    next();
  }
};

module.exports = tenantMiddleware;
