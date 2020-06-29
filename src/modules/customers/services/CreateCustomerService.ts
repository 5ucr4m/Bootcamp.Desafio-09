import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const findedCustomer = await this.customersRepository.findByEmail(email);

    if (findedCustomer) {
      throw new AppError('Email já está em uso');
    }

    try {
      const customer = this.customersRepository.create({
        name,
        email,
      });
      return customer;
    } catch (err) {
      throw new AppError('Não foi possivel criar o customer');
    }
  }
}

export default CreateCustomerService;
