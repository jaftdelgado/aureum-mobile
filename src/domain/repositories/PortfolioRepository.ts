import { PortfolioItem } from '../entities/PortfolioItem';
import { HistoryItem } from '../entities/HistoryItem';

export interface PortfolioRepository {
  getByCourse(courseId: string, userId: string): Promise<PortfolioItem[]>;
  getHistory(courseId: string, studentId: string): Promise<HistoryItem[]>;
}