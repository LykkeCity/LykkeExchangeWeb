import wretch from 'wretch';
import {RestApi} from '.';

export class RestApiV1 extends RestApi {
  protected readonly baseApiUrl = process.env.REACT_APP_APIV1_URL;
  protected readonly apiWretch = wretch(this.baseApiUrl);
}

export default RestApiV1;
