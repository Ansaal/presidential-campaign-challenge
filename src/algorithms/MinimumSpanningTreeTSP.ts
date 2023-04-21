import City from '../domain/city';
import { getDistanceBetweenPoints } from './distance';
import { TSPAlgorithm, TSPResult } from './TSPAlgorithm';

export default class MinimumSpanningTreeTSP extends TSPAlgorithm {
  name = 'Minimum Spanning Tree';

  async calculate(cities: Array<City>, startingCity: City): Promise<TSPResult> {
    this.setStartingCity(cities,startingCity)

    const matrix = this.createDistanceMatrix(cities);

    const tree: Array<Array<number>> = new Array(cities.length);
    const unreached: number[] = [];
    //Initialize tree and unvisited array
    for (let i = 0; i < cities.length; i++) {
      tree[i] = [];
    }

    for (let i = 0; i < cities.length; i++) {
      unreached[i] = i;
    }

    const rootNode = unreached[0];
    const reached = [unreached[0]];
    reached.push(unreached[0]);
    unreached.splice(0, 1);
    while (unreached.length > 0) {
      let max = 9007199254740992;
      let newNode = 0;
      let parent = 0;
      let newNodeIndex = 0;
      for (let i = 0; i < reached.length; i++) {
        for (let j = 0; j < unreached.length; j++) {
          const record = matrix[reached[i]][unreached[j]];
          if (record < max) {
            max = record;
            newNodeIndex = j;
            parent = reached[i];
            newNode = unreached[j];
          }
        }
      }
      reached.push(unreached[newNodeIndex]);
      unreached.splice(newNodeIndex, 1);
      tree[parent].push(newNode);
    }
    const path: number[] = [];
    this.preorder(path, tree, rootNode);
    path.push(rootNode);
    let sum = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const src = path[i];
      const dest = path[i + 1];
      sum = sum + matrix[src][dest];
    }

    return {
      distance: sum,
      order: path.map((index) => cities[index]),
    };
  }

  private createDistanceMatrix(cities: Array<City>) {
    const matrix: Array<Array<number>> = [];
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      matrix[i] = [];
      for (let j = 0; j < cities.length; j++) {
        const targetCity = cities[j];
        matrix[i][j] = getDistanceBetweenPoints(city, targetCity);
      }
    }
    return matrix;
  }

  preorder(path: Array<number>, tree: Array<Array<number>>, index: number) {
    path.push(index);

    for (let i = 0; i < tree[index].length; i++) {
      this.preorder(path, tree, tree[index][i]);
    }
  }
}
