import { httpClient } from "@infra/api/http/client";
import { ENV } from "@app/config/env";
import type { Lesson } from "@domain/entities/Lesson";

// DTO: Representa exactamente la estructura JSON que devuelve tu API Gateway
interface LessonDTO {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null; // El backend envía el string Base64 crudo
}

export class LessonsApiRepository {
  /**
   * Obtiene la lista de lecciones desde el API Gateway.
   * Transforma el DTO del backend a la Entidad del dominio.
   */
  async getAll(): Promise<Lesson[]> {
    try {
      // Petición al endpoint del Gateway definido en Ocelot o Controller
      const response = await httpClient.get<LessonDTO[]>("/api/lessons");
      
      return response.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        
        // Transformación 1: Imagen
        // El Gateway envía Base64 puro. React Native necesita el prefijo data URI.
        thumbnailUrl: item.thumbnail 
          ? `data:image/png;base64,${item.thumbnail}` 
          : null,

        // Transformación 2: URL del Video
        // Construimos la ruta absoluta al endpoint de streaming del Gateway.
        // Nota: No incluimos el token aquí, se inyecta en el componente <Video /> via headers.
        videoUrl: `${ENV.API_GATEWAY_URL}/api/lessons/${item.id}/video`
      }));

    } catch (error) {
      console.error("LessonsApiRepository - Error fetching lessons:", error);
      throw error; 
    }
  }
}