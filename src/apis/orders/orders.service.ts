import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const productResult = await this.productService.findOne(
      createOrderDto.productId,
    );
    if (!productResult) {
      throw new NotFoundException('product not found');
    }
    const result = new this.orderModel(createOrderDto);
    return result.save();
  }

  async findOne(id: string): Promise<Order> {
    const result = await this.orderModel
      .findById(id)
      .populate('productId', { name: true, price: true })
      .exec();
    if (!result) {
      throw new NotFoundException('id not found');
    }
    return result;
  }
}
