import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/apis/products/schema/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Product;

  @Prop({ required: true, default: 1 })
  quantity: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
