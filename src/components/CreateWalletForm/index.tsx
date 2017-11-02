import Form, {FormComponentProps} from 'antd/lib/form/Form';
import * as React from 'react';

interface WalletFormProps extends FormComponentProps {
  onChangeName: React.ChangeEventHandler<HTMLInputElement>;
  onChangeDesc?: React.ChangeEventHandler<any>;
  onSubmit: React.MouseEventHandler<any>;
  onCancel: React.MouseEventHandler<any>;
}

export class WalletForm extends React.Component<WalletFormProps> {
  render() {
    return (
      <Form layout="vertical">
        <div className="form-group">
          <label htmlFor="name" className="control-label">
            Name of wallet
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            required={true}
            onChange={this.props.onChangeName}
          />
          {
            // TODO Раз уж мы собираемся уйти от antd... надо чуть доделать. Для инпута с ошибкой добавлять модификатор form-control--error
            // <div className="label_error">Please input the name of the wallet</div>
          }
        </div>
        <div className="form-group">
          <label htmlFor="desc" className="control-label">
            Description
          </label>
          <textarea
            id="desc"
            onChange={this.props.onChangeDesc}
            placeholder="Put your description, like My API Wallet"
            className="form-control"
          />
        </div>
        <div className="drawer__footer">
          <button
            className="btn btn--flat"
            type="button"
            onClick={this.props.onCancel}
          >
            Cancel and close
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={this.handleSubmit}
          >
            Generate API Key
          </button>
        </div>
      </Form>
    );
  }

  handleSubmit: React.MouseEventHandler<any> = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(e);
      }
    });
  };
}

export default Form.create()(WalletForm);
