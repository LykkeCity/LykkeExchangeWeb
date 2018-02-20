import {RestApi} from '.';
import {ApiResponse} from './types';

export interface AffiliateApi {
  fetchLink: () => ApiResponse;
  createLink: () => ApiResponse;
  fetchStats: () => ApiResponse;
}

export class RestAffiliateApi extends RestApi implements AffiliateApi {
  fetchLink = () => this.get('/affiliate/link');
  createLink = () => this.post('/affiliate/create', undefined);
  fetchStats = () => this.get('/affiliate/stats');
}

export default RestAffiliateApi;
