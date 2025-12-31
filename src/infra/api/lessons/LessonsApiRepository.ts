import { httpClient } from "@infra/api/http/client"; 
import { ENV } from "@app/config/env";
import type { Lesson } from "@domain/entities/Lesson";

interface LessonDTO {
  id: string;
  titulo: string;      
  descripcion: string; 
  miniatura: string | null; 
}

export class LessonsApiRepository {
  async getAll(): Promise<Lesson[]> {
    const response = await httpClient.get<LessonDTO[]>("/api/lessons");
    
    return response.map((item) => ({
      id: item.id,
      title: item.titulo,       
      description: item.descripcion, 
      thumbnailUrl: item.miniatura 
        ? `data:image/jpeg;base64,${item.miniatura}` 
        : null
    }));
  }

  getVideoUrl(lessonId: string): string {
    return `${ENV.API_GATEWAY_URL}/api/lessons/${lessonId}/video`;
  }
}