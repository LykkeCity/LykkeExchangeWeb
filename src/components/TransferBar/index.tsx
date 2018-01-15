import * as React from 'react';
import {Icon} from '../Icon';
import './style.css';

export default () => (
  <div className="transfer_bar">
    <span>Templates (2)</span>
    <span>Recent transfers</span>
    <a href="#" className="pull-right">
      <Icon name="star_stroke" /> Add to favorites
    </a>
  </div>
);
