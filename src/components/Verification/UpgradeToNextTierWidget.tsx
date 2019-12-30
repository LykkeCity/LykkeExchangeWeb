import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import StepItem from './StepItem';

export const UpgradeToNextTierWidget: React.SFC<RootStoreProps> = ({
  rootStore
}) => {
  const tierNamesMapping = {
    Advanced: 'Advanced',
    ProIndividual: 'Pro Individual'
  };

  const descriptionMapping = {
    Advanced:
      'Upgrade to deposit up to $MaxLimit EUR monthly and trade without limits and fees',
    ProIndividual: 'Upgrade to get a monthly tailored limit for you'
  };

  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  const documents = kycStore.documents;
  const registration = kycStore.registration;
  if (!tierInfo || !documents || !registration) {
    return null;
  }

  const nextTier = tierInfo.NextTier;
  if (!nextTier) {
    return null;
  }

  const getAccountInformationStatus = kycStore.getAccountInformationStatus;
  const getQuestionnaireStatus = kycStore.getQuestionnaireStatus;
  const nextTierRequiredDocuments = nextTier ? nextTier.Documents : [];
  const selfieStatus = kycStore.getSelfieStatus;
  const poiStatus = kycStore.getPoiStatus;
  const poaStatus = kycStore.getPoaStatus;
  const pofStatus = kycStore.getPofStatus;
  const showUpgradeToPro = kycStore.showUpgradeToPro;
  let tierName = nextTier.Tier;

  if (showUpgradeToPro) {
    tierName = 'ProIndividual';
  }

  const nextTierName = nextTier ? tierNamesMapping[tierName] : '';
  let nextTierDescription = nextTier ? descriptionMapping[tierName] : '';
  nextTierDescription = nextTierDescription.replace(
    '$MaxLimit',
    nextTier.MaxLimit
  );

  const currentFormToRender = kycStore.decideCurrentFormToRender;
  if (currentFormToRender === 'InReview' && !showUpgradeToPro) {
    return null;
  }

  function getSidebarItems() {
    if (showUpgradeToPro) {
      return (
        <div className="verification-items">
          {(nextTierRequiredDocuments.indexOf('PoF') > -1 ||
            showUpgradeToPro) && (
            <StepItem
              text="Proof Of Funds"
              status={pofStatus}
              isActive={currentFormToRender === 'PoF'}
            />
          )}
        </div>
      );
    }

    if (tierInfo.CurrentTier.Tier === 'Beginner') {
      return (
        <div className="verification-items">
          <StepItem
            text="Account Information"
            status={getAccountInformationStatus}
            isActive={currentFormToRender === 'AccountInformation'}
          />
          {nextTierRequiredDocuments.indexOf('PoI') > -1 && (
            <StepItem
              text="Identity Documents"
              status={poiStatus}
              isActive={currentFormToRender === 'PoI'}
            />
          )}
          {nextTierRequiredDocuments.indexOf('Selfie') > -1 && (
            <StepItem
              text="Selfie"
              status={selfieStatus}
              isActive={currentFormToRender === 'Selfie'}
            />
          )}
          {nextTierRequiredDocuments.indexOf('PoA') > -1 && (
            <StepItem
              text="Proof Of Address"
              status={poaStatus}
              isActive={currentFormToRender === 'PoA'}
            />
          )}
          {(nextTierRequiredDocuments.indexOf('PoF') > -1 ||
            showUpgradeToPro) && (
            <StepItem
              text="Proof Of Funds"
              status={pofStatus}
              isActive={currentFormToRender === 'PoF'}
            />
          )}
          <StepItem
            text="Questionnaire"
            status={getQuestionnaireStatus}
            isActive={currentFormToRender === 'Questionnaire'}
          />
        </div>
      );
    }

    if (tierInfo.CurrentTier.Tier === 'Advanced') {
      return (
        <div className="verification-items">
          {nextTierRequiredDocuments.indexOf('PoF') > -1 && (
            <StepItem
              text="Proof Of Funds"
              status={pofStatus}
              isActive={currentFormToRender === 'PoF'}
            />
          )}
        </div>
      );
    }

    return null;
  }

  return (
    <div className="upgrade-to-next-tier-widget">
      <div className="upgrade-to-next-tier-widget__tier-icon">
        <div className="dummy-icon" />
      </div>
      <div className="upgrade-to-next-tier-widget__right-wrapper">
        <div className="verification-page__muted-title">Upgrade To</div>
        <div className="upgrade-to-next-tier-widget__next-tier">
          {nextTierName}
        </div>
        <div className="upgrade-to-next-tier-widget__description">
          {nextTierDescription}
          {getSidebarItems()}
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(UpgradeToNextTierWidget));
