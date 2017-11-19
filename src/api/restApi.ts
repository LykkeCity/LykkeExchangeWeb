import wretch from 'wretch';
import {Wretcher} from 'wretch/dist/wretcher';
import {config} from '../config';
import {RootStore} from '../stores/index';

export class RestApi {
  protected readonly baseAuthUrl = config.auth.url;
  protected readonly baseApiUrl = process.env.REACT_APP_API_URL;

  protected readonly apiWretch = wretch(this.baseApiUrl);
  protected readonly authWretch = wretch(this.baseAuthUrl);

  protected get = this._get(() => this.apiBearerWretch());
  protected post = this._post(() => this.apiBearerWretch());
  protected put = this._put(() => this.apiBearerWretch());

  protected getAuth = this._get(() => this.authBearerWretch());
  protected postAuth = this._post(() => this.authBearerWretch());

  constructor(protected rootStore: RootStore) {}

  protected apiBearerWretch() {
    return this.apiWretch.auth(`Bearer ${this.rootStore.authStore.token}`);
  }
  protected authBearerWretch() {
    return this.authWretch.auth(
      `Bearer ${this.rootStore.authStore.getAccessToken()}`
    );
  }

  // tslint:disable-next-line:variable-name
  private _get(wretcher: () => Wretcher) {
    return (
      url: string,
      cb: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .get()
        .unauthorized(cb)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _post(wretcher: () => Wretcher) {
    return (
      url: string,
      payload: any,
      cb: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .json(payload)
        .post()
        .unauthorized(cb)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _put(wretcher: () => Wretcher) {
    return (
      url: string,
      payload: any,
      cb: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .json(payload)
        .put()
        .unauthorized(cb)
        .json();
  }
}

export default RestApi;
