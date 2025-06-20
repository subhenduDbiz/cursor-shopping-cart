import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      totalPrice: { type: Number, required: true, min: 0 },
    },
  ])
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
    price: number;
    discount: number;
    totalPrice: number;
  }>;

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ default: 0, min: 0 })
  tax: number;

  @Prop({ default: 0, min: 0 })
  shippingCost: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({
    type: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
  })
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };

  @Prop({
    type: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
  })
  billingAddress: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @Prop({ required: true, enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'] })
  paymentMethod: string;

  @Prop({ enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'], default: 'pending' })
  paymentStatus: string;

  @Prop({
    type: {
      transactionId: { type: String, trim: true },
      paymentDate: { type: Date },
      paymentGateway: { type: String, trim: true },
    },
  })
  paymentDetails: {
    transactionId?: string;
    paymentDate?: Date;
    paymentGateway?: string;
  };

  @Prop({ enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'], default: 'pending' })
  status: string;

  @Prop([
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: Types.ObjectId, ref: 'User' },
      notes: { type: String, trim: true },
    },
  ])
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    updatedBy?: Types.ObjectId;
    notes?: string;
  }>;

  @Prop({
    type: {
      trackingNumber: { type: String, trim: true },
      carrier: { type: String, trim: true },
      shippedDate: { type: Date },
      estimatedDelivery: { type: Date },
      actualDelivery: { type: Date },
    },
  })
  shippingDetails: {
    trackingNumber?: string;
    carrier?: string;
    shippedDate?: Date;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };

  @Prop({
    type: {
      customer: { type: String, trim: true },
      admin: { type: String, trim: true },
    },
  })
  notes: {
    customer?: string;
    admin?: string;
  };

  @Prop([{ type: String, trim: true }])
  tags: string[];

  @Prop({ enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' })
  priority: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 