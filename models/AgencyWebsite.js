const mongoose = require('mongoose');

const agencyWebsiteSchema = new mongoose.Schema({
  agency_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  template_id: {
    type: String,
    default: 'modern'
  },
  
  branding: {
    logo_url: String,
    primary_color: {
      type: String,
      default: '#4FC3F7'
    },
    secondary_color: {
      type: String,
      default: '#667eea'
    },
    font_family: {
      type: String,
      default: 'Noto Sans KR'
    }
  },
  
  pages: [{
    page_type: String,
    title: String,
    content: mongoose.Schema.Types.Mixed,
    published: {
      type: Boolean,
      default: true
    }
  }],
  
  navigation: {
    header_menu: [mongoose.Schema.Types.Mixed],
    footer_menu: [mongoose.Schema.Types.Mixed]
  },
  
  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

agencyWebsiteSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('AgencyWebsite', agencyWebsiteSchema);
