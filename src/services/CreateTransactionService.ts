import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (
      type === 'outcome' &&
      (await transactionsRepository.getBalance()).total < value
    )
      throw new AppError('Cannot withdraw this quantity of money');

    const foundCategory =
      (await categoriesRepository.findOne({
        where: { title: category },
      })) ||
      (await categoriesRepository.save(
        categoriesRepository.create({ title: category }),
      ));

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: foundCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
