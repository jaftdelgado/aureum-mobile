import { httpClient } from "@infra/api/http/client"; 
import { ENV } from "@app/config/env";
import type { Lesson } from "@domain/entities/Lesson";

interface LessonDTO {
  id: string;
  title: string;       
  description: string; 
  thumbnail: string | null; 
}

export class LessonsApiRepository {
  async getAll(): Promise<Lesson[]> {
    const response = await httpClient.get<LessonDTO[]>("/api/lessons");
    
    return response.map((item) => ({
      id: item.id,
      title: item.title,       
      description: item.description, 
      thumbnailUrl: item.thumbnail 
        ? `data:image/jpeg;base64,${item.thumbnail}` 
        : null
    }));
  }

  getVideoUrl(lessonId: string, token?: string | null): string {
    const baseUrl = `${ENV.API_GATEWAY_URL}/api/lessons/${lessonId}/video`;
    return token ? `${baseUrl}?token=${token}` : baseUrl;
  }
}