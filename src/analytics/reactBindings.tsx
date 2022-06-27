import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo
} from 'react';
import BrowserInteractionTime from 'browser-interaction-time';
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

/**
 * Returns a function to push an analytic event
 */
export const useAnalyticsPushEvent = () => {
  const context = useContext(analyticsContext);
  return context.pushEvent;
};

interface AnalyticsViewProps {
  name: string;
  attributes?: Attributes;
  children: ReactElement;
}

/**
 * Wrap a screen or section to track its usage
 */
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

  useInteractionTime((milliseconds) => {
    context.pushEvent('View - End', {
      ...attributes,
      name,
      activeTimeInSeconds: Math.floor(milliseconds / 1000)
    });
  });

  return children;
};

/**
 * Track active time spent while this hook
 * is rendered in a React component
 *
 * i.e Active window with regular user interactions
 * @param callback Called on cleanup with active time spent in milliseconds
 */
export const useInteractionTime = (
  callback: (millisecondsElapsed: number) => void
) => {
  useEffect(() => {
    const browserInteractionTime = new BrowserInteractionTime({
      idleTimeoutMs: 3000
    });

    browserInteractionTime.startTimer();

    return () => {
      browserInteractionTime.stopTimer();
      callback(browserInteractionTime.getTimeInMilliseconds());
    };
  }, [callback]);
};
