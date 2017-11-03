import * as React from 'react';
import SideBar from '../Sidebar';
import HeaderBar from './headerbar';
import NavBar from './navbar';
// import SiteNav from './sitenav';
import './style.css';

export default () => (
  <div>
    <SideBar />
    <HeaderBar />
    <NavBar />

    {
      // TODO Site Nav
      // <SiteNav />
    }
  </div>
);
