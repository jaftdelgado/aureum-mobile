import { useState, useEffect } from 'react';
import { httpClient } from '../../../infra/api/http/client';
import { blobToBase64 } from '@core/utils/fileUtils';

export const useTeamImage = (teamId: string, imageId?: string | null) => {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchImage = async () => {
      if (!imageId || !teamId) return;
      
      setLoading(true);
      try {
        const blob = await httpClient.getBlob(`/api/courses/${teamId}/image`);
        const base64 = await blobToBase64(blob);
        
        if (isActive) setImageSource(base64);
      } catch (error) {
        console.warn(`Error loading image for team ${teamId}`, error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchImage();

    return () => { isActive = false; };
  }, [teamId, imageId]);

  return { imageSource, loading };
};