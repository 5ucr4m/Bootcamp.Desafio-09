import { getRepository, Repository, In } from 'typeorm';
import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const productFinded = await this.ormRepository.findOne({
      name,
    });

    if (productFinded) {
      throw new AppError('Já existe um produto com esse nome');
    }

    const product = await this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      name,
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);
    const findedProducts = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    return findedProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const allProducts = await this.findAllById(products);
    const newProducts = allProducts.map(product => {
      const findedProduct = products.find(prod => prod.id === product.id);

      if (!findedProduct) {
        throw new AppError('Someting are wrong');
      }

      if (product.quantity < findedProduct.quantity) {
        throw new AppError('Someting are wrong');
      }

      const newProduct = product;
      const { quantity } = newProduct;
      newProduct.quantity = quantity - findedProduct.quantity;

      return newProduct;
    });

    await this.ormRepository.save(newProducts);
    return newProducts;
  }
}

export default ProductsRepository;
