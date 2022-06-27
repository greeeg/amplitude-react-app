export type Attributes = Record<string, string | boolean | number>;

export interface AnalyticsProvider {
  pushEvent: (name: string, attributes?: Attributes) => void;
  view: (name: string, attributes?: Attributes) => void;
}
