import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/routes-types';

export const useAppNavigation = () => {
  return useNavigation<NavigationProp<RootStackParamList>>();
};