const mongoose = require('mongoose');

const agencyConsultationSchema = new mongoose.Schema({
  consultation_id: {
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
  
  customer_name: String,
  customer_email: String,
  
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  consultation_type: String,
  
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  
  quotation_id: String,
  reservation_id: String,
  
  created_at: {
    type: Date,
    default: Date.now
  }
});

agencyConsultationSchema.index({ agency_id: 1, status: 1 });
agencyConsultationSchema.index({ agency_id: 1, created_at: -1 });

module.exports = mongoose.model('AgencyConsultation', agencyConsultationSchema);
