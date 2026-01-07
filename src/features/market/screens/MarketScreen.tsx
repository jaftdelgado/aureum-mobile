import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';

import { MarketHeaderActions } from '../components/MarketHeaderActions';
import { useTeamAssets } from '../hooks/useTeamAssets';
import { TeamAssetsList } from '../components/TeamAssetsList';
import { MarketStackParamList } from '../navigation/MarketNavigator';

import { useMarketStream } from '../hooks/useMarketStream';
import { useMarketTrading } from '../hooks/useMarketTrading';
import { useAuth } from '@app/providers/AuthProvider';

import {
  PriceDirection,
  normSymbol,
  getAssetPublicId,
  getAssetSymbol,
  getUserPublicId,
  validateSingleSelection,
  validateAuth,
  canTrade as canTradeSchema,
} from '../schemas/marketSchemas';

type MarketScreenNavigationProp = NativeStackNavigationProp<MarketStackParamList, 'Market'>;

export default function MarketScreen() {
  const { t } = useTranslation('market');
  const navigation = useNavigation<MarketScreenNavigationProp>();
  const route = useRoute<RouteProp<MarketStackParamList, 'Market'>>();
  const { teamId } = route.params;

  const { colors } = useTheme();
  const { user } = useAuth();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { assets: teamAssets, refetch, isRefetching } = useTeamAssets(teamId);
  const { snapshot, error: streamError } = useMarketStream(teamId);
  const { buy, sell, loading: tradeLoading } = useMarketTrading();

  const handleSettings = () => {
    navigation.navigate('MarketSettings', { teamId });
  };

  const handlePlay = () => { };

  const handlePressAsset = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? [] : [id]));
  }, []);

  const [isStreamReady, setIsStreamReady] = useState(false);
  useEffect(() => {
    if (snapshot?.assets?.length) setIsStreamReady(true);
  }, [snapshot?.assets?.length]);

  const prevPriceRef = useRef<Record<string, number>>({});
  const [priceDirectionMap, setPriceDirectionMap] = useState<Record<string, PriceDirection>>({});

  useEffect(() => {
    if (!snapshot?.assets?.length) return;

    const nextPrev = { ...prevPriceRef.current };
    const nextDir: Record<string, PriceDirection> = {};

    for (const a of snapshot.assets as any[]) {
      const symbol = normSymbol(a.symbol ?? a.Symbol);
      if (!symbol) continue;

      const prev = prevPriceRef.current[symbol];
      const current = Number(a.price ?? a.Price);

      let dir: PriceDirection = 'flat';
      if (typeof prev === 'number') {
        if (current > prev) dir = 'up';
        else if (current < prev) dir = 'down';
      }

      nextDir[symbol] = dir;
      nextPrev[symbol] = current;
    }

    prevPriceRef.current = nextPrev;
    setPriceDirectionMap(nextDir);
  }, [snapshot]);

  const mergedAssets = useMemo(() => {
    const liveBySymbol = new Map<string, number>(
      (snapshot?.assets ?? []).map((a: any) => [
        normSymbol(a.symbol ?? a.Symbol),
        Number(a.price ?? a.Price),
      ])
    );

    return (teamAssets ?? []).map((item: any) => {
      const symbol = normSymbol(getAssetSymbol(item));
      const livePrice = symbol ? liveBySymbol.get(symbol) : undefined;
      const direction: PriceDirection = symbol ? (priceDirectionMap[symbol] ?? 'flat') : 'flat';

      return {
        ...item,
        currentPrice: typeof livePrice === 'number' ? livePrice : item.currentPrice,
        priceDirection: direction,
      };
    });
  }, [teamAssets, snapshot, priceDirectionMap]);

  const selectedAsset = useMemo(() => {
    if (selectedIds.length !== 1) return null;
    const id = selectedIds[0];
    return (mergedAssets ?? []).find((a: any) => getAssetPublicId(a) === id) ?? null;
  }, [selectedIds, mergedAssets]);

  const requireSelection = useCallback(() => {
    const res = validateSingleSelection(selectedIds);
    if (!res.ok) {
      Alert.alert(
        t('selectOneAsset', 'Selecciona un activo'),
        t('selectOneAssetDesc', 'Debes seleccionar un activo para operar.')
      );
      return false;
    }
    return true;
  }, [selectedIds, t]);

  const ensureAuth = useCallback(() => {
    const userPublicId = getUserPublicId(user);
    const res = validateAuth(userPublicId);
    if (!res.ok) {
      Alert.alert(
        t('authRequired', 'Inicia sesión'),
        t('authRequiredDesc', 'Necesitas sesión activa para operar.')
      );
      return null;
    }
    return userPublicId;
  }, [user, t]);

  const handleSell = useCallback(async () => {
    if (!requireSelection()) return;
    if (!selectedAsset) return;

    const userPublicId = ensureAuth();
    if (!userPublicId) return;

    const quantity = 1;
    const price = selectedAsset.currentPrice ?? 0;

    try {
      await sell({
        teamPublicId: teamId,
        assetPublicId: getAssetPublicId(selectedAsset),
        userPublicId,
        quantity,
        price,
      });

      refetch?.();

      Alert.alert(
        t('sellSuccess', 'Venta realizada'),
        t('sellSuccessDesc', 'Tu venta fue registrada correctamente.')
      );
    } catch (e: any) {
      Alert.alert(t('sellError', 'Error al vender'), e?.message ?? 'Error');
    }
  }, [requireSelection, selectedAsset, ensureAuth, sell, teamId, refetch, t]);

  const handleBuy = useCallback(async () => {
    if (!requireSelection()) return;
    if (!selectedAsset) return;

    const userPublicId = ensureAuth();
    if (!userPublicId) return;

    const quantity = 1;
    const price = selectedAsset.currentPrice ?? 0;

    try {
      await buy({
        teamPublicId: teamId,
        assetPublicId: getAssetPublicId(selectedAsset),
        userPublicId,
        quantity,
        price,
      });

      refetch?.();

      Alert.alert(
        t('buySuccess', 'Compra realizada'),
        t('buySuccessDesc', 'Tu compra fue registrada correctamente.')
      );
    } catch (e: any) {
      Alert.alert(t('buyError', 'Error al comprar'), e?.message ?? 'Error');
    }
  }, [requireSelection, selectedAsset, ensureAuth, buy, teamId, refetch, t]);

  const canTrade = canTradeSchema(selectedIds, selectedAsset);

  return (
    <CollapsibleHeaderLayout
      title={t('title')}
      onBack={() => navigation.goBack()}
      rightAction={
        <MarketHeaderActions onSettingsPress={handleSettings} onPlayPress={handlePlay} />
      }>
      {!isStreamReady ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            paddingVertical: 24,
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-3 text-secondaryText">
            {t('loadingMarket', 'Cargando mercado...')}
          </Text>
        </View>
      ) : (
        <View className="gap-6">
          <Text className="text-center text-secondaryText">{t('welcomeMessage')}</Text>

          {streamError ? (
            <View className="px-4">
              <Text className="text-center text-red-500">
                {t('streamError', 'Error de conexión al mercado')}: {streamError.message}
              </Text>
            </View>
          ) : null}

          <View className="flex-row gap-3 p-4">
            <View className="flex-1">
              <Button
                title={t('sell')}
                variant="secondary"
                onPress={handleSell}
                size="md"
                disabled={!canTrade || tradeLoading}
              />
            </View>
            <View className="flex-1">
              <Button
                title={t('buy')}
                variant="primary"
                onPress={handleBuy}
                size="md"
                disabled={!canTrade || tradeLoading}
              />
            </View>
          </View>

          <View>
            <Text className="mb-2 px-4 text-lg font-bold text-primaryText">
              {t('marketAssets')}
            </Text>

            <TeamAssetsList
              data={mergedAssets ?? []}
              selectedAssetIds={selectedIds}
              onPressAsset={handlePressAsset}
            />
          </View>
        </View>
      )}
    </CollapsibleHeaderLayout>
  );
}
