import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!(await transactionsRepository.findOne(id)))
      throw new AppError("Transaction doesn't exists");

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
