import amplitude from 'amplitude-js';
import { AnalyticsProvider, Attributes } from '../types';
import { urlSearchParamsToObject } from '../utils';

interface CreateAmplitudeProviderParams {
  apiKey: string;
  user: {
    id: string;
    attributes?: Attributes;
  };
}

export const createAmplitudeProvider = ({
  apiKey,
  user
}: CreateAmplitudeProviderParams): AnalyticsProvider => {
  const instance = amplitude.getInstance();
  instance.init(apiKey);
  instance.setUserId(user.id);

  if (user.attributes) {
    instance.setUserProperties(user.attributes);
  }

  return {
    pushEvent: (name: string, attributes?: Attributes) => {
      instance.logEvent(name, attributes);
    },
    view: (name: string, attributes?: Attributes) => {
      instance.logEvent('View', {
        name,
        url: window.location.href,
        path: window.location.pathname,
        search: urlSearchParamsToObject(
          new URLSearchParams(window.location.search)
        ),
        ...attributes
      });
    }
  };
};
