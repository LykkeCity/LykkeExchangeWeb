import Form, {FormComponentProps} from 'antd/lib/form/Form';
import * as React from 'react';

interface WalletFormProps extends FormComponentProps {
  onChangeName: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
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
      </Form>
    );
  }
}

export default Form.create()(WalletForm);
