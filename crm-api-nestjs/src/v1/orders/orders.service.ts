import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { GetOrdersDto } from './dto/get-orders.dto';
import { Product } from '../products/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(query: GetOrdersDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        paymentStatus,
        paymentMethod,
        priority,
        dateFrom,
        dateTo,
        minAmount,
        maxAmount,
        city,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      // Build query
      const filterQuery: any = {};

      if (search) {
        filterQuery.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
          { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
          { 'shippingAddress.email': { $regex: search, $options: 'i' } },
        ];
      }
      if (status) filterQuery.status = status;
      if (paymentStatus) filterQuery.paymentStatus = paymentStatus;
      if (paymentMethod) filterQuery.paymentMethod = paymentMethod;
      if (priority) filterQuery.priority = priority;
      if (dateFrom !== undefined || dateTo !== undefined) {
        filterQuery.createdAt = {};
        if (dateFrom !== undefined) filterQuery.createdAt.$gte = new Date(dateFrom);
        if (dateTo !== undefined) filterQuery.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
        if (Object.keys(filterQuery.createdAt).length === 0) {
          delete filterQuery.createdAt;
        }
      }
      if (minAmount !== undefined || maxAmount !== undefined) {
        filterQuery.totalAmount = {};
        if (minAmount !== undefined) filterQuery.totalAmount.$gte = minAmount;
        if (maxAmount !== undefined) filterQuery.totalAmount.$lte = maxAmount;
        if (Object.keys(filterQuery.totalAmount).length === 0) {
          delete filterQuery.totalAmount;
        }
      }
      if (city) {
        filterQuery['shippingAddress.city'] = { $regex: city, $options: 'i' };
      }

      // Pagination
      const skip = (page - 1) * limit;
      const total = await this.orderModel.countDocuments(filterQuery);
      const totalPages = Math.ceil(total / limit);

      // Sorting
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get orders with population
      const orders = await this.orderModel
        .find(filterQuery)
        .populate('user', 'name email mobileNumber')
        .populate('items.product', 'name image price')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true });

      // Summary statistics
      const summaryAgg = await this.orderModel.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
          },
        },
      ]);
      const summary = summaryAgg[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };

      const statusBreakdownAgg = await this.orderModel.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
      const statusBreakdown = statusBreakdownAgg.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
        },
        summary: {
          totalOrders: summary.totalOrders,
          totalRevenue: summary.totalRevenue,
          averageOrderValue: summary.averageOrderValue,
          statusBreakdown,
        },
      };
    } catch (error) {
      console.error('Order List Error:', error);
      throw error;
    }
  }

  async findById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email mobileNumber')
      .populate('items.product', 'name image price')
      .lean({ virtuals: true });
    if (!order) {
      return null;
    }
    return {
      success: true,
      data: order,
    };
  }
} 