require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(morgan('dev'));
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'luxfind-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const tenantMiddleware = require('./middleware/tenant');
app.use(tenantMiddleware);

const superAdminRoutes = require('./routes/super-admin');
const agencyAdminRoutes = require('./routes/agency-admin');
const agencySiteRoutes = require('./routes/agency-site');
const authRoutes = require('./routes/auth');

app.use('/super-admin', superAdminRoutes);
app.use('/agency-admin', agencyAdminRoutes);
app.use('/auth', authRoutes);
app.use('/', agencySiteRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'LuxFind SaaS Platform',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).render('errors/404', { 
    url: req.url 
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   럭스파인드 (LuxFind) SaaS 플랫폼                        ║
║   여행사 AI 직원 & 블로그 자동화                         ║
║                                                           ║
║   서버 실행 중: http://localhost:${PORT}                    ║
║   환경: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
