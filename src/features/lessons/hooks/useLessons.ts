import { useState, useEffect } from "react";
import { Lesson } from "@domain/entities/Lesson";
import { getLessonsUseCase } from "@app/di"; 

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true);
        const data = await getLessonsUseCase.execute();
        setLessons(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLessons();
  }, []);

  return { lessons, isLoading };
};