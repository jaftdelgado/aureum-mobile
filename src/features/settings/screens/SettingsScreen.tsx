import React, { useRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';  
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { Text } from '@core/ui/Text'; 
import { Avatar } from '@core/ui/Avatar';
import { useSettings } from '../hooks/usesettings'; 
import { AppStackParamList } from '@app/navigation/routes-types';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { t } = useTranslation('settings');
  const { loading, handleLogout, handleDeleteAccount, handleChangeLanguage, user, avatarUrl, initials } = useSettings();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View className="flex-1 bg-bg">
      <FixedHeader title={t('title')} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false, 
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 24,
          flexGrow: 1,
        }}
      >
        <View>
          <DisplayTitle title={t('title')} scrollY={scrollY} />

          {user && (
            <View className="mb-3">
              <Text type="title3" weight="semibold" className="mb-3">
                {t('sections.account')}
              </Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Profile')}
                className="bg-white p-4 rounded-xl flex-row items-center shadow-sm"
              >
                <Avatar 
                  size="md" 
                  source={avatarUrl}
                  placeholderText={initials} 
                  className="mr-4"
                /> 
                <View className="flex-1">
                  <Text type="body" weight="bold">{user.fullName}</Text>
                  <Text type="caption1" color="secondary">{t('viewProfile')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View className="mt-auto"> 
            <ListContainer>

              <ListOption 
                text={t('changeLanguage')} 
                onPress={handleChangeLanguage}
                icon={<Ionicons name="language-outline" size={20} color="#6B7280" />}
              />

              <ListOption 
                text={t('logout')} 
                onPress={handleLogout}
                icon={<Ionicons name="log-out-outline" size={20} color="#6B7280" />}
              />

              <ListOption 
                text={
                  <Text color="error" weight="medium">
                    {loading ? t('deleting') : t('deleteAccount')}
                  </Text>
                }
                onPress={handleDeleteAccount}
                icon={<Ionicons name="trash-outline" size={20} color="#EF4444" />}
                isLast 
              />

            </ListContainer>
        </View>

      </Animated.ScrollView>
    </View>
  );
}