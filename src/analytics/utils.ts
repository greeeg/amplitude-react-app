import { URLSearchParams } from 'url';

export const urlSearchParamsToObject = (params: URLSearchParams): object => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Array.from(params.entries())) {
    result[key] = value;
  }

  return result;
};
