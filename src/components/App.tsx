import React from 'react';
import { AnalyticsProvider } from '../analytics';
import { Button } from './Button';

export const App = () => {
  return (
    <AnalyticsProvider
      amplitudeApiKey="change-me"
      user={{
        id: '1',
        attributes: {
          plan: 'pro',
          companyId: '1234'
        }
      }}
    >
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Button />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </AnalyticsProvider>
  );
};
