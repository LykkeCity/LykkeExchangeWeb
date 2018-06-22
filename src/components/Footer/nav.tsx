import {inject} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../App';

export const Nav = ({labels}: any) => {
  return (
    <div className="footer_nav">
      <div className="footer_nav__row">
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">{labels.Services}</li>
            <li>
              <a href="https://lykke.com/exchange">{labels.Exchange}</a>
            </li>
            <li>
              <a href="https://lykke.com/lykke_api">{labels.API}</a>
            </li>
            <li>
              <a href="https://wallet.lykke.com/">{labels.APIDeposits}</a>
            </li>
            <li>
              <a href="https://lykke.com/apply-ico">{labels.Listing}</a>
            </li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">{labels.About}</li>
            <li>
              <a href="https://lykke.com/leadership">{labels.CoreTeam}</a>
            </li>
            <li>
              <a href="https://lykke.com/city/faq">{labels.FAQ}</a>
            </li>
            <li>
              <a href="https://lykke.com/city/invest">{labels.Invest}</a>
            </li>
            <li>
              <a href="https://lykke.com/company/news">{labels.News}</a>
            </li>
            <li>
              <a href="https://lykke.com/city/blog">{labels.Blog}</a>
            </li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">{labels.Contribute}</li>
            <li>
              <a href="https://github.com/LykkeCity/">{labels.Github}</a>
            </li>
            <li>
              <a href="https://streams.lykke.com/">{labels.Streams}</a>
            </li>
            <li>
              <a href="https://lykke.com/city/open_positions">
                {labels.Career}
              </a>
            </li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">{labels.GetInTouch}</li>
            <li>
              <a href="https://lykke.com/contacts">{labels.Contacts}</a>
            </li>
            <li>
              <a href="https://lykkex.zendesk.com">{labels.HelpCenter}</a>
            </li>
          </menu>
        </div>
      </div>
    </div>
  );
};

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    labels: rootStore!.localizationStore.i18nNavView
  }))(Nav)
);
