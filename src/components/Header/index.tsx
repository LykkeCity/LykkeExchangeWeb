import * as React from 'react';
import HeaderBar from './headerbar';
import NavBar from './navbar';
import Overlay from './overlay';
import SideBar from './sidebar';
import './style.css';

export default () => (
  <div>
    <Overlay />
    <SideBar />
    <HeaderBar />
    <NavBar />
  </div>
);
