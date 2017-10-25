import * as React from 'react';

export default () => (
  <div className="header_search">
    <div className="container">
      <div className="header_search__inner">
        <div className="header_search__buttons">
          <button
            type="button"
            className="btn btn-sm btn--flat hidden-xs btn_close_header"
          >
            Cancel
          </button>
          <button type="button" className="btn btn-sm btn--primary hidden-xs">
            Search
          </button>
          <button
            type="button"
            className="btn btn--icon visible-xs btn_close_header"
          >
            <i className="icon icon--cancel_round" />
          </button>
        </div>
        <div className="header_search__field">
          <button className="header_search__btn btn btn--icon" type="button">
            <i className="icon icon--search" />
          </button>
          <input type="text" className="form-control" placeholder="Search" />
        </div>
      </div>
    </div>
  </div>
);
