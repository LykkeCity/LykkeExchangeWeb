import * as React from 'react';
import HeaderBar from './headerbar';
import NavBar from './navbar';
import SideBar from './sidebar';
import './style.css';

export default () => (
  <div>
    <SideBar />
    <HeaderBar />
    <NavBar />
  </div>
);
