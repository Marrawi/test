const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

  // account infomation
  email: { type: String, lowercase: true,  trim: true },
  username: { type: String, index: true, trim: true, minlenght: 5, maxlenght: 15 },
  password: { type: String, minlenght: 7, maxlenght: 15, trim: true },
  allMoney: { type: String, trim: true },
  money: { type: String, trim: true },
  phoneType: { type: String, trim: true },
  phone: { type: String, trim: true },

  // all user IP address
  userIP: [{ ip: { type: String } }],

  // money Information
  withdraws: [{
    withdrawID: { type: Schema.Types.ObjectID },
    withdrawDate: { type: Date },
    withdrawType: { type: String },
    withdrawSize: { type: Number },
    isWithdrawWaiting: { type: Boolean},
    isWithdrawSuccess: { type: Boolean},
    isWithdrawVerified: { type: Boolean},
  }],

  // account security
  isVerified: { type: Boolean},
  isAdmin: { type: Boolean},
  verifyToken: { type: String, trim: true },
  waitToSend: { type: Number },
  blocked: { type: Boolean}
},{
  timestamps: true
});

const User = mongoose.model('user', userSchema);

module.exports = User;
