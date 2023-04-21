import City from '../domain/city';
import { getDistanceBetweenPoints } from './distance';
import { TSPAlgorithm, TSPResult } from './TSPAlgorithm';

export default class NearestNeighbourTSP extends TSPAlgorithm {
  name = 'Nearest Neighbour';

  async calculate(cities: Array<City>, startingCity: City): Promise<TSPResult> {
    this.setStartingCity(cities,startingCity)

    const distances: Array<Array<{ distance: number; index: number }>> = [];
    let sum = 0;
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      distances[i] = [];
      for (let j = 0; j < cities.length; j++) {
        const targetCity = cities[j];
        distances[i][j] = {
          distance: getDistanceBetweenPoints(city, targetCity),
          index: j,
        };
      }
    }
    //Travel to nearest city
    const visited = [0];
    const current = 0;

    while (visited.length < cities.length) {
      const nearest = this.getNearestUnvisited(current, distances, visited);
      visited[visited.length] = nearest;
      sum += distances[current][nearest].distance;
    }
    sum += distances[current][0].distance;
    visited[visited.length] = 0;

    return {
      distance: sum,
      order: visited.map((v) => cities[v]),
    };
  }

  getNearestUnvisited(
    current: number,
    distances: Array<Array<{ distance: number; index: number }>>,
    visited: Array<number>,
  ) {
    const sorted = [...distances[current]].sort((a, b) => a.distance - b.distance);
    for (let i = 0; i < sorted.length; i++) {
      const sortedElement = sorted[i];
      if (visited.includes(sortedElement.index)) {
        continue;
      }
      return sortedElement.index;
    }
    return 0;
  }
}
