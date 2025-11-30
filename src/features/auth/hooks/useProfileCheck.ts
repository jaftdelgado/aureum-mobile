import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { getProfileByAuthId } from '../api/authApi';

export const useProfileCheck = (user: User | null, loadingAuth: boolean) => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const checkedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!user?.id) {
        setHasProfile(null);
        checkedUserIdRef.current = null;
        return;
      }

      if (user.id === checkedUserIdRef.current && hasProfile !== null) return;

      checkedUserIdRef.current = user.id;
      setCheckingProfile(true);
      
      const verify = async (retries = 1) => { 
        try {
          await getProfileByAuthId(user.id);
          console.log("Perfil encontrado.");
          setHasProfile(true);
        } catch (e) {
          if (retries > 0) {
            console.log("Perfil no encontrado, reintentando en 1s...");
            setTimeout(() => verify(retries - 1), 1000); 
          } else {
            console.warn("Perfil no encontrado tras reintentos. Usuario nuevo.");
            setHasProfile(false);
          } 
        }finally {
          setCheckingProfile(false);
        }
      };

      verify();
    };

    if (!loadingAuth) check();
  }, [user, loadingAuth, hasProfile]);

  return {
    hasProfile,
    checkingProfile,
    setHasProfile 
  };
};