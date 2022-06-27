import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo
} from 'react';
import { createAmplitudeProvider } from './providers/amplitude';
import { Attributes } from './types';

interface AnalyticsContext {
  pushEvent: (name: string, attributes?: Attributes) => void;
  view: (name: string, properties?: Attributes) => void;
}

const analyticsContext = createContext<AnalyticsContext>(null!);

interface AnalyticsProviderProps {
  amplitudeApiKey: string;
  user: {
    id: string;
    attributes?: Attributes;
  };
  children: ReactElement;
}

export const AnalyticsProvider: FC<AnalyticsProviderProps> = ({
  amplitudeApiKey,
  user,
  children
}) => {
  const value = useMemo(() => {
    const amplitudeProvider = createAmplitudeProvider({
      apiKey: amplitudeApiKey,
      user
    });

    return {
      pushEvent: (name: string, attributes?: Attributes) => {
        amplitudeProvider.pushEvent(name, attributes);
      },
      view: (name: string, attributes?: Attributes) => {
        amplitudeProvider.view(name, attributes);
      }
    };
  }, [amplitudeApiKey, user]);

  return (
    <analyticsContext.Provider value={value}>
      {children}
    </analyticsContext.Provider>
  );
};

export const useAnalyticsPushEvent = () => {
  const context = useContext(analyticsContext);
  return context.pushEvent;
};

interface AnalyticsViewProps {
  name: string;
  attributes?: Attributes;
  children: ReactElement;
}

export const AnalyticsView: FC<AnalyticsViewProps> = ({
  name,
  attributes,
  children
}) => {
  const context = useContext(analyticsContext);

  useEffect(() => {
    context.view(name, attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};
