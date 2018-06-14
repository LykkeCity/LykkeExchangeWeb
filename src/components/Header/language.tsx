import {
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem
} from 'lykke-react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const Language: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {localizationStore} = rootStore!;

  return (
    <div className="header__language pull-right">
      <Dropdown>
        <DropdownControl>
          <div className="header_language">
            {localizationStore.currentLanguage}
          </div>
        </DropdownControl>
        <DropdownContainer>
          <DropdownList>
            <DropdownListItem>
              <a
                href="javascript:void(0)"
                onClick={localizationStore.changeLanguage1}
              >
                EN
              </a>
            </DropdownListItem>
            <DropdownListItem>
              <a
                href="javascript:void(0)"
                onClick={localizationStore.changeLanguage1}
              >
                DE
              </a>
            </DropdownListItem>
          </DropdownList>
        </DropdownContainer>
      </Dropdown>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Language));
