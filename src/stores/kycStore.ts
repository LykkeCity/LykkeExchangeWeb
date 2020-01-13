import {action, computed, observable, runInAction} from 'mobx';
import {KycApi, KycApiV2} from '../api/kycApi';
import {
  Document,
  Documents,
  DocumentType,
  IdCardType,
  KycStatuses,
  Questionnaire,
  RegistrationResponse,
  TierInfo,
  VerificationStatus
} from '../models';

interface VerificationDocuments {
  [key: string]: File | null;
}

export class KycStore {
  @observable tierInfo: TierInfo;
  @observable tierInfoLoading: boolean = false;
  @observable documents: Documents;
  @observable documentsLoading: boolean = false;
  @observable registration: RegistrationResponse;
  @observable registrationLoading: boolean = false;
  @observable questionnaire: Questionnaire[] = [];
  @observable showUpgradeToPro: boolean = false;
  @observable showForm: boolean = false;

  @observable fileUploadLoading: boolean = false;
  @observable showFileUploadServerErrorModal: boolean = false;
  @observable showUpdateAccountErrorModal: boolean = false;
  @observable showUpdateQuestionnaireErrorModal: boolean = false;
  @observable requestUpgradeLimitLoading: boolean = false;
  @observable questionnaireSubmitting: boolean = false;

  @observable selectedIdCardType: IdCardType = 'Passport';
  @observable
  verificationDocuments: VerificationDocuments = {
    ADDRESS: null,
    FUNDS: null,
    IDENTITY_DRIVER_LICENSE_BACK: null,
    IDENTITY_DRIVER_LICENSE_FRONT: null,
    IDENTITY_NATIONAL_BACK: null,
    IDENTITY_NATIONAL_FRONT: null,
    IDENTITY_PASSPORT: null,
    SELFIE: null
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
    await this.fetchDocuments();
    await this.fetchRegistration();
    await this.fetchTierInfo();
  };

  fetchTierInfo = async () => {
    this.tierInfoLoading = true;
    const response = await this.api!.fetchTierInfo();
    if (response) {
      runInAction(() => {
        this.tierInfo = response.Result;
        this.tierInfoLoading = false;
      });
    }
  };

