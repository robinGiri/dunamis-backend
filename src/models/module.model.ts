import mongoose, { Schema, Document } from 'mongoose';
import { IClass } from './class.model';

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
  classes: IClass[];
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
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

export default mongoose.model<IModule>('Module', ModuleSchema);
