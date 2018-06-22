import * as classNames from 'classnames';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models/index';

interface WalletFormProps extends RootStoreProps {
  wallet: WalletModel;
  onChangeName: React.ChangeEventHandler<HTMLInputElement>;
  onChangeDesc?: React.ChangeEventHandler<any>;
  onSubmit: React.MouseEventHandler<any>;
  onCancel: React.MouseEventHandler<any>;
}

export class WalletForm extends React.Component<WalletFormProps> {
  @observable hasErrors = false;
  @observable isDirty = false;
  @observable isSubmitting = false;
  readonly localizationStore = this.props.rootStore!.localizationStore;

  render() {
    const labels = this.localizationStore.i18nWalletForm;

    return (
      <form>
        <div className="form-group">
          <label htmlFor="name" className="control-label">
            {labels.Name}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className={classNames('form-control', {
              'form-control--error': this.hasErrors
            })}
            required={true}
            value={this.props.wallet.title}
            onChange={this.handleChangeName}
            autoFocus={true}
            onBlur={this.handleBlur}
          />
          {this.hasErrors && (
            <div className="label_error">{labels.NameError}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="desc" className="control-label">
            {labels.Description}
          </label>
          <textarea
            id="desc"
            onChange={this.props.onChangeDesc}
            placeholder={labels.DescriptionPlaceholder}
            className="form-control"
          />
        </div>
        <div className="drawer__footer">
          <button
            className="btn btn--primary pull-right"
            type="button"
            onClick={this.handleSubmit}
            disabled={!this.props.wallet.isValid || this.isSubmitting}
          >
            {labels.Submit}
          </button>
          <button
            className="btn btn--flat"
            type="button"
            onClick={this.props.onCancel}
          >
            {labels.Cancel}
          </button>
        </div>
      </form>
    );
  }

  private handleChangeName: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.isDirty = true;
    this.props.onChangeName(e);
    this.validateForm();
  };

  private handleSubmit: React.MouseEventHandler<any> = e => {
    this.validateForm();
    if (this.props.wallet.isValid) {
      this.isSubmitting = true;
      this.props.onSubmit(e);
    }
  };

  private handleBlur = () => {
    this.validateForm();
  };

  private validateForm = () => {
    this.hasErrors = this.isDirty && !this.props.wallet.isValid;
  };
}

export default inject(STORE_ROOT)(observer(WalletForm));
