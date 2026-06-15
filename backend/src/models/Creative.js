import mongoose from 'mongoose'

const layerStylesSchema = new mongoose.Schema({
  color: { type: String, default: '#000000' },
  fontSize: { type: Number, default: 16 },
  fontWeight: { type: String, default: 'normal' },
  textAlign: { type: String, default: 'left' },
  backgroundColor: { type: String, default: 'transparent' },
  opacity: { type: Number, default: 1 }
}, { _id: false })

const layerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['text', 'image'], required: true },
  text: { type: String },
  imageUrl: { type: String },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 100 },
  height: { type: Number, default: 100 },
  zIndex: { type: Number, default: 1 },
  animation: { type: String, default: 'none' },
  styles: { type: layerStylesSchema, default: () => ({}) }
}, { _id: false })

const canvasSchema = new mongoose.Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true }
}, { _id: false })

const creativeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  canvas: { type: canvasSchema, required: true },
  layers: { type: [layerSchema], default: [] }
}, { timestamps: true })

const Creative = mongoose.model('Creative', creativeSchema)

export default Creative