  fetchDocuments = async () => {
    const self = this;
    this.documentsLoading = true;
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

    this.documentsLoading = false;

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
    this.registrationLoading = true;
    const response = await this.api!.fetchRegistration();
    if (response) {
      runInAction(() => {
        this.registration = response.Result;
        this.registrationLoading = false;
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
          if (question.HasOther) {
            question.Answers.push({
              Id: 'OTHER',
              Text: 'Other, please specify'
            });
          }
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
    await this.checkAndSetKycProfile();
    await this.fetchVerificationData();
  };

  uploadKycFile = async (documentType: string, fileType: string, file: any) => {
    return await this.api!.uploadKycFile(documentType, fileType, file);
  };

  uploadIdentity = async () => {
    const docs = this.verificationDocuments;
    let result;

    this.fileUploadLoading = true;

    try {
      if (this.selectedIdCardType === 'Passport') {
        result = await this.uploadKycFile(
          'Passport',
          '',
          docs.IDENTITY_PASSPORT
        );
      }

      if (this.selectedIdCardType === 'Id') {
        result = await this.uploadKycFile(
          'IdCard',
          'BackSide',
          docs.IDENTITY_NATIONAL_BACK
        );

        if (!result.Error) {
          result = await this.uploadKycFile(
            'IdCard',
            '',
            docs.IDENTITY_NATIONAL_FRONT
          );
        }
      }

      if (this.selectedIdCardType === 'DrivingLicense') {
        result = await this.uploadKycFile(
          'DrivingLicense',
          'BackSide',
          docs.IDENTITY_DRIVER_LICENSE_BACK
        );

        if (!result.Error) {
          result = await this.uploadKycFile(
            'DrivingLicense',
            '',
            docs.IDENTITY_DRIVER_LICENSE_FRONT
          );
        }
      }

      if (result.Error) {
        this.setShowFileUploadServerErrorModal(true);
      } else {
        await this.checkAndSetKycProfile();
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
    const result = await this.uploadKycFile('ProofOfAddress', '', docs.ADDRESS);

    if (result.Error) {
      this.setShowFileUploadServerErrorModal(true);
    } else {
      await this.checkAndSetKycProfile();
      await this.fetchVerificationData();
    }

    this.fileUploadLoading = false;

    return result;
  };

  uploadProofOfFunds = async () => {
    this.fileUploadLoading = true;
    const docs = this.verificationDocuments;
    const result = await this.uploadKycFile('ProofOfFunds', '', docs.FUNDS);

    if (result.Error) {
      this.setShowFileUploadServerErrorModal(true);
    } else {
      await this.checkAndSetKycProfile();
      await this.fetchVerificationData();
      this.showUpgradeToPro = false;
    }

    this.fileUploadLoading = false;

    return result;
  };

  uploadSelfie = async () => {
    this.fileUploadLoading = true;
    const docs = this.verificationDocuments;
    const result = await this.uploadKycFile('Selfie', '', docs.SELFIE);

    if (result.Error) {
      this.setShowFileUploadServerErrorModal(true);
    } else {
      await this.checkAndSetKycProfile();
      await this.fetchVerificationData();
    }

    this.fileUploadLoading = false;

    return result;
  };

  updateQuestionnaire = async (formValues: any) => {
    this.questionnaireSubmitting = true;
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
        this.questionnaireSubmitting = false;
        return;
      }
    } catch (e) {
      this.setShowUpdateQuestionnaireErrorModal(true);
      this.questionnaireSubmitting = false;
      return;
    }

    await this.checkAndSetKycProfile();
    await this.fetchVerificationData();
    this.questionnaireSubmitting = false;
  };

  requestUpgradeLimit = async () => {
    this.requestUpgradeLimitLoading = true;
    // create a dummy ProIndividual tier request to upgrade limit
    await this.api!.setKycProfile('ProIndividual');
    await this.fetchVerificationData();
    this.requestUpgradeLimitLoading = false;
  };

  checkAndSetKycProfile = async () => {
    const tierInfo = this.tierInfo;
    const upgradeRequest = tierInfo.UpgradeRequest;
    if (this.isUserInLastStep && tierInfo && tierInfo.NextTier) {
      // user had completed all the steps
      // so set kyc profile again
      await this.api!.setKycProfile(tierInfo.NextTier.Tier);
    } else {
      if (
        tierInfo &&
        upgradeRequest &&
        upgradeRequest.Status === 'NeedToFillData'
      ) {
        if (this.getRejectedDocumentList.length === 1) {
          // user had completed his all rejected documents
          // so set kyc profile again
          await this.api!.setKycProfile(upgradeRequest.Tier);
        }
      }
    }
  };

  @computed
  get isUserInLastStep(): boolean {
    let result = false;
    const currentForm = this.decideCurrentFormToRender;
    const tierInfo = this.tierInfo;

    if (tierInfo && tierInfo.NextTier && currentForm) {
      const nextTier = tierInfo.NextTier;
      const currentTier = tierInfo.CurrentTier;
      // Mid risk
      if (currentTier.Tier === 'Beginner' && nextTier.Tier === 'Advanced') {
        if (currentForm === 'Questionnaire') {
          result = true;
        }
      }

      if (
        currentTier.Tier === 'Advanced' &&
        nextTier.Tier === 'ProIndividual'
      ) {
        if (currentForm === 'PoF') {
          result = true;
        }
      }

      if (
        currentTier.Tier === 'Beginner' &&
        nextTier.Tier === 'ProIndividual'
      ) {
        // Mid risk
        if (tierInfo.UpgradeRequest) {
          if (currentForm === 'PoF') {
            result = true;
          }
        } else {
          // High risk
          if (currentForm === 'Questionnaire') {
            result = true;
          }
        }
      }
    }
    return result;
  }

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
    this.clearDocument('IDENTITY_PASSPORT');
    this.clearDocument('IDENTITY_NATIONAL_FRONT');
    this.clearDocument('IDENTITY_NATIONAL_BACK');
    this.clearDocument('IDENTITY_DRIVER_LICENSE_FRONT');
    this.clearDocument('IDENTITY_DRIVER_LICENSE_BACK');
  };

  @action
  setDocument = (pictureType: string, document: any) => {
    this.verificationDocuments[pictureType] = document;
  };

  @action
  clearDocument = (pictureType: string) => {
    this.verificationDocuments[pictureType] = null;
  };

  @computed
  get hasIdentityDocumentSelected(): boolean {
    return (
      !!this.verificationDocuments.IDENTITY_DRIVER_LICENSE_BACK ||
      !!this.verificationDocuments.IDENTITY_DRIVER_LICENSE_FRONT ||
      !!this.verificationDocuments.IDENTITY_PASSPORT ||
      !!this.verificationDocuments.IDENTITY_NATIONAL_BACK ||
      !!this.verificationDocuments.IDENTITY_NATIONAL_FRONT
    );
  }

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

  @action
  setShowForm = (value: boolean) => {
    this.showForm = value;
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
      rejectReason = doc.RejectReason;
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
  get getRejectedDocumentList(): string[] {
    const list: string[] = [];
    if (this.getPoiRejectReason) {
      list.push(`- Identity documents (${this.getPoiRejectReason})`);
    }
    if (this.getSelfieRejectReason) {
      list.push(`- Selfie (${this.getSelfieRejectReason})`);
    }
    if (this.getPoaRejectReason) {
      list.push(`- Proof of address (${this.getPoaRejectReason})`);
    }
    if (this.getPofRejectReason) {
      list.push(`- Proof of funds (${this.getPofRejectReason})`);
    }
    return list;
  }

  @computed
  get isUpgradeRequestRejected(): boolean {
    if (
      this.tierInfo &&
      this.tierInfo.UpgradeRequest &&
      (this.tierInfo.UpgradeRequest.Status === KycStatuses.Rejected ||
        this.tierInfo.UpgradeRequest.Status === KycStatuses.RestrictedArea)
    ) {
      return true;
    }
    return false;
  }

  @computed
  get isUpgradeRequestNeedToFillData(): boolean {
    if (
      this.tierInfo &&
      this.tierInfo.UpgradeRequest &&
      this.tierInfo.UpgradeRequest.Status === KycStatuses.NeedToFillData
    ) {
      return true;
    }
    return false;
  }

  @computed
  get isUpgradeRequestPending(): boolean {
    if (
      this.tierInfo &&
      this.tierInfo.UpgradeRequest &&
      this.tierInfo.UpgradeRequest.Status === KycStatuses.Pending
    ) {
      return true;
    }
    return false;
  }

  @computed
  get calculateTimeLeftForReview(): number {
    const tierInfo = this.tierInfo;
    if (!tierInfo) {
      return 0;
    }
    const upgradeRequest = tierInfo.UpgradeRequest;
    if (!upgradeRequest) {
      return 0;
    }
    const ONE_HR = 60 * 60 * 1000;
    const submitDate = new Date(upgradeRequest.SubmitDate);
    submitDate.setTime(submitDate.getTime() + 48 * ONE_HR);
    let hoursRemained = (submitDate.getTime() - new Date().getTime()) / ONE_HR;

    hoursRemained = Math.floor(hoursRemained);
    hoursRemained = Math.max(hoursRemained + 1, 0);

    return hoursRemained;
  }

  @computed
  get decideCurrentFormToRender() {
    const tierInfo = this.tierInfo;
    if (
      this.tierInfoLoading ||
      this.documentsLoading ||
      this.registrationLoading
    ) {
      return 'Spinner';
    }

    const accountInfoStatus = this.getAccountInformationStatus;
    const poiStatus = this.getPoiStatus;
    const selfieStatus = this.getSelfieStatus;
    const poaStatus = this.getPoaStatus;
    const pofStatus = this.getPofStatus;
    const questionnaireStatus = this.getQuestionnaireStatus;
    const showUpgradeToPro = this.showUpgradeToPro;

    if (this.isUpgradeRequestRejected) {
      return 'Rejected';
    }

    if (this.isUpgradeRequestNeedToFillData && !this.showForm) {
      return 'NeedToFillData';
    }

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

    if (
      (tierInfo.NextTier &&
        tierInfo.NextTier.Documents.indexOf('PoF') > -1 &&
        !tierInfo.UpgradeRequest) ||
      showUpgradeToPro
    ) {
      if (pofStatus === 'EMPTY' || pofStatus === 'REJECTED') {
        return 'PoF';
      }
    }

    if (questionnaireStatus === 'EMPTY' || questionnaireStatus === 'REJECTED') {
      return 'Questionnaire';
    }

    if (this.isUpgradeRequestPending) {
      return 'InReview';
    }

    if (this.isMaxLimitReached) {
      return 'UpgradeLimit';
    }

    return 'Completed';
  }
}
