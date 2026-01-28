import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req) {
    return this.orderService.createOrderFromCart(req.user.id);
  }

  @Get()
  getMyOrders(@Req() req) {
    return this.orderService.getOrdersByUser(req.user.id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }




}

