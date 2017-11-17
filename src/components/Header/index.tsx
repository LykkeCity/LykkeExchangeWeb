import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import SideBar from '../Sidebar';
import HeaderBar from './headerbar';
import NavBar from './navbar';
import './style.css';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header: React.SFC<HeaderProps> = ({isAuthenticated}) => (
  <div>
    <SideBar />
    <HeaderBar />
    {isAuthenticated && <NavBar />}
  </div>
);

export default inject(({rootStore}: RootStoreProps) => ({
  isAuthenticated: rootStore!.authStore.isAuthenticated
}))(observer(Header));
