import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  sales: mongoose.Types.ObjectId[];
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  sales: [{ type: Schema.Types.ObjectId, ref: 'Sale' }]
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
