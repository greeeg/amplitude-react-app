import React from 'react';
import { useAnalyticsPushEvent } from '../analytics';

export const Button = () => {
  const pushEvent = useAnalyticsPushEvent();

  return (
    <button onClick={() => pushEvent('Button clicked', { test: true })}>
      Click me
    </button>
  );
};
