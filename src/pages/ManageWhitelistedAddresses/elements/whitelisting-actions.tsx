import React from 'react';

interface Props {
  deleteEnabled: boolean;
  addClick: () => void;
  deleteClick: () => void;
}

export class WhitelistingActions extends React.Component<Props> {
  render() {
    return (
      <div className="actions">
        <button
          className="btn btn--primary btn-sm btn-block"
          onClick={() => this.props.addClick()}
        >
          <i className="icon icon--add" /> Add
        </button>
        <button
          className="btn btn--primary btn-sm btn-block"
          disabled={!this.props.deleteEnabled}
          onClick={() => this.props.deleteClick()}
        >
          Remove
        </button>
      </div>
    );
  }
}
