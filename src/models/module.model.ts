import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
  name: string;
  type: 'diploma' | 'masters';
  price: number;
  description: string;
  subheader: string;
  img: string;
  starRating: number;
  author: string;
  category: string;
}

const ModuleSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['diploma', 'masters'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  subheader: { type: String, required: true },
  img: { type: String, required: true },
  starRating: { type: Number, required: true, min: 0, max: 5 },
  author: { type: String, required: true },
  category: { type: String, required: true },
});

export default mongoose.model<IModule>('Module', ModuleSchema);
