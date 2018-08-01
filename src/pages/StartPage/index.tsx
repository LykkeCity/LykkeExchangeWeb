import {Button} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import Footer from '../../components/Footer';
import Social from '../../components/Social';
import Subscribe from '../../components/Subscribe';
import {STORE_ROOT} from '../../constants/stores';
import LykkeAccountsSection from './sections/LykkeAccounts';
import LykkeTradeSection from './sections/LykkeTrade';
import './style.css';

interface StartPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class StartPage extends React.Component<StartPageProps> {
  private readonly authStore = this.props.rootStore!.authStore;

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  openSignInPage() {
    this.authStore.signIn();
  }

  render() {
    return (
      <div>
        <div className="start-page-wrapper">
          <div className="container">
            <section>
              <h1>Trading services on the blockchain</h1>
              <h2>Trade Bitcoin, Ethereum, FX and digital assets</h2>
              <div className="company-description">
                Lykke is building a global marketplace for the free exchange of
                financial assets. By leveraging the power of emerging
                technology, our platform eliminates market inefficiencies,
                promotes equal access from anywhere in the world, and supports
                the trade of any object of value. Users receive direct ownership
                of assets with immediate settlement from any mobile device.
              </div>
              <div>
                <Button
                  className="sign-in-button"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.openSignInPage()}
                >
                  Get started
                </Button>
                <div className="company-description-social">
                  <Social theme="description" />
                </div>
              </div>
            </section>
            <div className="separator" />
            <LykkeAccountsSection />
            <div className="separator" />
            <LykkeTradeSection />
            <div className="separator" />
            <Subscribe />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(StartPage));
