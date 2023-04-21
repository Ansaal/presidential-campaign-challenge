import City from '../domain/city';
import { getDistanceBetweenPoints } from './distance';
import { TSPAlgorithm, TSPResult } from './TSPAlgorithm';

export default class NearestInsertionTSP extends TSPAlgorithm {
  name = 'Nearest Insertion';

  async calculate(cities: Array<City>, startingCity: City): Promise<TSPResult> {
    this.setStartingCity(cities,startingCity)

    const distances: Array<Array<{ distance: number; index: number }>> = [];
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

    while (visited.length < cities.length) {
      const nearest = this.getNearestUnvisited(distances, visited);
      const index = this.getBestInsertion(distances, visited, nearest);
      visited.splice(index, 0, nearest);
    }

    let tourDistance = this.getTourDistance(distances, visited);
    tourDistance += distances[visited[visited.length - 1]][0].distance;
    visited.push(0);

    return {
      distance: tourDistance,
      order: visited.map((v) => cities[v]),
    };
  }

  getTourDistance(
    distances: Array<Array<{ distance: number; index: number }>>,
    visited: Array<number>,
  ) {
    if (visited.length < 2) {
      return 0;
    }
    let sum = 0;
    for (let i = 1; i < visited.length; i++) {
      sum += distances[visited[i - 1]][i].distance;
    }
    sum += distances[visited[visited.length - 1]][0].distance;
    return sum;
  }

  getBestInsertion(
    distances: Array<Array<{ distance: number; index: number }>>,
    visited: Array<number>,
    toInsert: number,
  ): number {
    if (visited.length < 2) {
      return 1;
    }
    let min = 100000000000;
    let minIndex = 0;
    for (let i = 1; i < visited.length; i++) {
      const newDistance = this.getTourDistance(
        distances,
        [...visited].splice(i, 0, toInsert),
      );
      if (newDistance < min) {
        min = newDistance;
        minIndex = i;
      }
    }
    return minIndex;
  }

  getNearestUnvisited(
    distances: Array<Array<{ distance: number; index: number }>>,
    visited: Array<number>,
  ) {
    let nearestIndex = 0;
    let nearestDistance = 900000;
    for (let i = 0; i < visited.length; i++) {
      const number = visited[i];
      for (let i1 = 0; i1 < distances[number].length; i1++) {
        const distanceElement = distances[number][i1];
        if (visited.includes(distanceElement.index)) {
          continue;
        }
        if (nearestDistance > distanceElement.distance) {
          nearestIndex = i1;
          nearestDistance = distanceElement.distance;
        }
      }
    }
    return nearestIndex;
  }
}
