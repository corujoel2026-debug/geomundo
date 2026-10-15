import { Country } from '../types';

export function getFlagUrl(country: Country, width: number = 160): string {
  if (country.flagUrl) {
    return country.flagUrl;
  }
  return `https://flagcdn.com/w${width}/${country.iso2}.png`;
}
