import {UserModel} from '../../models';
import {Credentials} from '../../models/structs';
import {AuthApi} from '../authApi';

export class MockAuthApi implements AuthApi {
  signIn = (credentials: Credentials) =>
    Promise.resolve(
      new UserModel({
        email: 'john.doe@acme.com',
        name: 'John Doe',
        username: 'john'
      })
    );
}

export default MockAuthApi;
