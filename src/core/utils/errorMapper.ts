import { HttpError } from '../../infra/api/http/client'; 

export const getUserFriendlyErrorMessage = (error: any, t: (key: string) => string): string => {
  if (error instanceof HttpError) {
    if (error.status === 408 || error.status === 504) {
      return t('common.errors.timeout'); 
    }
    if (error.status >= 500) {
      return t('common.errors.server'); 
    }
    if (error.status === 404) {
      return t('common.errors.notFound');
    }
    if (error.message.includes('El nombre de usuario ya está en uso') || error.message.includes('username_key')) {
    return t('signup.errors.usernameReserved');
  }
    return error.message; 
  }

  const message = error?.message || '';
  
  if (message.includes('Invalid login') || message.includes('Invalid login credentials')) {
    return t('signin.errors.invalidCredentials');
  }
  if (message.includes('Network request failed')) {
    return t('common.noInternet');
  }
  if (message.includes('User already registered') || message.includes('unique_email')) {
    return t('signup.errors.emailAlreadyRegistered');
  }
  if (message.includes('unique_username') || message.includes('username_key')) {
    return t('signup.errors.usernameReserved');
  }if (message === 'TEAM_NOT_FOUND') {
    return t('join.error_not_found'); 
  }
  if (message === 'TEAM_ALREADY_MEMBER') {
    return t('join.error_already_member'); 
  }

  return t('common.genericLoginError');
};