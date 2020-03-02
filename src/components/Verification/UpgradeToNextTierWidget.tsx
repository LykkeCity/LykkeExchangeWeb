import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
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
    ProIndividual: 'Upgrade to get a monthly limit tailored for you'
  };

  const kycStore = rootStore!.kycStore;
  const analyticsService = rootStore!.analyticsService;
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
  const selfieStatus = kycStore.getSelfieStatus;
  const poiStatus = kycStore.getPoiStatus;
  const poaStatus = kycStore.getPoaStatus;
  const pofStatus = kycStore.getPofStatus;
  const showUpgradeToPro = kycStore.showUpgradeToPro;
  let tierName = nextTier.Tier;
  const questionnaireAnswered = tierInfo.QuestionnaireAnswered;

  if (showUpgradeToPro) {
    tierName = 'ProIndividual';
  }

  const nextTierName = tierNamesMapping[tierName];
  let nextTierDescription = descriptionMapping[tierName];
  nextTierDescription = nextTierDescription.replace(
    '$MaxLimit',
    nextTier.MaxLimit
  );

  const currentFormToRender = kycStore.decideCurrentFormToRender;
  if (currentFormToRender === 'InReview' && !showUpgradeToPro) {
    return null;
  }

  let nextTierIcon = '';
  if (nextTier.Tier === 'Advanced') {
    nextTierIcon = `${process.env.PUBLIC_URL}/images/tier_advanced.png`;
  } else if (nextTier.Tier === 'ProIndividual') {
    nextTierIcon = `${process.env.PUBLIC_URL}/images/tier_pro.png`;
  }

  function getSidebarItems() {
    if (kycStore.isUpgradeRequestRejected) {
      return null;
    }

    if (tierInfo.CurrentTier.Tier === 'Beginner') {
      if (showUpgradeToPro) {
        return (
          <div className="verification-items">
            <StepItem
              text="Proof of funds"
              status={pofStatus}
              isActive={currentFormToRender === 'PoF'}
            />
          </div>
        );
      }
      return (
        <div className="verification-items">
          <StepItem
            text="Account information"
            status={getAccountInformationStatus}
            isActive={currentFormToRender === 'AccountInformation'}
          />
          <StepItem
            text="Identity documents"
            status={poiStatus}
            isActive={currentFormToRender === 'PoI'}
          />
          <StepItem
            text="Selfie"
            status={selfieStatus}
            isActive={currentFormToRender === 'Selfie'}
          />
          <StepItem
            text="Proof of address"
            status={poaStatus}
            isActive={currentFormToRender === 'PoA'}
          />
          {nextTier.Documents.indexOf('PoF') > -1 && (
            <StepItem
              text="Proof of funds"
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
          <StepItem
            text="Proof of funds"
            status={pofStatus}
            isActive={currentFormToRender === 'PoF'}
          />
          {questionnaireAnswered === false && (
            <StepItem
              text="Questionnaire"
              status={getQuestionnaireStatus}
              isActive={currentFormToRender === 'Questionnaire'}
            />
          )}
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className="upgrade-to-next-tier-widget"
      onClick={() => {
        analyticsService.track(AnalyticsEvent.Kyc.ClickOnSidebar);
      }}
    >
      <div className="upgrade-to-next-tier-widget__tier-icon">
        <img src={nextTierIcon} />
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
