import {
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem
} from '@lykkex/react-components';
import React from 'react';
import {InstrumentModel} from '../../models';
import './style.css';

export interface LinksToTradeProps {
  instumentsForTrading: InstrumentModel[];
}

export const LinksToTrade: React.SFC<LinksToTradeProps> = ({
  instumentsForTrading
}) => {
  return (
    <Dropdown trigger="click">
      <DropdownControl>
        <span className="dropdown-button">
          <img
            className="icon"
            src={`${process.env.PUBLIC_URL}/images/trade-icn.svg`}
          />
          Sell / Buy
        </span>
      </DropdownControl>
      <DropdownContainer>
        <DropdownList>
          {instumentsForTrading.map(instrument => (
            <DropdownListItem key={instrument.id}>
              <a
                href={`http://trade.lykke.com/trade/${instrument.id}`}
                target="_blank"
              >
                {instrument.name}
              </a>
            </DropdownListItem>
          ))}
        </DropdownList>
      </DropdownContainer>
    </Dropdown>
  );
};
