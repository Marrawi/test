const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workSchema = new Schema({
  name: { type: String, trim: true },
  timeToFinish: { type: Number },
  paid: { type: Number },
  isOpen: { type: Boolean },
  priority: { type: Number },
  tags: [{
    id: { type: Number },
    massage: { type: String, trim: true }
  }],
  requirements: [{
    id: { type: Number },
    massage: { type: String, trim: true }
  }],
  steps: [{
    id: { type: Number },
    massage: { type: String, trim: true }
  }],
  explainLink: { type: String, trim: true },
  proofs: [{
    id: { type: Number },
    massage: { type: String, trim: true },
    userProof: { type: String, trim: true },
  }],
  finisedTopNum: { type: Number },
  createdAt: { type: Date },
  userFeed: [{
    userId: { type: Schema.Types.ObjectID },
    userProofs: [{
      id: { type: Number },
      proof: { type: String, trim: true },
    }],
    createdAt: { type: Date },
    updatedAt: { type: Date },
    waitToVerify: { type: Boolean },
    success: { type: Boolean },
    failed: { type: Boolean },
    faildMassage: { type: String, trim: true }
  }]
});

const Work = mongoose.model('work', workSchema);

module.exports = Work;
