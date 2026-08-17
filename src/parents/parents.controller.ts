import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Parents')
@ApiBearerAuth()
@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateParentDto) {
    return this.parentsService.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'teacher')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateParentDto,
  ) {
    return this.parentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parentsService.remove(id);
  }
}