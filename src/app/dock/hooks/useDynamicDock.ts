import { useTabBarContext } from '@app/providers/TabBarProvider';

export const useDynamicDock = () => {
  const { state, setState, setDefault } = useTabBarContext();

  return {
    state,

    hide: () => setDefault(),

    showCard: (component: React.FC) =>
      setState({
        mode: 'card',
        buttonsMode: 'tabbar',
        config: { component },
      }),

    showForm: (options: {
      component: React.FC;
      submitLabel?: string;
      onSubmit?: () => void;
      onCancel?: () => void;
      cancelIcon?: React.FC<{ width?: number; height?: number; color?: string }>;
    }) =>
      setState({
        mode: 'form',
        buttonsMode: 'form',
        config: {
          ...options,
        },
      }),

    showSingle: (options: {
      onSubmit?: () => void;
      singleIcon?: React.FC<{ width?: number; height?: number; color?: string }>;
    }) =>
      setState({
        mode: 'card',
        buttonsMode: 'single',
        config: {
          ...options,
        },
      }),
  };
};
