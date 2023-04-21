import City from '../domain/city';

type TSPResult = {
  order: Array<City>;
  distance: number;
};

abstract class TSPAlgorithm {
  public abstract name: string;

  protected setStartingCity(cities: Array<City>, startingCity: City) {
    let number = cities.indexOf(startingCity);
    if(number<0) {
      return
    }
    cities.splice(number,1)
    cities.unshift(startingCity)
  }

  abstract calculate(cities: Array<City>, startingCity: City): Promise<TSPResult>;
}

export { TSPAlgorithm };
export type { TSPResult };
