import {shallow} from 'enzyme';
import React from 'react';
import {AssetModel, InstrumentModel} from '../../models';
import {LinksToTrade} from './index';

const USDAsset = new AssetModel({id: 'USD'});
const EURAsset = new AssetModel({id: 'EUR'});
const ETCAsset = new AssetModel({id: 'ETC'});
const LKKAsset = new AssetModel({id: 'LKK'});
const USDETCInstrument = new InstrumentModel({
  baseAsset: USDAsset,
  id: 'USDETC',
  name: 'USD/ETC',
  quoteAsset: ETCAsset
});
const USDLKKInstrument = new InstrumentModel({
  baseAsset: USDAsset,
  id: 'USDLKK',
  name: 'USD/LKK',
  quoteAsset: LKKAsset
});
const EURETCInstrument = new InstrumentModel({
  baseAsset: EURAsset,
  id: 'EURETC',
  name: 'EUR/ETC',
  quoteAsset: ETCAsset
});

describe('<LinksToTrade>', () => {
  let instumentsForTrading: InstrumentModel[];

  const getTestLinksToTrade = () => {
    return <LinksToTrade instumentsForTrading={instumentsForTrading} />;
  };

  describe('method render', () => {
    beforeEach(() => {
      instumentsForTrading = [
        USDETCInstrument,
        USDLKKInstrument,
        EURETCInstrument
      ];
    });

    it('should render empty dropdown if no instuments passed', () => {
      instumentsForTrading = [];
      const wrapper = shallow(getTestLinksToTrade());
      expect(wrapper.find('a')).toHaveLength(0);
    });

    it('should render links for all instruments passed', () => {
      const wrapper = shallow(getTestLinksToTrade());
      expect(wrapper.find('a')).toHaveLength(3);
      instumentsForTrading.forEach((instrument, index) => {
        const listItem = wrapper.find('a').at(index);
        expect(listItem.prop('href')).toContain(instrument.id);
        expect(listItem.html()).toContain(instrument.name);
      });
    });
  });
});
