import * as React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar_menu">
      <div className="sidebar_menu__inner">
        <div className="sidebar_menu__header">
          <button className="btn btn--icon btn_close_menu">
            <i className="icon icon--close" />
          </button>
          <div className="header_logo">
            <a href="/">
              <img
                className="header_logo__img"
                src="img/lykke_new.svg"
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
                href="https://www.lykke.com/"
                target="_blank"
                className="main_projects_list__link"
              >
                <div className="main_projects_list__img">
                  <img
                    src="img/lykke_wallet_logo.svg"
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
                    src="img/streams_logo.svg"
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
                    src="img/bl_explorer_logo.svg"
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

            <li className="main_projects_list__item">
              <a href="" target="_blank" className="main_projects_list__link">
                <div className="main_projects_list__img">
                  <img
                    src="img/issuer_portal_logo.svg"
                    alt="issuer_portal_logo"
                    width="50"
                  />
                </div>
                <div className="main_projects_list__content">
                  <div className="main_projects_list__title">
                    Issuer<span>Portal</span>
                  </div>
                  <div className="main_projects_list__text">
                    Create and manage your digital assets
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
                <i className="icon icon--fb_simple" />
                <span> Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/LykkeCity"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--tw" />
                <span> Twitter</span>
              </a>
            </li>
            <li>
              <a
                href="http://instagram.com/lykkecity"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--instagram" />
                <span> Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCmMYipGdKMF0kzfaE-PXsNQ"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--youtube" />
                <span> Youtube</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/lykke"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--linkedin-icn" />
                <span> Linkedin</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.reddit.com/r/lykke/"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--reddit" />
                <span> Reddit</span>
              </a>
            </li>
            <li>
              <a
                href="https://t.co/TmjMYnQD7T"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--telegram" />
                <span> Telegram</span>
              </a>
            </li>
            <li>
              <a
                href="https://lykkecommunity.slack.com"
                target="_blank"
                className="social__item"
              >
                <i className="icon icon--slack" />
                <span> Slack</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
