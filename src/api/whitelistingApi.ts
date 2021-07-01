import {RestApi} from '.';
import {ApiResponse} from './types';

export interface WhitelistingApi {
  fetchAll: () => ApiResponse<any>;
  createWhitelisting: (
    сode2Fa: string,
    name: string,
    addressBase: string,
    addressExtension: string
  ) => ApiResponse<any>;
  deleteWhitelisting: (id: string, сode2Fa: string) => any;
}

export class RestWhitelistingApi extends RestApi implements WhitelistingApi {
  fetchAll = () => this.get('/whitelistings');

  createWhitelisting = (
    name: string,
    addressBase: string,
    addressExtension: string,
    сode2Fa: string
  ) =>
    this.post('/whitelistings', {
      AddressBase: addressBase,
      AddressExtension: addressExtension,
      Code2Fa: сode2Fa,
      Name: name
    });

  deleteWhitelisting = (id: string, сode2Fa: string) =>
    this.delete(`/whitelistings/${id}`, {
      Code2Fa: сode2Fa
    });
}

export default RestWhitelistingApi;
