import { type TFunction } from "i18next";
import { type SelectionOption } from "@core/components/SelectionSheet";
import { type MarketConfig } from "@domain/entities/MarketConfig";

export const getCurrencyOptions = (t: TFunction): SelectionOption<string>[] => [
    { value: "USD", label: t("market:simulator.settings.options.usd", "USD - Dólar Estadounidense") },
    { value: "EUR", label: t("market:simulator.settings.options.eur", "EUR - Euro") },
    { value: "MXN", label: t("market:simulator.settings.options.mxn", "MXN - Peso Mexicano") },
];

export const getSimpleOptions = (t: TFunction): SelectionOption<string>[] => [
    { value: "Low", label: t("market:simulator.settings.options.low", "Baja") },
    { value: "Medium", label: t("market:simulator.settings.options.medium", "Media") },
    { value: "High", label: t("market:simulator.settings.options.high", "Alta") },
    { value: "Disabled", label: t("market:simulator.settings.options.disabled", "Deshabilitado") },
];

export const getThickSpeedOptions = (t: TFunction): SelectionOption<string>[] => [
    { value: "Low", label: t("market:simulator.settings.options.low", "Lenta (1s)") },
    { value: "Medium", label: t("market:simulator.settings.options.medium", "Normal") },
    { value: "High", label: t("market:simulator.settings.options.high", "Rápida") },
];

export const defaultMarketConfig: MarketConfig = {
    publicId: "",
    teamId: "",
    createdAt: new Date(),
    updatedAt: new Date(),

    initialCash: 100_000,
    currency: "USD",

    marketVolatility: "Medium",
    marketLiquidity: "Medium",
    thickSpeed: "Medium",

    transactionFee: "Low",
    allowShortSelling: false,

    eventFrequency: "Medium",
    dividendImpact: "Medium",
    crashImpact: "Medium",
};