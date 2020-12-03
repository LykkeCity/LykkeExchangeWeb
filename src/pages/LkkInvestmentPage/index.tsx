import {Checkbox, RadioButton} from '@lykkex/react-components';
import * as classnames from 'classnames';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {AmountInput} from '../../components/AmountInput';
import {ROUTE_LKK_INVESTMENT_SUCCESS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {LkkInvestmentModel} from '../../models';

import './style.css';

interface LkkInvestmentPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class LkkInvestmentPage extends React.Component<
  LkkInvestmentPageProps,
  {radioButtonValue: string; agreementAccepted: boolean}
> {
  state = {radioButtonValue: '', agreementAccepted: false};
  readonly profileStore = this.props.rootStore!.profileStore;
  readonly transferStore = this.props.rootStore!.transferStore;

  @observable operationId: string = '';
  @observable socketSubscriptionId: string = '';

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const requiredErrorMessage = (fieldName: string) =>
      `Field ${fieldName} should not be empty`;

    return (
      <div>
        <div className="container">
          <div className="lkk-investment">
            <div className="lkk-investment__title">
              LKK Investment Opportunities
            </div>
            <div className="lkk-investment__description">
              Please fill in the details below in order to process your LKK
              purchase request from Olsen LTD. In order to do so, it is
              necessary to have a fully KYCed Lykke account.
            </div>
            <Formik
              initialValues={{}}
              enableReinitialize
              validationSchema={Yup.object().shape({
                amount: Yup.number()
                  .moreThan(0, requiredErrorMessage('Amount'))
                  .required(requiredErrorMessage('Amount'))
              })}
              // tslint:disable-next-line:jsx-no-lambda
              onSubmit={this.handleSubmit}
              render={this.renderForm}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleSubmit = async (values: LkkInvestmentModel, formikBag: any) => {
    if (this.state.radioButtonValue === 'radio-bank-transfer') {
      values.isBankTransfer = true;
    } else {
      values.isBankTransfer = false;
    }

    this.transferStore.sendInvestmentRequest(values);

    // todo
    this.props.history.replace(ROUTE_LKK_INVESTMENT_SUCCESS);
  };

  private radioButtonChanged = (value: string) => {
    this.setState({radioButtonValue: value});
  };

  private renderForm = (formikBag: FormikProps<LkkInvestmentModel>) => {
    return (
      <Form className="lkk-investment-form">
        <div className="separator" />
        <Field
          name="amount"
          // tslint:disable-next-line:jsx-no-lambda
          render={({field, form}: FieldProps<LkkInvestmentPageProps>) => (
            <div
              className={classnames('form-group inline-form', {
                'has-error': form.errors[field.name] && form.touched[field.name]
              })}
            >
              <div className="row row_amount">
                <div className="col-sm-4">
                  <label htmlFor={field.name} className="control-label">
                    The exact amount of LKK you would like to purchase:
                  </label>
                </div>
                <div className="col-sm-5">
                  <div className="input-group">
                    <div className="error-bar" />
                    <div className="amount-input">
                      <AmountInput
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        onFocus={(e: any) => {
                          formikBag.setFieldTouched(field.name, false);
                        }}
                        value={field.value || ''}
                        name={field.name}
                      />
                      {form.errors[field.name] &&
                        form.touched[field.name] && (
                          <span className="help-block">
                            {form.errors[field.name]}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
        <div className="container">
          <div className="row row_purchase_option">
            <div className="lkk-investment__question">
              How would you like this purchase to be executed?
            </div>
          </div>
          <div className="row row_purchase_option">
            <RadioButton
              label="By bank transfer to the below account:"
              checked={this.state.radioButtonValue === 'radio-bank-transfer'}
              onChange={() => this.radioButtonChanged('radio-bank-transfer')}
              groupName="purchase_option"
              value="radio-bank-transfer"
              className="lkk-investment__radiobutton"
            />
          </div>
          <div className="row row_purchase_option">
            <div className="col-sm-4">Account Holder:</div>
            <div className="col-sm-8">Olsen Ltd.</div>
          </div>
          <div className="row row_purchase_option">
            <div className="col-sm-4">Name of Bank:</div>
            <div className="col-sm-8">Helvetsiche Bank</div>
          </div>
          <div className="row row_purchase_option">
            <div className="col-sm-4">IBAN:</div>
            <div className="col-sm-8">CH5208845330292701000</div>
          </div>
          <div className="row row_purchase_option">
            <div className="col-sm-4">Swift:</div>
            <div className="col-sm-8">SFBFCH22XXX</div>
          </div>
          <br />
          <div className="row row_purchase_option">
            <RadioButton
              label="Lykke withdraws existing funds from your account and credits it with LKK."
              checked={this.state.radioButtonValue === 'radio-wallet-account'}
              onChange={() => this.radioButtonChanged('radio-wallet-account')}
              groupName="purchase_option"
              value="radio-wallet-account"
              className="lkk-investment__radiobutton"
            />
          </div>
        </div>
        <br />

        <div className="row lkk-investment__question">
          In order to proceed with the investment, please read carefully the LKK
          Investment Agreement:
        </div>
        <div className="lkk-agreement-container">
          <div className="lkk-investment__agreement_paragraph">
            This Private Agreement (“<b>Agreement</b>”) is executed on{' '}
            <b>[●]</b> by and between:
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>(A)</b>
            </div>
            <div className="col-sm-11">
              <b>[LKK investor]</b>, residing at <b>[●]</b>, <b>[●]</b>,{' '}
              <b>[●]</b> (the “<b>Investor</b>”); and
            </div>
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>(B)</b>
            </div>
            <div className="col-sm-11">
              <b>Olsen Ltd.</b>, registered in the company register of Zurich
              CHE-101.047.565 with offices at Wehrenbachhalde 46, 8053 Zurich,
              Switzerland ("<b>Olsen</b>"),
            </div>
          </div>
          <div className="lkk-investment__agreement_paragraph">
            (the Investor and Olsen each a “<b>Party</b>” and, jointly, the “<b>Parties</b>”).
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <i>WHEREAS</i>,
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>A.</b>
            </div>
            <div className="col-sm-11">
              Lykke Corp (“<b>Lykke</b>”) is a corporation limited by shares
              duly registered under the laws of Switzerland, with the register
              number CHE-345.258.499, having a registered share capital of CHF
              197’139.13, divided into 19’713’913 common shares (“<b>Shares</b>”)
              with a par value of CHF 0.01 each.
            </div>
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>B.</b>
            </div>
            <div className="col-sm-11">
              Each registered share of Lykke could be requested by converting
              100 Lykke coinsper common share (100:1 ratio) (“<b>LKK</b>”).
            </div>
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>C.</b>
            </div>
            <div className="col-sm-11">
              The Investor is{' '}
              <i>
                [a corporation limited by shares duly registered under the laws
                of [●], with the register number [●] which has been duly KYCed
                by Lykke]
              </i>{' '}
              or <i>[a private individual who has been duly KYCed by Lykke]</i>.
            </div>
          </div>
          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>D.</b>
            </div>
            <div className="col-sm-11">
              The Investor intends to purchase [●] LKK (the “<b>LKK Investment</b>”)
              from Olsen; and Olsen intends to sell such LKK Investment to the
              Investor.
            </div>
          </div>
          <div className="lkk-investment__agreement_paragraph">
            Now, therefore, the Parties agree to discipline their contractual
            relationship pursuant to the terms and condition set forth hereunder
            in this Agreement.
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>1.</b>
            </div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                <b>OBJECT OF THE AGREEMENT</b>
              </div>
              <div>
                The Investor hereby agrees to purchase the LKK Investment from
                Olsen, and Olsen agrees to sell the LKK Investment to the
                Investor.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>2.</b>
            </div>
            <div className="col-sm-11">
              <div>
                <b>PURCHASE PRICE</b>
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">2.1</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                The purchase price of the LKK Investmentis set at 0.0117CHF for
                each LKK, amounting to a total amount of [●]([●]) CHF (the “<b>Funds</b>”).
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">2.2</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                The Investor undertakes to transfer the Funds to the following
                account of Olsen ("Bank Account"):
              </div>
              <div>
                <div className="row row_purchase_option">
                  <div className="col-sm-5">Account Holder:</div>
                  <div className="col-sm-7">Olsen Ltd.</div>
                </div>
                <div className="row row_purchase_option">
                  <div className="col-sm-5">Name of Bank:</div>
                  <div className="col-sm-7">Helvetsiche Bank</div>
                </div>
                <div className="row row_purchase_option">
                  <div className="col-sm-5">IBAN:</div>
                  <div className="col-sm-7">CH5208845330292701000</div>
                </div>
                <div className="row row_purchase_option">
                  <div className="col-sm-5">Swift:</div>
                  <div className="col-sm-7">SFBFCH22XXX</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>3.</b>
            </div>
            <div className="col-sm-11">
              <div>
                <b>CLOSING</b>
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">3.1</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                The execution of this Agreement (“<b>Closing</b>”) shall take
                place immediately upon its signing by both Parties, and upon
                receiving the Funds on its bank account – to finalize such
                Closing - Olsen shall transfer to the Investor the LKK
                Investment on the Investor’s wallet in the Lykke application.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>4.</b>
            </div>
            <div className="col-sm-11">
              <div>
                <b>TRANSFER OF BENEFIT AND RISK</b>
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">4.1</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                The benefit and risk of the LKKInvestmentshall pass to the
                Investoruponthe Closing.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>5.</b>
            </div>
            <div className="col-sm-11">
              <div>
                <b>MISCELLANEOUS</b>
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">5.1</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                Costs and Expenses
              </div>
              <div>
                Regardless of whether the transaction contemplated by this
                Agreement will be consummated, each Party bears its own costs
                and expenses.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">5.2</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                Taxes
              </div>
              <div>
                Direct and indirect Taxes and duties shall be borne by the Party
                which owes them by law, unless explicitly provided for otherwise
                in this Agreement.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">5.3</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                Amendments
              </div>
              <div>
                Amendments of this Agreement shall be in writing and require the
                mutual agreement of both Parties to be valid.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">5.4</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                Notices
              </div>
              <div>
                Communications under this Agreement shall be addressed per mail
                to the addresses indicated on the cover page or by e-mail which
                was agreed or previously used in the communication between the
                Parties.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">5.5</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                Succession and Assignment
              </div>
              <div>
                The Parties may not assign or delegate, in whole or in part,
                either this Agreement or any of their rights and obligations
                under this Agreement without the prior written consent of the
                other Party. Any such assignment or delegation performed without
                the aforementioned written consent shall be null and void.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">5.6</div>
            <div className="col-sm-11">
              <div className="lkk-investment__agreement_paragraph_header">
                Confidentiality
              </div>
              <div>
                The Parties agree to keep this Agreement confidential and to not
                to disclose its content to any third party.
              </div>
            </div>
          </div>

          <div className="lkk-investment__agreement_paragraph">
            <div className="col-sm-1">
              <b>6.</b>
            </div>
            <div className="col-sm-11">
              <div>
                <b>GOVERNING LAW AND COMPETENT JURISDICTION</b>
              </div>
              <div>
                This Agreement shall be governed by and construed in accordance
                with the substantive laws of Switzerland. Any dispute arising in
                connection with this Agreement shall be subject to the exclusive
                jurisdiction of the courts competent for the city of Zug,
                Switzerland.
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="row">
          <Checkbox
            label="By ticking this box you are confirming that you agree with the above agreement as well as the above-mentioned investment instructions."
            checked={this.state.agreementAccepted === true}
            onToggle={() =>
              this.setState({
                agreementAccepted: !this.state.agreementAccepted
              })}
            className="lkk-investment__radiobutton"
          />
        </div>

        <div className="lkk-investment-form__actions">
          <input
            type="submit"
            value="Submit"
            className="btn btn--primary"
            disabled={
              formikBag.isSubmitting ||
              !formikBag.isValid ||
              this.state.agreementAccepted === false ||
              this.state.radioButtonValue === ''
            }
          />
        </div>
      </Form>
    );
  };
}

export default inject(STORE_ROOT)(observer(LkkInvestmentPage));
