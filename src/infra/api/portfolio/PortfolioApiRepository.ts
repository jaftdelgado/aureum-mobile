import { PortfolioRepository } from '@domain/repositories/PortfolioRepository';
import { PortfolioItem } from '@domain/entities/PortfolioItem';
import { HistoryItem } from '@domain/entities/HistoryItem';
import { httpClient } from '../http/client';
import { PortfolioItemDto, HistoryItemDto } from './portfolio.dto';

export class PortfolioApiRepository implements PortfolioRepository {
  async getByCourse(courseId: string, userId: string): Promise<PortfolioItem[]> {
    return await httpClient.get<PortfolioItem[]>(
      `api/Portfolio/course/${courseId}`, 
      { userId }
    );
  }

  async getHistory(courseId: string, studentId: string): Promise<HistoryItem[]> {
    return await httpClient.get<HistoryItem[]>(
      `api/Portfolio/history/course/${courseId}/student/${studentId}`
    );
  }
}