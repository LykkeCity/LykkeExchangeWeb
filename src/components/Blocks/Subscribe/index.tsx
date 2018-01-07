import * as React from 'react';
import Button from '../../Button';
import Icon from '../../Icon';
import './style.css';

export default () => (
  <div className="block_subscribe">
    <h5 className="block_subscribe__title">Newsletter</h5>
    <p className="hint">Get our latest news right in your mailbox</p>

    <form className="form">
      <div className="form-group">
        <div className="input-group">
          <Icon name="email" />
          <input
            type="email"
            placeholder="E-mail address"
            className="form-control"
          />
        </div>
        <Button shape="circle">
          <Icon name="arrow-right-alt" />
        </Button>
      </div>
    </form>
  </div>
);
