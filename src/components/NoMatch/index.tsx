import {Error404} from 'lykke-react-components';
import * as React from 'react';

export const NoMatch = () => (
  <div className="container">
    <div className="row">
      <div className="col-sm-8 col-md-6 automargin">
        <Error404 />
      </div>
    </div>
  </div>
);

export default NoMatch;
