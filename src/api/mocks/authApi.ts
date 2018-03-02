import {RestApi} from '..';
import {AuthApi} from '../authApi';

export class MockAuthApi extends RestApi implements AuthApi {
  fetchToken = (accessToken: string) => Promise.resolve({token: 'bar'} as any);
}

export default MockAuthApi;
