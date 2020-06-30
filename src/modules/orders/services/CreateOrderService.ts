import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }
    const findedProducts = await this.productsRepository.findAllById(
      products.map(product => ({ id: product.id })),
    );

    const productsOrder = products.map(product => {
      const findedProduct = findedProducts.find(x => x.id === product.id);

      if (!findedProduct) {
        throw new AppError('Product not found');
      }

      if (findedProduct.quantity < product.quantity) {
        throw new AppError('Product out of stock');
      }

      return {
        product_id: product.id,
        price: findedProduct.price,
        quantity: product.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsOrder,
    });

    return order;
  }
}

export default CreateOrderService;
