import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { LoginDto } from '../auth/dto/login.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from '../auth/user.interface';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'post_users_login' }, loginDto),
      );
      return res.status(result.status || 200).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'post_users_register' }, createUserDto),
      );
      return res.status(result.status || 201).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'get_users' },
          { tenantId: user.tenantId, role: user.role },
        ),
      );
      return res.status(result.status || 200).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'get_user' },
          { tenantId: user.tenantId, id, role: user.role },
        ),
      );
      return res.status(result.status || 200).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'put_user' },
          { tenantId: user.tenantId, id, user: updateUserDto, role: user.role },
        ),
      );
      return res.status(result.status || 200).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'delete_user' },
          { tenantId: user.tenantId, id, role: user.role },
        ),
      );
      return res.status(result.status || 204).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }
}
