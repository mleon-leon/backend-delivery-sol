import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from '../services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
