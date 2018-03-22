import * as H from 'history';
import {reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {
  ROUTE_AFFILIATE_DETAILS,
  ROUTE_AFFILIATE_STATISTICS,
  ROUTE_ROOT
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AffiliateStore, FeatureStore, RootStore, UiStore} from '../../stores';
import {formatWithAccuracy} from '../../utils';
import {NumberFormat} from '../NumberFormat';
import {TabLink, TabPane} from '../Tabs';
import './style.css';

export class AffiliateTabs extends React.Component<any> {
  readonly affiliateStore: AffiliateStore;
  readonly featureStore: FeatureStore;
  readonly history: H.History;
  readonly uiStore: UiStore;
  readonly formatAccuracy: number = 8;

  constructor({
    rootStore,
    history
  }: {
    rootStore: RootStore;
    history: H.History;
  }) {
    super();
    this.uiStore = rootStore.uiStore;
    this.affiliateStore = rootStore.affiliateStore;
    this.featureStore = rootStore.featureStore;
    this.history = history;

    reaction(
      () => this.featureStore.isLoaded,
      isLoaded => {
        if (!this.featureStore.hasAffiliate) {
          // TODO: it's better to use injected router props for the history/location
          this.history.replace(ROUTE_ROOT);
        }
      }
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.affiliateStore.isLoadData) {
      this.uiStore.startRequest();
      this.affiliateStore.getData().then(() => this.uiStore.finishRequest());
    }
  }

  render() {
    return !this.featureStore.hasAffiliate ? null : (
      <div>
        <div className="tabs tabs--nav">
          {this.affiliateStore.isAgreed && (
            <TabLink label="Statistics" to={ROUTE_AFFILIATE_STATISTICS} />
          )}
          <TabLink label="Program details" to={ROUTE_AFFILIATE_DETAILS} />
        </div>
        <div className="section section--padding">
          {this.affiliateStore.isAgreed && (
            <TabPane to={ROUTE_AFFILIATE_STATISTICS}>
              <div className="row">
                <div className="col-md-8 automargin">
                  <div className="page_header">
                    <h1 className="section__title">Lykke affiliate program</h1>
                    <div className="section_subtitle">
                      It pays to have friends!
                    </div>
                  </div>
                  <p className="lead">
                    We are aiming to increase the number of professional
                    traders, which use Lykke API for trading bots. The more you
                    share the link, the higher is the chance that you will bring
                    at least one professional trader for API trading.
                  </p>

                  <div className="affiliate_info">
                    <div className="row">
                      <div className="affiliate_info__item col-sm-6 col-md-3">
                        <div className="affiliate_info__title">
                          Referral friends
                        </div>
                        <div className="affiliate_info__value">
                          {this.affiliateStore.affiliateModel.referralsCount}
                        </div>
                      </div>
                      <div className="affiliate_info__item col-sm-6 col-md-3">
                        <div className="affiliate_info__title">
                          Total turnover
                        </div>
                        <div className="affiliate_info__value">
                          {this.affiliateStore.affiliateModel.totalTradeVolume >
                          0 ? (
                            <NumberFormat
                              value={
                                this.affiliateStore.affiliateModel
                                  .totalTradeVolume
                              }
                              format={formatWithAccuracy(this.formatAccuracy)}
                            />
                          ) : (
                            0
                          )}
                          &nbsp;BTC
                        </div>
                      </div>
                      <div className="affiliate_info__item col-sm-6 col-md-3">
                        <div className="affiliate_info__title">
                          Total revenue
                        </div>
                        <div className="affiliate_info__value">
                          {this.affiliateStore.affiliateModel.totalBonus > 0 ? (
                            <NumberFormat
                              value={
                                this.affiliateStore.affiliateModel.totalBonus
                              }
                              format={formatWithAccuracy(this.formatAccuracy)}
                            />
                          ) : (
                            0
                          )}
                          &nbsp;BTC
                        </div>
                      </div>
                      <div className="affiliate_info__item col-sm-6 col-md-3">
                        <div className="affiliate_info__title">
                          Revenue share
                        </div>
                        <div className="affiliate_info__value">
                          up to 50%&nbsp;
                          <Link
                            to={ROUTE_AFFILIATE_DETAILS}
                            onClick={this.onReadRulesClicked}
                          >
                            <i className="icon icon--help_outline" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 automargin">
                  <h2>How it works?</h2>

                  <ol className="list_styled">
                    <li>
                      To participate in Lykke Affiliate Program (hereinafter -
                      the “Program”), please{' '}
                      <Link
                        to={ROUTE_AFFILIATE_DETAILS}
                        onClick={this.onReadRulesClicked}
                      >
                        read rules
                      </Link>.
                    </li>
                    <li>
                      Share your referral link with friends or place it on your
                      website.
                      <form action="" className="share_form">
                        <div className="form-group">
                          <label className="control-label" htmlFor="code">
                            Referral link
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              readOnly
                              value={
                                this.affiliateStore.affiliateModel.affiliateLink
                              }
                            />
                            <button
                              type="button"
                              className="btn btn--icon input-group-addon btn_copy"
                              onClick={this.affiliateStore.copyLinkToClipboard}
                            >
                              <i className="icon icon--copy_thin" />
                            </button>
                          </div>

                          <div className="share share_links">
                            <ul className="rrssb-buttons clearfix">
                              <li className="rrssb-facebook">
                                <a
                                  href={
                                    'https://www.facebook.com/sharer/sharer.php?u=' +
                                    this.affiliateStore.encodedAffiliateLink
                                  }
                                  className="popup share_item"
                                  target="_blank"
                                  /* facebook should autoclose tab itself */
                                >
                                  <span className="rrssb-icon">
                                    <i className="icon icon--fb_simple" />
                                  </span>
                                  <span className="rrssb-text">Share</span>
                                </a>
                              </li>
                              <li className="rrssb-twitter">
                                <a
                                  href={
                                    'https://twitter.com/intent/tweet?url=' +
                                    this.affiliateStore.encodedAffiliateLink
                                  }
                                  className="popup share_item"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="rrssb-icon">
                                    <i className="icon icon--tw" />
                                  </span>
                                  <span className="rrssb-text">Tweet</span>
                                </a>
                              </li>
                              <li className="rrssb-linkedin">
                                <a
                                  href={
                                    'http://www.linkedin.com/shareArticle?mini=true&url=' +
                                    this.affiliateStore.encodedAffiliateLink
                                  }
                                  className="popup share_item"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="rrssb-icon">
                                    <i className="icon icon--linkedin" />
                                  </span>
                                  <span className="rrssb-text">Share</span>
                                </a>
                              </li>
                              <li className="rrssb-email">
                                <a
                                  href={
                                    'mailto:?subject=Lykke&body=' +
                                    this.affiliateStore.encodedAffiliateLink
                                  }
                                  className="share_item"
                                >
                                  <span className="rrssb-icon">
                                    <i className="icon icon--envelope" />
                                  </span>
                                  <span className="rrssb-text">Send</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </form>
                    </li>
                    <li>
                      You will earn revenue from the users who
                      <ul>
                        <li>arrive to the site through your affiliate link</li>
                        <li>register</li>
                        <li>
                          make trades as a professional trader trough Lykke API
                          or make trade against profesional trader which uses
                          Lykke API . Trades for regular users are not subject
                          of a commissions on Lykke exchange and will not be
                          taken into account for affiliate revenue calculations.
                        </li>
                      </ul>
                    </li>
                    <li>
                      Track conversions of the traffic you send on table below
                      this text.
                    </li>
                    <li>
                      Get your reward — up to 50% of Lykke’s fee on all trade
                      transactions made by referred users through Lykke’s API
                      for professional traders.
                    </li>
                    <li>
                      The reward is added to your balance automatically once a
                      day for the sum earned 30 days ago. All fees are paid in
                      coins/tokens of original trades.
                    </li>
                    <li>
                      A visitor will be considered as your affiliate for 1
                      month.
                    </li>
                    <li>
                      Commissions will be paid for two years from the user's
                      registration. Commission is based on the income the new
                      user brings for Lykke (trading fees).
                    </li>
                    <li>
                      Any foul play, such as misleading advertising, is
                      forbidden.
                    </li>
                    <li>
                      Withdraw your reward via bank transfer, according to
                      withdrawal procedures and limits of Lykke exchange and
                      Lykke wallet.
                    </li>
                  </ol>
                </div>
              </div>
            </TabPane>
          )}

          <TabPane to={ROUTE_AFFILIATE_DETAILS}>
            <div className="row">
              <div className="col-md-6 automargin">
                <div className="page_header">
                  <h1 className="section__title">Lykke affiliate program</h1>
                  <div className="section_subtitle">
                    It pays to have friends!
                  </div>
                </div>

                <h2>Lykke affiliate program terms and conditions</h2>
                <h3 className="subtitle">A. General terms</h3>

                <ol className="list_styled">
                  <li>
                    To participate in Lykke Affiliate Program (hereinafter - the
                    “Program”), please read the rules on this page.
                  </li>
                  <li>
                    Find and copy your referral link on the affiliate page.
                  </li>
                  <li>
                    Share your referral link with friends or place it on your
                    website.
                  </li>
                  <li>
                    You will earn revenue from the users who
                    <ul>
                      <li>follow your affiliate link to Lykke website</li>
                      <li>register</li>
                      <li>
                        trade through Lykke API or trade against someone who
                        uses Lykke API. Trades between regular users are not
                        subject of a commissions on Lykke exchange and will not
                        be taken into account for affiliate revenue
                        calculations.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Track the statistics of your affiliates traffic on the
                    affiliate page.
                  </li>
                  <li>
                    Get your reward — up to 50% of Lykke’s fee on all trade
                    transactions made by your affiliates through Lykke API. The
                    revenue received from commissions is divided between Lykke
                    and the partner according to the following model:
                    <table className="table table--simple">
                      <tbody>
                        <tr>
                          <th>Maker</th>
                          <th>Taker</th>
                          <th>Partner's A share</th>
                          <th>Partner's B share</th>
                        </tr>
                        <tr>
                          <td>mobile client*</td>
                          <td>vs mobile client</td>
                          <td>0%</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>mobile client*</td>
                          <td>vs API user **</td>
                          <td>25%</td>
                          <td>25%</td>
                        </tr>
                        <tr>
                          <td>mobile client*</td>
                          <td>vs API user</td>
                          <td>50%</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>API user *</td>
                          <td>vs mobile client</td>
                          <td>50%</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>API user *</td>
                          <td>vs API user **</td>
                          <td>25%</td>
                          <td>25%</td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <div className="hint">
                              * Invited by the partner A
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <div className="hint">
                              ** Invited by the partner B
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>

                  <li>
                    The reward is added to your balance automatically once a day
                    for the sum earned 30 days ago. All fees are paid in the
                    currency of the corresponding trade.
                  </li>
                  <li>
                    The following assets are excluded from the affiliate
                    program: LKK, LKK1Y, LKK2Y. Any trades in pairs with these
                    assets will NOT be rewarded.
                  </li>
                  <li>
                    A visitor will be considered as your affiliate for 1 month.
                  </li>
                  <li>
                    Commissions will be paid for two years from the user's
                    registration. Commission is based on the income the new user
                    brings Lykke (trading fees).
                  </li>
                  <li>
                    Any foul play, such as misleading advertising, is forbidden.
                  </li>
                  <li>
                    Withdraw your reward via bank transfer, according to
                    withdrawal procedures and limits of Lykke exchange and Lykke
                    wallet.
                  </li>
                </ol>

                <h3 className="subtitle">
                  B. The Program participant undertakes:
                </h3>
                <ol className="list_styled">
                  <li>to use the Program in good faith and with due care;</li>
                  <li>
                    not to create sub-accounts on Lykke and become a
                    self-affiliate;
                  </li>
                  <li>
                    not to use any unsolicited bulk mail, email or messaging
                    programs (”Spam”) to attract new affiliates;
                  </li>
                  <li>
                    not to refer persons making fraud actions or any other
                    prohibited unlawful actions;
                  </li>
                  <li>
                    to inform Lykke if he/she discovers that other participant
                    practices or is involved in fraud or other unlawful actions;
                  </li>
                  <li>
                    to cover any Lykke damage caused by his/her fraud or other
                    unlawful action, as well as damage caused by his/her
                    affiliates;
                  </li>
                  <li>
                    bidding on branded keywords such as “Lykke.com”, “Lykke”,
                    “Lykke wallet”, or any misspellings, or variations of those
                    is strictly prohibited on any pay-for-placement search
                    engines;
                  </li>
                </ol>

                <h3 className="subtitle">
                  C. The Program participant is liable for:
                </h3>
                <ol className="list_styled">
                  <li>
                    any damage which Lykke suffers from his/her undue,
                    fraudulent or other unlawful action;
                  </li>
                  <li>any damage caused by his/her affiliate;</li>
                </ol>

                <h3 className="subtitle">D. Lykke has the right:</h3>
                <ol className="list_styled">
                  <li>
                    to investigate any action which caused damage to Lykke;
                  </li>
                  <li>
                    to change or to cancel any statements in the user agreement
                    at any time;
                  </li>
                  <li>
                    to cover any proved damage caused by the Program participant
                    actions using his/her funds on the Platform;
                  </li>
                  <li>
                    to disable any affiliate user at any given time. In case you
                    breach the terms, your affiliate program will be terminated.
                  </li>
                  <li>
                    to revoke all Program rewards in case of violation of this
                    Terms and Conditions, as well as fraud, refunds,
                    cancellations and chargebacks or a substantial change in
                    business circumstances;
                  </li>
                </ol>

                {!this.affiliateStore.isAgreed && (
                  <div className="form-group">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="checkbox1"
                        id="checkbox12"
                        className="radio__control"
                        checked={this.affiliateStore.checkAgreement}
                        // tslint:disable-next-line:jsx-no-lambda
                        onChange={() =>
                          (this.affiliateStore.checkAgreement = !this
                            .affiliateStore.checkAgreement)}
                      />
                      <label
                        htmlFor="checkbox12"
                        className="control-label checkbox__label"
                      >
                        I have read, understood, and agree to the Terms and
                        conditions
                      </label>
                    </div>
                  </div>
                )}

                {!this.affiliateStore.isAgreed && (
                  <div className="form__submit">
                    <button
                      className="btn btn--primary btn-block"
                      disabled={!this.affiliateStore.checkAgreement}
                      onClick={this.onAgreeClicked}
                    >
                      Agree and continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </TabPane>
        </div>
      </div>
    );
  }

  private onReadRulesClicked = () => window.scrollTo(0, 0);

  private onAgreeClicked = () => {
    this.affiliateStore.onAgreeClicked();
    this.history.replace(ROUTE_AFFILIATE_STATISTICS);
  };
}

export default withRouter(inject(STORE_ROOT)(observer(AffiliateTabs)));
