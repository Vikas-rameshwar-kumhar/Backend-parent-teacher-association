
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RemarksService } from './remarks.service';
import { CreateRemarkDto } from './dto/create-remark.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Remarks')
@ApiBearerAuth()
@Controller('remarks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemarksController {
  constructor(private readonly remarksService: RemarksService) {}

  @Post()
  @Roles('admin', 'teacher')
  create(@Body() createRemarkDto: CreateRemarkDto, @Req() req) {
    return this.remarksService.create(createRemarkDto, req.user);
  }

  @Get('student/:id')
  @Roles('admin', 'teacher', 'parent')
  findByStudent(@Param('id', ParseIntPipe) studentId: number, @Req() req) {
    return this.remarksService.findByStudent(studentId, req.user);
  }

  @Delete(':id')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.remarksService.remove(id, req.user);
  }
}