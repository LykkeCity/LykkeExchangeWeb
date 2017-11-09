import * as React from 'react';
import SideBar from '../Sidebar';
import HeaderBar from './headerbar';
import NavBar from './navbar';
import './style.css';

export default () => (
  <div>
    <SideBar />
    <HeaderBar />
    <NavBar />
  </div>
);
