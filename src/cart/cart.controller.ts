import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, Delete,
} from "@nestjs/common";
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(
    @Req() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.addToCart(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.userId);
  }

@Patch('item')
updateItem(
  @Req() req,
@Body() body: { productId: number; quantity: number },
) {
  return this.cartService.updateItemQuantity(
    req.user.id,
    body.productId,
    body.quantity,
  );
}

  @Delete('item/:productId')
  removeItem(
    @Req() req,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(
      req.user.id,
      Number(productId),
    );
  }

}
