import { PortfolioRepository } from '@domain/repositories/PortfolioRepository';

export class GetPortfolioUseCase {
  constructor(private repository: PortfolioRepository) {}

  async execute(courseId: string, userId: string) {
    return await this.repository.getByCourse(courseId, userId);
  }
}