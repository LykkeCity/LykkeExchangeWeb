import {Dialog} from '@lykkex/react-components';
import classnames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {
  DialogActionModel,
  DialogActionType,
  DialogModel
} from '../../models/dialogModel';

import './style.css';

export interface ClientDialogProps {
  dialog: DialogModel;
  onDialogCancel: (dialog: DialogModel) => void;
  onDialogConfirm: (dialog: DialogModel) => void;
}

export class ClientDialog extends React.Component<ClientDialogProps> {
  @observable private isConfirmed = this.props.dialog.isConfirmed;

  render() {
    return (
      <Dialog
        visible={this.props.dialog.visible}
        key={this.props.dialog.id}
        title={this.props.dialog.header}
        className={classnames('client-dialog', {
          'client-dialog_confirm-disabled': !this.isConfirmed
        })}
        confirmButton={{text: 'Decline'}}
        cancelButton={{text: 'Accept'}}
        description={
          <div>
            <div dangerouslySetInnerHTML={{__html: this.props.dialog.text}} />
            {this.props.dialog.actions.map(
              (action: DialogActionModel) =>
                action.type === DialogActionType.Checkbox && (
                  <div className="form-group">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="checkbox1"
                        id="checkbox12"
                        className="radio__control"
                        checked={action.done}
                        // tslint:disable-next-line:jsx-no-lambda
                        onChange={() => this.handleCheckboxChange(action)}
                      />
                      <label
                        htmlFor="checkbox12"
                        className="control-label checkbox__label"
                      >
                        <span className="checkbox__label-text">
                          {action.text}
                        </span>
                      </label>
                    </div>
                  </div>
                )
            )}
          </div>
        }
        // tslint:disable-next-line:jsx-no-lambda
        onCancel={() => this.props.onDialogCancel(this.props.dialog)}
        // tslint:disable-next-line:jsx-no-lambda
        onConfirm={() => this.props.onDialogConfirm(this.props.dialog)}
      />
    );
  }

  private handleCheckboxChange = (action: DialogActionModel) => {
    action.done = !action.done;
    this.isConfirmed = this.props.dialog.isConfirmed;
  };
}

export default observer(ClientDialog);
