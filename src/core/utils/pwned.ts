import * as Crypto from 'expo-crypto';

export const checkPasswordLeaked = async (password: string): Promise<boolean> => {
  try {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      password
    );
    
    const hash = digest.toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) return false;

    const text = await response.text();
    
    const leaked = text.split('\n').some(line => {
      const [hashSuffix] = line.split(':');
      return hashSuffix === suffix;
    });

    return leaked;
  } catch (error) {
    console.warn("Error verificando password:", error);
    return false; 
  }
};