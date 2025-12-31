import { Lesson } from "@domain/entities/Lesson";
import { LessonsApiRepository } from "@infra/api/lessons/LessonsApiRepository";

export class GetLessonsUseCase {
  constructor(private readonly lessonsRepository: LessonsApiRepository) {}

  async execute(): Promise<Lesson[]> {
    return await this.lessonsRepository.getAll();
  }
}