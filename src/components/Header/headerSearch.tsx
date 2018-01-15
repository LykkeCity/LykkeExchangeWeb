import * as React from 'react';
import {Button} from '../Button';
import {IconButton} from '../Icon';

export default () => (
  <div className="header_search">
    <div className="container">
      <div className="header_search__inner">
        <div className="header_search__buttons">
          <Button shape="flat" size="small" className="hidden-xs">
            Cancel
          </Button>
          <Button size="small" type="submit" className="hidden-xs">
            Search
          </Button>
          <IconButton className="visible-xs" size="32px" name="close" />
        </div>
        <div className="header_search__field">
          <IconButton
            className="header_search__icon"
            size="30px"
            name="search"
          />
          <input type="text" className="form-control" placeholder="Search" />
        </div>
      </div>
    </div>
  </div>
);
