import City from '../domain/city';
import { getDistanceBetweenPoints } from './distance';
import { TSPAlgorithm, TSPResult } from './TSPAlgorithm';

export default class DynamicProgrammingTSP extends TSPAlgorithm {
  name = 'Dynamic Programming (exact only use for small dataset)';

  async calculate(cities: Array<City>, startingCity: City): Promise<TSPResult> {
    this.setStartingCity(cities,startingCity)

    const MAX = 1000000000000000000;
    const n = cities.length;
    //represents the distances between cities[i} and cities[j]
    const dist: Array<Array<number>> = [];
    dist[0] = new Array<number>(n + 1).fill(0);
    for (let i = 1; i <= cities.length; i++) {
      const city = cities[i - 1];
      dist[i] = [0];
      for (let j = 1; j <= cities.length; j++) {
        const targetCity = cities[j - 1];
        dist[i][j] = getDistanceBetweenPoints(city, targetCity);
      }
    }
    // memoization for top down recursion
    const memo = new Array(n + 1);

    for (let i = 0; i < memo.length; i++) {
      memo[i] = new Array(1 << (n + 1)).fill(0);
    }

    function fun(i: number, mask: number) {
      // base case
      // if only ith bit and 1st bit is set in our mask,
      // it implies we have visited all other nodes already
      if (mask == ((1 << i) | 3)) {
        return dist[1][i];
      }

      // memoization
      if (memo[i][mask] != 0) return memo[i][mask];

      let res = MAX; // result of this sub-problem

      for (let j = 1; j <= n; j++)
        if (mask & (1 << j) && j != i && j != 1) {

          let distance = fun(j, mask & ~(1 << i)) + dist[j][i];
          if(distance<res) {
            res = distance
          }
        }
      return (memo[i][mask] = res);
    }

    // Driver program to test above logic
    let distance = MAX;
    for (let i = 1; i <= n; i++)
      // try to go from node 1 visiting all nodes in
      // between to i then return from i taking the
      // shortest route to 1
      {
        let distance = fun(i, (1 << (n + 1)) - 1) + dist[i][1];
        distance = Math.min(distance, distance);
      }

    return {
      distance: distance,
      order: [],
    };
  }
}
