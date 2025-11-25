export type TabBarMode = 'default' | 'form' | 'card';

export interface TabBarConfig {
  component?: React.FC; // componente dinámico a renderizar
  submitLabel?: string; // opcional para formularios
  onSubmit?: () => void;
  onCancel?: () => void;
}

export interface TabBarState {
  mode: TabBarMode;
  config?: TabBarConfig;
}
