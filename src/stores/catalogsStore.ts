import {observable, runInAction} from 'mobx';
import {CatalogsApi} from '../api/catalogsApi';
import {CountryModel} from '../models';
import {RootStore} from './index';

export class CatalogsStore {
  @observable countries: CountryModel[] = [];

  constructor(readonly rootStore: RootStore, private api?: CatalogsApi) {}

  fetchCountries = async () => {
    const response = await this.api!.fetchCountries();
    const uniq = (arr: any[]) =>
      arr.filter(
        (obj, index, self) =>
          self.map(mapObj => mapObj.id).indexOf(obj.id) === index
      );

    if (response) {
      runInAction(() => {
        this.countries = uniq(
          response.map((c: any) => ({
            id: c.Id,
            iso2: c.Iso2,
            name: c.Name,
            prefix: c.Prefix
          }))
        );
      });
    }
  };
}

export default CatalogsStore;
