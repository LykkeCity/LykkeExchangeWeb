import {RestApi} from '.';
import {ApiResponse} from './types';

export interface CatalogsApi {
  fetchCountries: () => ApiResponse<any>;
}

export class RestCatalogsApi extends RestApi implements CatalogsApi {
  fetchCountries = () =>
    this.get('/catalogs/countries').catch(
      this.rootStore.authStore.redirectToAuthServer
    );
}

export default RestCatalogsApi;
