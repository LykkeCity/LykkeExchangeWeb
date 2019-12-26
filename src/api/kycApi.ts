/* tslint:disable:max-classes-per-file */
import {RestApi, RestApiV1} from './index';
import {ApiResponse} from './types/index';

export interface KycApi {
  fetchTierInfo: () => ApiResponse<any>;
  fetchDocuments: () => ApiResponse<any>;
  fetchRegistration: () => ApiResponse<any>;
  fetchQuestionnaire: () => ApiResponse<any>;
  uploadKycFile: (
    documentType: string,
    fileType: string,
    file: any
  ) => ApiResponse<any>;
  updateQuestionnaire: (answers: any[]) => ApiResponse<any>;
  setKycProfile: (tier: string) => ApiResponse<any>;
  getFile: (fileId: string) => ApiResponse<any>;
}

export class RestKycApi extends RestApiV1 implements KycApi {
  fetchTierInfo = () => this.get('/Tiers/Info');
  fetchDocuments = () => this.get('/KycProfiles/LykkeEurope/documents');
  fetchRegistration = () => this.get('/Registration');
  fetchQuestionnaire = () => this.get('/Tiers/Questionnaire');
  uploadKycFile = (documentType: string, fileType: string, file: any) =>
    this.postForm(
      '/KycFiles',
      {
        documentType,
        fileType
      },
      {
        file
      }
    );
  updateQuestionnaire = (answers: any[]) =>
    this.post('/Tiers/Questionnaire', {
      Answers: answers
    });
  setKycProfile = (tier: string) =>
    this.post(`/KycProfiles/LykkeEurope?tier=${tier}`);
  getFile = (fileId: string) => this.getRes(`/Kyc/Documents/File/${fileId}`);
}

export interface KycApiV2 {
  updateAddress: (address: string) => ApiResponse<any>;
  updateZip: (zip: string) => ApiResponse<any>;
}

export class RestKycApiV2 extends RestApi implements KycApiV2 {
  updateAddress = (address: string) =>
    this.post('/client/address', {
      Address: address
    });
  updateZip = (zip: string) =>
    this.post('/client/zip', {
      Zip: zip
    });
}

export default RestKycApi;
