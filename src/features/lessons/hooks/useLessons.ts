import { useState, useEffect, useCallback } from "react";
import { Lesson } from "@domain/entities/Lesson";
import { getLessonsUseCase } from "@app/di"; 

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  const loadLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getLessonsUseCase.execute();
      setLessons(data);
    } catch (err: any) {
      console.error("Error cargando lecciones:", err);
      setError(err.message || "Error al cargar el contenido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  return { 
    lessons, 
    isLoading, 
    error,      
    refetch: loadLessons 
  };
};