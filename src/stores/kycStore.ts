import {action, computed, observable, runInAction} from 'mobx';
import {KycApi, KycApiV2} from '../api/kycApi';
import {
  Document,
  Documents,
  DocumentType,
  IdCardType,
  Questionnaire,
  RegistrationResponse,
  TierInfo,
  VerificationStatus
} from '../models';

function urltoFile(url: string, filename: string, mimeType: string) {
  return fetch(url)
    .then(res => {
      return res.arrayBuffer();
    })
    .then(buf => {
      return new File([buf], filename, {type: mimeType});
    });
}

export class KycStore {
  @observable tierInfo: TierInfo;
  @observable documents: Documents;
  @observable registration: RegistrationResponse;
  @observable questionnaire: Questionnaire[] = [];
  @observable showUpgradeToPro: boolean;

  @observable fileUploadLoading: boolean;
  @observable showFileUploadServerErrorModal: boolean;
  @observable showUpdateAccountErrorModal: boolean;
  @observable showUpdateQuestionnaireErrorModal: boolean;
  @observable requestUpgradeLimitLoading: boolean;

  @observable selectedIdCardType: IdCardType = 'Passport';
  @observable
  verificationDocuments = {
    ADDRESS: '',
    FUNDS: '',
    IDENTITY_DRIVER_LICENSE_BACK: '',
    IDENTITY_DRIVER_LICENSE_FRONT: '',
    IDENTITY_NATIONAL_BACK: '',
    IDENTITY_NATIONAL_FRONT: '',
    IDENTITY_PASSPORT: '',
    SELFIE: ''
  };

  // base64 representation of rejected images
  @observable
  rejectedDocuments = {
    ADDRESS: '',
    FUNDS: '',
    IDENTITY_DRIVER_LICENSE: '',
    IDENTITY_NATIONAL_CARD: '',
    IDENTITY_PASSPORT: '',
    SELFIE: ''
  };

  constructor(private api: KycApi, private apiv2: KycApiV2) {}

  fetchVerificationData = async () => {
    await this.fetchTierInfo();
    await this.fetchDocuments();
    await this.fetchRegistration();
  };

  fetchTierInfo = async () => {
    const response = await this.api!.fetchTierInfo();
    if (response) {
      runInAction(() => {
        this.tierInfo = response.Result;
      });
    }
  };

