import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Producto no existe');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const fullCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!fullCart) {
      throw new Error('Cart not found');
    }

    const total = fullCart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    return {
      ...fullCart,
      total,
    };
  }


  async updateItemQuantity(
    userId: number,
    productId: number,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: item.id },
    });

    return {
      message: 'Item removed from cart',
    };
  }

}
