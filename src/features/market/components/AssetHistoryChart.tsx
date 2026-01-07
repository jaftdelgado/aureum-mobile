import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type AssetHistoryPoint = { date: string; value: number };
type Asset = {
  name?: string;
  symbol?: string;
  history?: AssetHistoryPoint[];
  currentPrice?: number;
  Name?: string;
  Symbol?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const roundUp = (n: number, step = 10) => Math.ceil(n / step) * step;

export function AssetHistoryChart({ asset }: { asset: Asset }) {
  const displayName = asset.name ?? asset.Name ?? "—";
  const displaySymbol = asset.symbol ?? asset.Symbol ?? "—";

  const safeHistory = useMemo(() => {
    const base =
      asset.history?.length
        ? asset.history
        : [{ date: "now", value: Number(asset.currentPrice ?? 0) }];

    const cleaned = base
      .map((p) => ({ date: p.date, value: Number(p.value) }))
      .filter((p) => Number.isFinite(p.value));

    if (!cleaned.length) return [{ date: "now", value: Number(asset.currentPrice ?? 0) }];
    if (cleaned.length === 1) return [cleaned[0], { ...cleaned[0], date: "now" }];

    return cleaned;
  }, [asset.history, asset.currentPrice]);

  const data = useMemo(
    () =>
      safeHistory.map((p, idx) => ({
        value: p.value,
        label: idx % 10 === 0 ? p.date : "",
      })),
    [safeHistory]
  );

  const lastValue = safeHistory[safeHistory.length - 1]?.value ?? 0;

  const maxValue = useMemo(() => {
    const max = Math.max(...safeHistory.map((p) => p.value), 1);
    return roundUp(max, 10);
  }, [safeHistory]);

  const stepValue = useMemo(() => maxValue / 9, [maxValue]); // 9 secciones => 10 labels

  // ✅ Labels del eje Y (bottom -> top). Dejamos el primero "" para ocultar el 0
  const yAxisLabelTexts = useMemo(() => {
    const labels: string[] = [];
    for (let i = 0; i <= 9; i++) {
      const v = i * stepValue;
      labels.push(i === 0 ? "" : String(Math.round(v)));
    }
    return labels;
  }, [stepValue]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ gap: 4, flex: 1, paddingRight: 12 }}>
          <Text style={styles.title} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {displaySymbol}
          </Text>
        </View>

        <Text style={styles.price}>{currencyFormatter.format(lastValue)}</Text>
      </View>

      <View style={styles.chartWrap}>
        <LineChart
          data={data}
          height={250}
          maxValue={maxValue}
          stepValue={stepValue}
          noOfSections={9}
          yAxisOffset={0}
          yAxisLabelTexts={yAxisLabelTexts} // ✅ aquí se oculta el "0"
          xAxisThickness={0}
          xAxisLabelTextStyle={{ height: 0, width: 0, opacity: 0 }}
          yAxisThickness={0}
          yAxisTextStyle={styles.yLabel}
          yAxisLabelWidth={70}
          hideRules={false}
          rulesType="solid"
          rulesThickness={1}
          rulesColor="rgba(148,163,184,0.15)"
          thickness={2}
          color="#111827"
          hideDataPoints
          pointerConfig={{
            pointerColor: "#111827",
            radius: 4,
            pointerLabelWidth: 120,
            pointerLabelHeight: 60,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any[]) => {
              const v = items?.[0]?.value ?? 0;
              return (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipSymbol}>{displaySymbol}</Text>
                  <Text style={styles.tooltipValue}>{currencyFormatter.format(v)}</Text>
                </View>
              );
            },
          }}
          initialSpacing={10}
          endSpacing={10}
          spacing={6}
          disableScroll
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 16,
  },
  header: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
  subtitle: { fontSize: 11, color: "#64748B" },
  price: { fontSize: 12, fontWeight: "600", color: "#0F172A" },

  chartWrap: {
    height: 260,
    width: "100%",
  },

  yLabel: { color: "#94A3B8", fontSize: 11 },
  tooltip: {
    backgroundColor: "rgba(15,23,42,0.96)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tooltipSymbol: { color: "#E5E7EB", fontSize: 11, marginBottom: 4 },
  tooltipValue: { color: "#F9FAFB", fontSize: 12, fontWeight: "600" },
});