  fetchDocuments = async () => {
    const self = this;
    const response = await this.api!.fetchDocuments();
    if (response) {
      runInAction(() => {
        this.documents = response.Result;
      });
      if (this.getSelfieStatus === 'REJECTED') {
        const fileId = this.getDocumentByType('Selfie')!.Files[0].Id;
        this.rejectedDocuments.SELFIE = await getKycFileBase64(fileId);
      } else if (this.getPoiStatus === 'REJECTED') {
        const doc = this.getDocumentByType('PoI');
        const files = doc!.Files;
        if (doc!.Type === 'IdCard') {
          this.rejectedDocuments.IDENTITY_NATIONAL_CARD = await getKycFileBase64(
            files[0].Id
          );
        } else if (doc!.Type === 'Passport') {
          this.rejectedDocuments.IDENTITY_PASSPORT = await getKycFileBase64(
            files[0].Id
          );
        } else if (doc!.Type === 'DrivingLicense') {
          this.rejectedDocuments.IDENTITY_DRIVER_LICENSE = await getKycFileBase64(
            files[0].Id
          );
        }
      } else if (this.getPofStatus === 'REJECTED') {
        const fileId = this.getDocumentByType('PoF')!.Files[0].Id;
        this.rejectedDocuments.FUNDS = await getKycFileBase64(fileId);
      } else if (this.getPoaStatus === 'REJECTED') {
        const fileId = this.getDocumentByType('PoA')!.Files[0].Id;
        this.rejectedDocuments.ADDRESS = await getKycFileBase64(fileId);
      }
    }

    async function getKycFileBase64(fileId: string): Promise<any> {
      return new Promise(async resolve => {
        const image = await self.getFile(fileId);
        const blob = await image.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
    }
  };

  fetchRegistration = async () => {
    const response = await this.api!.fetchRegistration();
    if (response) {
      runInAction(() => {
        this.registration = response.Result;
      });
    }
  };

  fetchQuestionnaire = async () => {
    const response = await this.api!.fetchQuestionnaire();
    if (response) {
      runInAction(() => {
        this.questionnaire = response.Result.Questionnaire;

        // give indexes to each question
        let i = 1;
        this.questionnaire.map(question => {
          question.Index = i++;
          return question;
        });
      });
    }
  };

  @computed
  get getCurrentTier() {
    return this.tierInfo.CurrentTier;
  }

  @computed
  get getNextTier() {
    if (!this.tierInfo) {
      return null;
    }
    return this.tierInfo.NextTier;
  }

  @computed
  get getAccountInformationStatus(): VerificationStatus {
    if (!this.registration) {
      return 'EMPTY';
    }
    if (
      this.registration.PersonalData.Address === null ||
      this.registration.PersonalData.Zip === null
    ) {
      return 'EMPTY';
    }
    return 'APPROVED';
  }

  @computed
  get getQuestionnaireStatus(): VerificationStatus {
    if (!this.tierInfo) {
      return 'EMPTY';
    }
    if (this.tierInfo.QuestionnaireAnswered) {
      return 'APPROVED';
    }
    return 'EMPTY';
  }

  @computed
  get isMaxLimitReached(): boolean {
    if (!this.tierInfo) {
      return false;
    }
    const tierInfo = this.tierInfo;
    return (
      !tierInfo.NextTier &&
      tierInfo.CurrentTier.MaxLimit > 0 &&
      tierInfo.CurrentTier.Current >= tierInfo.CurrentTier.MaxLimit
    );
  }

  updateAccountInformation = async (address: string, zip: string) => {
    try {
      const response = await this.apiv2!.updateAddress(address);
      if (response.Error) {
        this.setShowUpdateAccountErrorModal(true);
        return;
      }
      // catch is ignored, because json parser throws exception when successful
      /* tslint:disable-next-line:no-empty */
    } catch (e) {}

    try {
      const response = await this.apiv2!.updateZip(zip);
      if (response.Error) {
        this.setShowUpdateAccountErrorModal(true);
        return;
      }
      // catch is ignored, because json parser throws exception when successful
      /* tslint:disable-next-line:no-empty */
    } catch (e) {}
    await this.fetchVerificationData();
  };

  uploadKycFile = async (documentType: string, fileType: string, file: any) => {
    return await this.api!.uploadKycFile(documentType, fileType, file);
  };

  uploadIdentity = async () => {
    let file: File;
    const docs = this.verificationDocuments;
    let result;

    this.fileUploadLoading = true;

    try {
      if (this.selectedIdCardType === 'Passport') {
        file = await urltoFile(
          docs.IDENTITY_PASSPORT,
          'passport',
          'image/jpeg'
        );
        result = await this.uploadKycFile('Passport', '', file);
      }

      if (this.selectedIdCardType === 'Id') {
        file = await urltoFile(
          docs.IDENTITY_NATIONAL_BACK,
          'id_back',
          'image/jpeg'
        );
        result = await this.uploadKycFile('IdCard', 'BackSide', file);

        if (!result.Error) {
          file = await urltoFile(
            docs.IDENTITY_NATIONAL_FRONT,
            'id_front',
            'image/jpeg'
          );
          result = await this.uploadKycFile('IdCard', '', file);
        }
      }

      if (this.selectedIdCardType === 'DrivingLicense') {
        file = await urltoFile(
          docs.IDENTITY_DRIVER_LICENSE_BACK,
          'dl_back',
          'image/jpeg'
        );
        result = await this.uploadKycFile('DrivingLicense', 'BackSide', file);

        if (!result.Error) {
          file = await urltoFile(
            docs.IDENTITY_DRIVER_LICENSE_FRONT,
            'dl_front',
            'image/jpeg'
          );
          result = await this.uploadKycFile('DrivingLicense', '', file);
        }
      }

      if (result.Error) {
        this.setShowFileUploadServerErrorModal(true);
      } else {
        await this.fetchVerificationData();
      }
    } catch (e) {
      this.setShowFileUploadServerErrorModal(true);
    }

    this.fileUploadLoading = false;

    return result;
  };

  uploadProofOfAddress = async () => {
    this.fileUploadLoading = true;
    const docs = this.verificationDocuments;
    const file = await urltoFile(
      docs.ADDRESS,
      'proof_of_address',
      'image/jpeg'
    );
    const result = await this.uploadKycFile('ProofOfAddress', '', file);

    if (result.Error) {
      this.setShowFileUploadServerErrorModal(true);
    } else {
      await this.fetchVerificationData();
    }

    this.fileUploadLoading = false;

    return result;
  };

  uploadProofOfFunds = async () => {
    this.fileUploadLoading = true;
    const docs = this.verificationDocuments;
    const file = await urltoFile(docs.FUNDS, 'proof_of_funds', 'image/jpeg');
    const result = await this.uploadKycFile('ProofOfFunds', '', file);

    if (result.Error) {
      this.setShowFileUploadServerErrorModal(true);
    } else {
      await this.api!.setKycProfile('ProIndividual');
      await this.fetchVerificationData();
      this.showUpgradeToPro = false;
    }

    this.fileUploadLoading = false;

    return result;
  };

  uploadSelfie = async () => {
    this.fileUploadLoading = true;
    const docs = this.verificationDocuments;
    const file = await urltoFile(docs.SELFIE, 'selfie', 'image/jpeg');
    const result = await this.uploadKycFile('Selfie', '', file);

    if (result.Error) {
      this.setShowFileUploadServerErrorModal(true);
    } else {
      await this.fetchVerificationData();
    }

    this.fileUploadLoading = false;

    return result;
  };

  updateQuestionnaire = async (formValues: any) => {
    try {
      const normalizedAnswers = [];
      /* tslint:disable-next-line:no-empty forin */
      for (const questionId in formValues) {
        normalizedAnswers.push({
          AnswerIds: formValues[questionId].answerIds,
          Other: formValues[questionId].other,
          QuestionId: questionId
        });
      }
      const response = await this.api!.updateQuestionnaire(normalizedAnswers);
      if (response.Error) {
        this.setShowUpdateQuestionnaireErrorModal(true);
        return;
      }
    } catch (e) {
      this.setShowUpdateQuestionnaireErrorModal(true);
      return;
    }

    await this.api!.setKycProfile('Advanced');
    await this.fetchVerificationData();
  };

  requestUpgradeLimit = async () => {
    this.requestUpgradeLimitLoading = true;
    // create a dummy ProIndividual tier request to upgrade limit
    await this.api!.setKycProfile('ProIndividual');
    this.requestUpgradeLimitLoading = false;
  };

  getFile = async (fileId: string) => {
    try {
      return await this.api!.getFile(fileId);
    } catch (e) {
      return null;
    }
  };

  @action
  setSelectedIdCardType = (type: IdCardType) => {
    this.selectedIdCardType = type;
    this.clearPicture('IDENTITY_PASSPORT');
    this.clearPicture('IDENTITY_NATIONAL_FRONT');
    this.clearPicture('IDENTITY_NATIONAL_BACK');
    this.clearPicture('IDENTITY_DRIVER_LICENSE_FRONT');
    this.clearPicture('IDENTITY_DRIVER_LICENSE_BACK');
  };

  @action
  setPicture = (pictureType: string, pictureBase64: any) => {
    this.verificationDocuments[pictureType] = pictureBase64;
  };

  @action
  clearPicture = (pictureType: string) => {
    this.verificationDocuments[pictureType] = null;
  };

  @action
  setShowFileUploadServerErrorModal = (value: boolean) => {
    this.showFileUploadServerErrorModal = value;
  };

  @action
  setShowUpdateAccountErrorModal = (value: boolean) => {
    this.showUpdateAccountErrorModal = value;
  };

  @action
  setShowUpdateQuestionnaireErrorModal = (value: boolean) => {
    this.showUpdateQuestionnaireErrorModal = value;
  };

  @action
  showSwitchToPro = () => {
    this.showUpgradeToPro = true;
  };

  @computed
  get shouldDisableIdentitySubmitButton() {
    if (this.selectedIdCardType === 'Passport') {
      return (
        !this.verificationDocuments.IDENTITY_PASSPORT || this.fileUploadLoading
      );
    }

    if (this.selectedIdCardType === 'Id') {
      return (
        !this.verificationDocuments.IDENTITY_NATIONAL_FRONT ||
        !this.verificationDocuments.IDENTITY_NATIONAL_BACK ||
        this.fileUploadLoading
      );
    }

    if (this.selectedIdCardType === 'DrivingLicense') {
      return (
        !this.verificationDocuments.IDENTITY_DRIVER_LICENSE_FRONT ||
        !this.verificationDocuments.IDENTITY_DRIVER_LICENSE_BACK ||
        this.fileUploadLoading
      );
    }

    return false;
  }

  @computed
  get shouldDisableFundsSubmitButton() {
    return !this.verificationDocuments.FUNDS || this.fileUploadLoading;
  }

  @computed
  get shouldDisableAddressSubmitButton() {
    return !this.verificationDocuments.ADDRESS || this.fileUploadLoading;
  }

  @computed
  get shouldDisableSelfieSubmitButton() {
    return !this.verificationDocuments.SELFIE || this.fileUploadLoading;
  }

  getDocumentByType(type: DocumentType): Document | null {
    if (!this.documents) {
      return null;
    }

    if (this.documents[type]) {
      return this.documents[type];
    }

    return null;
  }

  private getDocumentStatusByType(type: DocumentType): VerificationStatus {
    if (!this.documents) {
      return 'EMPTY';
    }
    let status: VerificationStatus;
    const doc = this.getDocumentByType(type);
    if (!doc) {
      return 'EMPTY';
    }

    const isPending = doc.Status === 'Draft';
    const isRejected = doc.Status === 'Declined';
    if (isPending) {
      status = 'SUBMITTED';
    } else if (isRejected) {
      status = 'REJECTED';
    } else {
      status = 'APPROVED';
    }

    return status;
  }

  @computed
  get getSelfieStatus(): VerificationStatus {
    return this.getDocumentStatusByType('Selfie');
  }

  @computed
  get getPoiStatus(): VerificationStatus {
    return this.getDocumentStatusByType('PoI');
  }

  @computed
  get getPofStatus(): VerificationStatus {
    return this.getDocumentStatusByType('PoF');
  }

  @computed
  get getPoaStatus(): VerificationStatus {
    return this.getDocumentStatusByType('PoA');
  }

  private getDocumentRejectReason(type: DocumentType): string {
    if (!this.documents) {
      return 'EMPTY';
    }
    let rejectReason = '';
    const doc = this.getDocumentByType(type);
    if (!doc) {
      return '';
    }

    const isRejected = doc.Status === 'Declined';
    if (isRejected) {
      rejectReason = doc.RejectReason || 'Rejected';
    }
    return rejectReason;
  }

  @computed
  get getSelfieRejectReason(): string {
    return this.getDocumentRejectReason('Selfie');
  }

  @computed
  get getPoiRejectReason(): string {
    return this.getDocumentRejectReason('PoI');
  }

  @computed
  get getPofRejectReason(): string {
    return this.getDocumentRejectReason('PoF');
  }

  @computed
  get getPoaRejectReason(): string {
    return this.getDocumentRejectReason('PoA');
  }

  @computed
  get decideCurrentFormToRender() {
    const tierInfo = this.tierInfo;
    if (!tierInfo || !this.documents || !this.registration) {
      return 'Spinner';
    }

    const accountInfoStatus = this.getAccountInformationStatus;
    const poiStatus = this.getPoiStatus;
    const selfieStatus = this.getSelfieStatus;
    const poaStatus = this.getPoaStatus;
    const questionnaireStatus = this.getQuestionnaireStatus;
    const showUpgradeToPro = this.showUpgradeToPro;

    if (accountInfoStatus === 'EMPTY' || accountInfoStatus === 'REJECTED') {
      return 'AccountInformation';
    }

    if (poiStatus === 'EMPTY' || poiStatus === 'REJECTED') {
      return 'PoI';
    }

    if (selfieStatus === 'EMPTY' || selfieStatus === 'REJECTED') {
      return 'Selfie';
    }

    if (poaStatus === 'EMPTY' || poaStatus === 'REJECTED') {
      return 'PoA';
    }

    if (questionnaireStatus === 'EMPTY' || questionnaireStatus === 'REJECTED') {
      return 'Questionnaire';
    }

    if (showUpgradeToPro) {
      return 'PoF';
    }

    if (tierInfo.UpgradeRequest) {
      return 'InReview';
    }

    if (this.isMaxLimitReached) {
      return 'UpgradeLimit';
    }

    return 'Completed';
  }
}
