import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
  saleDate: Date;
  salePrice: number;
  paymentMethod: string;
  status: number;
  customer: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
}

const SaleSchema = new Schema<ISale>({
  saleDate: { type: Date, required: true, default: Date.now },
  salePrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: Number, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true }
});

export const Sale = mongoose.model<ISale>('Sale', SaleSchema);
