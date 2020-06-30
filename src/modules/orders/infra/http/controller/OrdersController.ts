import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IRequestDTO {
  customer_id: string;
  products: Product[];
}

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const findOrderService = container.resolve(FindOrderService);

    const { customer_id }: IRequestDTO = request.body;

    const order = await findOrderService.execute({ id: customer_id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createOrderService = container.resolve(CreateOrderService);

    const { customer_id, products }: IRequestDTO = request.body;

    const order = await createOrderService.execute({ customer_id, products });

    return response.json(order);
  }
}
