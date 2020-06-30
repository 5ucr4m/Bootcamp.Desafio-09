import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';
import AppError from '@shared/errors/AppError';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  private ormRepositoryPivot: Repository<OrdersProducts>;

  constructor() {
    this.ormRepository = getRepository(Order);
    this.ormRepositoryPivot = getRepository(OrdersProducts);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);

    delete order.customer.created_at;
    delete order.customer.updated_at;
    delete order.customer_id;

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id, {
      relations: ['customer', 'order_products'],
    });

    if (!order) {
      throw new AppError('Order não encontrada');
    }

    return order;
  }
}

export default OrdersRepository;
