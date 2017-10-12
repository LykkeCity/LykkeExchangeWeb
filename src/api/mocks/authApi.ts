import {RestApi} from '..';
import {Credentials} from '../../models/structs';
import {AuthApi} from '../authApi';

export class MockAuthApi extends RestApi implements AuthApi {
  getToken = (credentials: Credentials) => Promise.resolve('foobar' as any);
}

export default MockAuthApi;
