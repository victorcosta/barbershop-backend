import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    if (context.getType() === 'rpc') {
      return this.validateRpcRequest(context);
    } else {
      return this.validateHttpRequest(context);
    }
  }

  private validateRpcRequest(context: ExecutionContext): boolean {
    const data = context.switchToRpc().getData();
    const token = this.extractTokenFromData(data);

    if (!token) {
      throw new RpcException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      data.user = payload;
    } catch (e) {
      throw new RpcException('Invalid token');
    }

    return true;
  }

  private validateHttpRequest(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private extractTokenFromData(data: any): string | null {
    const token = data?.authorization?.split(' ')[1];
    return token;
  }
}
