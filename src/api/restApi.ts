import wretch from 'wretch';
import {TokenUtils} from '../utils/index';

export class RestApi {
  protected readonly baseUrl = 'https://apiv2-dev.lykkex.net/api'; // FIXME: get baseUrl from config
  protected readonly token = TokenUtils.get();

  protected readonly wretch = wretch(this.baseUrl)
    .headers({Authorization: `Bearer ${this.token}`})
    .options({mode: 'cors'});
}

export default RestApi;
