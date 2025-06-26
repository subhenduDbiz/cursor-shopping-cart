import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';

const mockCustomer = {
  _id: '507f1f77bcf86cd799439011',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  isActive: true,
  toObject: () => mockCustomer,
};

const mockMongooseQuery = {
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([mockCustomer]),
};

describe('CustomersService', () => {
  let service: CustomersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockReturnValue(mockMongooseQuery),
            findById: jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockCustomer) }),
            countDocuments: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const result = await service.findAll({});
      expect(model.find).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockCustomer]);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return a customer by id', async () => {
      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(result).not.toBeNull();
      expect(result!.success).toBe(true);
      expect(result!.data).toEqual(mockCustomer);
    });

    it('should return null if customer not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({ select: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) } as any);
      const result = await service.findById('notfound');
      expect(result).toBeNull();
    });
  });
}); 