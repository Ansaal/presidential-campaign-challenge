import haversineDistance from 'haversine-distance';

import City from '../domain/city';

export const getDistanceBetweenPoints = (
  origin: Pick<City, 'latitude' | 'longitude'>,
  target: Pick<City, 'latitude' | 'longitude'>,
): number => {
  return haversineDistance(origin, target) / 1000; //return in kilometres
};
