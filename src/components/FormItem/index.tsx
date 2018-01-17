import * as React from 'react';

export default (children: any) => (
  <div className="form-group">
    <div className="input-group">
      {Object.keys(children).map(key => children[key])}
    </div>
  </div>
);
