import { getRepository, Repository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    try {
      const order = this.ormRepository.create({
        customer,
        order_products: products,
      });

      await this.ormRepository.save(order);
      return order;
    } catch (err) {
      throw new AppError('Error');
    }
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    if (!order) {
      throw new AppError('Order não encontrada');
    }

    return order;
  }
}

export default OrdersRepository;
