import wretch from 'wretch';
import {TokenUtils} from '../utils/index';

export class RestApi {
  protected readonly baseUrl = 'https://apiv2-dev.lykkex.net/api'; // FIXME: get baseUrl from config
  protected readonly token = TokenUtils.get();

  protected readonly baseWretch = wretch(this.baseUrl).options({
    mode: 'cors'
  });

  protected readonly bearerWretch = this.baseWretch.headers({
    Authorization: `Bearer ${this.token}`
  });
}

export default RestApi;
