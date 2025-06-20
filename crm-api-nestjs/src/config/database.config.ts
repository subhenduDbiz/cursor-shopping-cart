import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop',
};

// Export just the URI as a string for use in MongooseModule.forRoot()
export const databaseUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/dress-shop'; 