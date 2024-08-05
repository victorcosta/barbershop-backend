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
import { CreateBarberDto } from './dto/create-barber.dto';
import { BarberDto } from './dto/barber.dto';
import { User } from '../auth/user.interface';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Controller('barbers')
export class BarberController {
  constructor(
    @Inject('AVAILABILITY_SERVICE') private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send({ cmd: 'get_barbers' }, { user }),
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
        this.client.send({ cmd: 'get_barber' }, { id, user }),
      );
      return res.status(result.status || 200).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createBarberDto: CreateBarberDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send({ cmd: 'post_barber' }, { createBarberDto, user }),
      );
      return res.status(result.status || 201).json(result.data);
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
    @Body() updateBarberDto: BarberDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send({ cmd: 'put_barber' }, { id, updateBarberDto, user }),
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
        this.client.send({ cmd: 'delete_barber' }, { id, user }),
      );
      return res.status(result.status || 204).json(result.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }
}
