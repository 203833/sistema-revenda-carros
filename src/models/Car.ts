import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  brand: string;
  carModel: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  status: string;
  sales: mongoose.Types.ObjectId[];
}

const CarSchema = new Schema<ICar>({
  brand: { type: String, required: true },
  carModel: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  status: { type: String, default: 'Disponível' },
  sales: [{ type: Schema.Types.ObjectId, ref: 'Sale' }]
});

export const Car = mongoose.model<ICar>('Car', CarSchema);
