import Form, {FormComponentProps} from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input/Input';
import * as React from 'react';

interface WalletFormProps extends FormComponentProps {
  onChangeName: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}

export class WalletForm extends React.Component<WalletFormProps> {
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="vertical">
        <FormItem label="Name of wallet">
          {getFieldDecorator('name', {
            rules: [
              {
                message: 'Please input the name of the wallet',
                required: true
              }
            ]
          })(<Input onChange={this.props.onChangeName} />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(WalletForm);
