import mongoose from 'mongoose'

const impressionSchema = new mongoose.Schema({
  creativeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creative',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

const Impression = mongoose.model('Impression', impressionSchema)

export default Impression
