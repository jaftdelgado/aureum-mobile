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
    try {
      const response = await httpClient.get<LessonDTO[]>("/api/lessons");
      
      return response.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        
       
        thumbnailUrl: item.thumbnail 
          ? `data:image/png;base64,${item.thumbnail}` 
          : null,

     
        videoUrl: `${ENV.API_GATEWAY_URL}/api/lessons/${item.id}/video`
      }));

    } catch (error) {
      console.error("LessonsApiRepository - Error fetching lessons:", error);
      throw error; 
    }
  }
}