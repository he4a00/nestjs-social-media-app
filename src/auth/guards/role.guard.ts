import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (!role) return true;
    const request = context.switchToHttp().getRequest<Request>();
    if (!request || !request.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (role === '') {
      if (!request.user || request['user']['role'].length === 0) return true;
      throw new UnauthorizedException('User does not have the required roles');
    }

    if (role === request['user']['role']) {
      return true;
    } else {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
  }
}
