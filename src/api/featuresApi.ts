import {RestApi} from '.';
import {ApiResponse} from './types';

export interface FeaturesApi {
  getFeatures: () => ApiResponse;
}

export class RestFeaturesApi extends RestApi implements FeaturesApi {
  getFeatures = () => this.get('/client/features');
}

export default RestFeaturesApi;
