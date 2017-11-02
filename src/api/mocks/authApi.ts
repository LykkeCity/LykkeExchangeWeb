import {RestApi} from '..';
import {AuthApi} from '../authApi';

export class MockAuthApi extends RestApi implements AuthApi {
  fetchSessionToken = (clientId: string) =>
    Promise.resolve({token: 'bar'} as any);
  fetchBearerToken = (app: any, code: string, path: string) =>
    Promise.resolve({token: 'bar'});
  signOut = (path: string) => ({} as any);
}

export default MockAuthApi;
