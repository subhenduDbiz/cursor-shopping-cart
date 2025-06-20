import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, orderDocument } from '../users/schemas/user.schema';
import { GetOrdersDto } from './dto/get-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(User.name) private orderModel: Model<orderDocument>,
  ) {}

  async findAll(query: GetOrdersDto) {
    const { page = 1, limit = 10, search, isActive } = query;
    
    // Build query - filter by 'user' role (customers)
    const filterQuery: any = { };
    
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await this.orderModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Get customers
    const customers = await this.orderModel
      .find(filterQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      success: true,
      data: customers,
      pagination: {
        page: page,
        limit: limit,
        total,
        totalPages
      }
    };
  }

  async findById(id: string) {
    const customer = await this.orderModel
      .findById(id)
      .select('-password')
      .exec();
    
    if (!customer) {
      return null;
    }

    return {
      success: true,
      data: customer
    };
  }
} 