import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    try {
      const product = this.productsRepository.create({
        name,
        price,
        quantity,
      });

      return product;
    } catch (err) {
      throw new AppError('Não foi possivel criar o produto');
    }
  }
}

export default CreateProductService;
