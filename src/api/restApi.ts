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
  protected getWithQuery = this._getWithQuery(() => this.apiBearerWretch());
  protected getRes = this._getRes(() => this.apiBearerWretch());
  protected post = this._post(() => this.apiBearerWretch());
  protected postRes = this._postRes(() => this.apiBearerWretch());
  protected postForm = this._postForm(() => this.apiBearerWretch());
  protected put = this._put(() => this.apiBearerWretch());
  protected delete = this._delete(() => this.apiBearerWretch());

  constructor(protected rootStore: RootStore) {}

  protected apiBearerWretch() {
    return this.apiWretch.auth(`Bearer ${this.rootStore.authStore.token}`);
  }

  // tslint:disable-next-line:variable-name
  private _get(wretcher: () => Wretcher) {
    return (
      url: string,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .get()
        .unauthorized(callback)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _getWithQuery(wretcher: () => Wretcher) {
    return (
      url: string,
      query: object,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .query(query)
        .get()
        .unauthorized(callback)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _getRes(wretcher: () => Wretcher) {
    return (
      url: string,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .get()
        .unauthorized(callback)
        // tslint:disable-next-line:no-empty
        .notFound(() => {})
        .res();
  }

  // tslint:disable-next-line:variable-name
  private _post(wretcher: () => Wretcher) {
    return (
      url: string,
      payload?: any,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .json(payload)
        .post()
        .unauthorized(callback)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _postRes(wretcher: () => Wretcher) {
    return (
      url: string,
      payload: any,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .json(payload)
        .post()
        .unauthorized(callback)
        .res();
  }

  // tslint:disable-next-line:variable-name
  private _postForm(wretcher: () => Wretcher) {
    return (
      url: string,
      query: object,
      payload?: any,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .query(query)
        .formData(payload)
        .post()
        .unauthorized(callback)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _put(wretcher: () => Wretcher) {
    return (
      url: string,
      payload: any,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .json(payload)
        .put()
        .unauthorized(callback)
        .json();
  }

  // tslint:disable-next-line:variable-name
  private _delete(wretcher: () => Wretcher) {
    return (
      url: string,
      payload: any,
      callback: () => void = this.rootStore.authStore.redirectToAuthServer
    ) =>
      wretcher()
        .url(url)
        .json(payload)
        .delete()
        .unauthorized(callback)
        .json();
  }
}

export default RestApi;
