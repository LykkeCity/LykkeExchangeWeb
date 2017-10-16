import wretch from 'wretch';
import {TokenUtils} from '../utils/index';

export class RestApi {
  protected readonly authUrl = process.env.REACT_APP_AUTH_URL;
  protected readonly baseApiUrl = process.env.REACT_APP_API_URL;

  protected readonly baseWretch = wretch(this.baseApiUrl).options({
    mode: 'cors'
  });
  protected readonly authWretch = wretch(this.authUrl);

  protected readonly bearerWretch = () =>
    this.baseWretch.headers({
      Authorization: `Bearer ${TokenUtils.get()}`
    });
}

export default RestApi;
