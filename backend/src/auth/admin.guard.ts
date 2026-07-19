import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

type AuthenticatedRequest = { user?: { role?: string } };

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user?.role === 'admin';
  }
}
