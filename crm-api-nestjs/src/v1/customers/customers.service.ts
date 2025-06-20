import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { GetCustomersDto } from './dto/get-customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(query: GetCustomersDto) {
    const { page = 1, limit = 10, search, isActive } = query;
    
    // Build query - filter by 'user' role (customers)
    const filterQuery: any = { role: 'user' };
    
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      filterQuery.isActive = isActive.toString() === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Get customers
    const customers = await this.userModel
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
    const customer = await this.userModel
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