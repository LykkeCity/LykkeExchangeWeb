import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {createPortal} from 'react-dom';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {Icon, IconButton} from '../Icon';
import theme from '../theme';

export class Sidebar extends React.Component<RootStoreProps> {
  private uiStore = this.props.rootStore!.uiStore;

  render() {
    return createPortal(
      <aside
        className={classNames('sidebar_menu', {
          'sidebar_menu--open': this.uiStore.showSidebar
        })}
      >
        <div className="sidebar_menu__inner">
          <div className="sidebar_menu__header">
            <IconButton
              name="close"
              className="pull-right"
              onClick={this.uiStore.closeSidebar}
            />
            <div className="header_logo">
              <a href="https://www.lykke.com/">
                <img
                  className="header_logo__img"
                  src={`${process.env.PUBLIC_URL}/images/lykke_new.svg`}
                  height="40"
                  alt="lykke_logo"
                />
              </a>
            </div>
          </div>

          <div className="sidebar_menu__body">
            <ul className="main_projects_list">
              <li className="main_projects_list__item">
                <a
                  href="https://wallet.lykke.com/"
                  target="_blank"
                  className="main_projects_list__link"
                >
                  <div className="main_projects_list__img">
                    <img
                      src={`${process.env
                        .PUBLIC_URL}/images/lykke_wallet_logo.svg`}
                      alt="lykke_wallet_logo"
                      width="50"
                    />
                  </div>
                  <div className="main_projects_list__content">
                    <div className="main_projects_list__title">
                      Lykke<span>Wallet</span>
                    </div>
                    <div className="main_projects_list__text">
                      Trade FX and Digital Assets
                    </div>
                  </div>
                </a>
              </li>

              <li className="main_projects_list__item">
                <a
                  href="https://streams.lykke.com/"
                  target="_blank"
                  className="main_projects_list__link"
                >
                  <div className="main_projects_list__img">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/streams_logo.svg`}
                      alt="streams_logo"
                      width="50"
                    />
                  </div>
                  <div className="main_projects_list__content">
                    <div className="main_projects_list__title">
                      Lykke<span>Streams</span>
                    </div>
                    <div className="main_projects_list__text">
                      Collaboration platform. Here the great ideas meet bright
                      minds
                    </div>
                  </div>
                </a>
              </li>

              <li className="main_projects_list__item">
                <a
                  href="https://blockchainexplorer.lykke.com/"
                  target="_blank"
                  className="main_projects_list__link"
                >
                  <div className="main_projects_list__img">
                    <img
                      src={`${process.env
                        .PUBLIC_URL}/images/bl_explorer_logo.svg`}
                      alt="bl_explorer_logo"
                      width="50"
                    />
                  </div>
                  <div className="main_projects_list__content">
                    <div className="main_projects_list__title">
                      Blockchain<span>Explorer</span>
                    </div>
                    <div className="main_projects_list__text">
                      Explore the Blockchain. Search transaction, assets,
                      addresses or blocks
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar_menu__footer">
            <ul className="social">
              <li>
                <a
                  href="https://www.facebook.com/groups/542506412568917/"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="fb_simple"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/LykkeCity"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="tw"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="http://instagram.com/lykkecity"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="instagram"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCmMYipGdKMF0kzfaE-PXsNQ"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="youtube"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Youtube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/lykke"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="linkedin"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Linkedin</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/r/lykke/"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="reddit"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Reddit</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.co/TmjMYnQD7T"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="telegram"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Telegram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://lykkecommunity.slack.com"
                  target="_blank"
                  className="social__item"
                >
                  <Icon
                    name="slack"
                    size="20px"
                    color={theme.color.socialButton}
                  />
                  <span> Slack</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>,
      document.body
    );
  }
}

export default inject(STORE_ROOT)(observer(Sidebar));
