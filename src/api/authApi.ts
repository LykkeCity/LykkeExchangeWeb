import {UserModel} from '../models';
import {Credentials} from '../models/structs';
import {ApiResponse} from './types';

export interface AuthApi {
  signIn: (credentials: Credentials) => ApiResponse<UserModel>;
}

export class RestAuthApi implements AuthApi {
  constructor(private fetch?: any) {}

  signIn = (credentials: Credentials) => this.fetch.post('signin');
}

export default RestAuthApi;
