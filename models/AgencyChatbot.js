const mongoose = require('mongoose');

const agencyChatbotSchema = new mongoose.Schema({
  agency_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  chatbot_name: {
    type: String,
    default: 'AI 상담원'
  },
  
  greeting_message: {
    type: String,
    default: '안녕하세요! 무엇을 도와드릴까요?'
  },
  
  avatar_url: String,
  
  system_prompt: {
    type: String,
    default: '당신은 친절한 여행 상담원입니다.'
  },
  
  faqs: [{
    question: String,
    answer: String,
    category: String
  }],
  
  training_conversations: [{
    scenario: String,
    correct_response: String,
    feedback: String,
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

agencyChatbotSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('AgencyChatbot', agencyChatbotSchema);
