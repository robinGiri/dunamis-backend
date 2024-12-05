import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  description: string;
  pdf: string;
  video: string;
}

const ClassSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pdf: { type: String, required: false },
  video: { type: String, required: false },
});

export default mongoose.model<IClass>('Class', ClassSchema);
