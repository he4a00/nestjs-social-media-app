import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGurad extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const bearerToken = context.switchToHttp().getRequest<Request>()
      .headers.authorization;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token expired, please login again...');
    }

    return super.canActivate(context);
  }
}
