import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import SegmentedControl from '@core/components/SegmentedControl';

export default function TransactionsScreen() {
  const { t } = useTranslation('movements');
  const navigation = useNavigation();

  const filterOptions = [
    t('filters.all', 'Ver todas'),
    t('filters.buys', 'Compras'),
    t('filters.sells', 'Ventas'),
  ];

  const [activeFilter, setActiveFilter] = useState(filterOptions[0]);

  const handleFilterChange = (option: string) => {
    setActiveFilter(option);
    console.log('Filtro seleccionado:', option);
  };

  return (
    <CollapsibleHeaderLayout title={t('title', 'Transacciones')} onBack={() => navigation.goBack()}>
      <View className="pb-4">
        <SegmentedControl options={filterOptions} onChange={handleFilterChange} />
      </View>

      <View className="flex-1 items-center px-4 pt-10"></View>
    </CollapsibleHeaderLayout>
  );
}
