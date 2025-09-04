const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: [ 'user', 'admin' ],
    default: 'user',
  },
  status: {
    type: String,
    enum: [ 'active', 'suspended' ],
    default: 'active',
  },
  tokenVersion: {
    type: Number,
    default: 0,
  }, // 變更密碼/全面登出時可 +1 失效既有 refresh token（進階用）
}, { 
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
