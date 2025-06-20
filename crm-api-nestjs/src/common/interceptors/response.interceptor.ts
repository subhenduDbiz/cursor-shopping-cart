import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: any;
  summary?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // If data already has the expected format, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Extract pagination and summary if they exist
        let pagination = undefined;
        let summary = undefined;
        let responseData = data;

        if (data && typeof data === 'object') {
          if ('data' in data && 'pagination' in data) {
            responseData = data.data;
            pagination = data.pagination;
          }
          if ('summary' in data) {
            summary = data.summary;
          }
        }

        const response: Response<T> = {
          success: true,
          message: 'Operation completed successfully',
          data: responseData,
        };

        if (pagination) {
          response.pagination = pagination;
        }

        if (summary) {
          response.summary = summary;
        }

        return response;
      }),
    );
  }
} 