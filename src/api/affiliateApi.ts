import {RestApi} from '.';
import {ApiResponse} from './types';

export interface AffiliateApi {
  getIsVisible: () => ApiResponse;
  fetchLink: () => ApiResponse<Response>;
  createLink: () => ApiResponse;
  fetchStats: () => ApiResponse;
}

export class RestAffiliateApi extends RestApi implements AffiliateApi {
  getIsVisible = () => this.get('/affiliate/features');
  fetchLink = () => this.getRes('/affiliate/link');
  createLink = () => this.post('/affiliate/create', undefined);
  fetchStats = () => this.get('/affiliate/stats');
}

export default RestAffiliateApi;
