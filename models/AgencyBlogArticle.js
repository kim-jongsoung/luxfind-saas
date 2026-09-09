const mongoose = require('mongoose');

const agencyBlogArticleSchema = new mongoose.Schema({
  article_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  agency_id: {
    type: String,
    required: true,
    index: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  slug: {
    type: String,
    required: true
  },
  
  content: {
    type: String,
    required: true
  },
  
  excerpt: String,
  
  featured_image: String,
  images: [String],
  
  category: String,
  tags: [String],
  
  meta_title: String,
  meta_description: String,
  meta_keywords: [String],
  
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  
  auto_generated: {
    type: Boolean,
    default: false
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  published_at: Date,
  
  created_at: {
    type: Date,
    default: Date.now
  }
});

agencyBlogArticleSchema.index({ agency_id: 1, status: 1 });
agencyBlogArticleSchema.index({ agency_id: 1, slug: 1 });

module.exports = mongoose.model('AgencyBlogArticle', agencyBlogArticleSchema);
