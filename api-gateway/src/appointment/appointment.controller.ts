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
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { User } from '../auth/user.interface';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Controller('appointments')
export class AppointmentController {
  constructor(
    @Inject('APPOINTMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'get_appointments' },
          { user, authorization: req.headers.authorization },
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
          { cmd: 'get_appointment' },
          { id, user, authorization: req.headers.authorization },
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
  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'post_appointment' },
          {
            createAppointmentDto,
            user,
            authorization: req.headers.authorization,
          },
        ),
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
    @Body() updateAppointmentDto: AppointmentDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const user = req.user;
      const result = await firstValueFrom(
        this.client.send(
          { cmd: 'put_appointment' },
          {
            id,
            updateAppointmentDto,
            user,
            authorization: req.headers.authorization,
          },
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
          { cmd: 'delete_appointment' },
          { id, user, authorization: req.headers.authorization },
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
