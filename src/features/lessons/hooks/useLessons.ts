import { useState, useEffect, useCallback } from "react";
import { Lesson } from "@domain/entities/Lesson";
import { getLessonsUseCase } from "@app/di"; 

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 1. Estado para errores

  // 2. Envolvemos la lógica en useCallback para poder exportarla como 'refetch'
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
    error,      // Útil si quieres mostrar una alerta visual
    refetch: loadLessons // 3. Crítico para el botón "Reintentar"
  };
};