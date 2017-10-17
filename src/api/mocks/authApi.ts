import {RestApi} from '..';
import {Credentials} from '../../models/structs';
import {AuthApi} from '../authApi';

export class MockAuthApi extends RestApi implements AuthApi {
  getToken = (credentials: Credentials) => Promise.resolve('foobar' as any);
  getSessionToken = (clientId: string) =>
    Promise.resolve({token: 'bar'} as any);
  getBearerToken = (app: any, code: string, path: string) =>
    Promise.resolve({token: 'bar'});
}

export default MockAuthApi;
