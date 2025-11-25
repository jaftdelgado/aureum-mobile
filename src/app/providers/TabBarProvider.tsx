import React, { createContext, useContext, useState } from 'react';

//
// ────────────────────────────────────────────────────────────────
//   Tipos
// ────────────────────────────────────────────────────────────────
//

export type TabBarButtonsMode = 'tabbar' | 'form' | 'single';
export type TabBarHeightMode = 'standard' | 'card' | 'form';

export type TabBarConfig = {
  // Form mode
  cancelIcon?: React.FC<{ width?: number; height?: number; color?: string }>;
  submitLabel?: string;

  // Single button mode
  singleIcon?: React.FC<{ width?: number; height?: number; color?: string }>;

  // Actions
  onSubmit?: () => void;
  onCancel?: () => void;

  // Floating content
  component?: React.FC;
};

export type TabBarState = {
  mode: TabBarHeightMode;
  buttonsMode: TabBarButtonsMode;
  config?: TabBarConfig;
};

//
// ────────────────────────────────────────────────────────────────
//   Contexto
// ────────────────────────────────────────────────────────────────
//

type TabBarContextValue = {
  state: TabBarState;
  setState: React.Dispatch<React.SetStateAction<TabBarState>>;

  // helpers
  setDefault: () => void;
  setFormMode: (config: TabBarConfig) => void;
  setSingleMode: (config: TabBarConfig) => void;
  setCardMode: (config: TabBarConfig) => void;
};

const TabBarContext = createContext<TabBarContextValue | null>(null);

//
// ────────────────────────────────────────────────────────────────
//   Estado Inicial
// ────────────────────────────────────────────────────────────────
//

const initialState: TabBarState = {
  mode: 'standard',
  buttonsMode: 'tabbar',
  config: undefined,
};

//
// ────────────────────────────────────────────────────────────────
//   Provider
// ────────────────────────────────────────────────────────────────
//

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TabBarState>(initialState);

  //
  // Reset al modo estándar
  //
  const setDefault = () => {
    setState(initialState);
  };

  //
  // Modo Card → usa un componente flotante + botones de tabBar
  //
  const setCardMode = (config: TabBarConfig) => {
    setState({
      mode: 'card',
      buttonsMode: 'tabbar',
      config,
    });
  };

  //
  // Modo Form → componente flotante + dos botones (cancel/submit)
  //
  const setFormMode = (config: TabBarConfig) => {
    setState({
      mode: 'form',
      buttonsMode: 'form',
      config,
    });
  };

  //
  // Single Button mode → modo card + botón único
  //
  const setSingleMode = (config: TabBarConfig) => {
    setState({
      mode: 'card',
      buttonsMode: 'single',
      config,
    });
  };

  return (
    <TabBarContext.Provider
      value={{
        state,
        setState,
        setDefault,
        setFormMode,
        setSingleMode,
        setCardMode,
      }}>
      {children}
    </TabBarContext.Provider>
  );
};

//
// ────────────────────────────────────────────────────────────────
//   Hook público
// ────────────────────────────────────────────────────────────────
//

export const useTabBarContext = () => {
  const ctx = useContext(TabBarContext);
  if (!ctx) throw new Error('useTabBarContext must be used inside TabBarProvider');
  return ctx;
};
