import {Table} from '@lykkecity/react-components';
import classnames from 'classnames';
import React from 'react';
import {FormattedDate} from 'react-intl';
import WhitelistingModel from '../../../models/whitelistingModel';

interface Props {
  items: WhitelistingModel[];
  selectedItem?: WhitelistingModel;
  page: number;
  pageSize: number;
  lastPage: number;
  filteredCount: number;
  itemClick: (item: WhitelistingModel) => void;
  prevPageClick: () => void;
  nextPageClick: () => void;
}

export class WhitelistingList extends React.Component<Props> {
  render() {
    return (
      <div className="items">
        {this.props.filteredCount > this.props.pageSize && (
          <div className="prev">
            <i
              title={
                this.props.page === 1 ? '' : `go to page ${this.props.page - 1}`
              }
              className={classnames('icon', 'icon--chevron-thin-up', {
                disabled: this.props.page === 1
              })}
              onClick={
                this.props.page === 1 ? undefined : this.props.prevPageClick
              }
            />
          </div>
        )}
        {this.props.lastPage > 1 && (
          <span className="hint">
            {this.props.page}
            <br />
            /
            <br />
            {this.props.lastPage}
          </span>
        )}
        {this.renderItems()}
        {this.props.filteredCount > this.props.pageSize && (
          <div className="next">
            <i
              title={
                this.props.page === this.props.lastPage
                  ? ''
                  : `go to page ${this.props.page + 1}`
              }
              className={classnames('icon', 'icon--chevron-thin-down', {
                disabled: this.props.page === this.props.lastPage
              })}
              onClick={
                this.props.page === this.props.lastPage
                  ? undefined
                  : this.props.nextPageClick
              }
            />
          </div>
        )}
      </div>
    );
  }

  private renderItems = () => {
    return this.props.items && this.props.items.length ? (
      this.props.items.map(x => (
        <Table
          key={x.id}
          responsive
          className={classnames({
            selected:
              this.props.selectedItem && this.props.selectedItem.id === x.id
          })}
        >
          <tbody onClick={() => this.props.itemClick(x)}>
            <tr>
              <td>Name</td>
              <td>{x.name}</td>
            </tr>
            <tr>
              <td>Wallet Name</td>
              <td>{x.walletName}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{x.addressBase}</td>
            </tr>
            <tr>
              <td>Memo/Tag</td>
              <td>{x.addressExtension || '--'}</td>
            </tr>
            <tr>
              <td>Added</td>
              <td>
                <FormattedDate
                  day="2-digit"
                  month="2-digit"
                  year="numeric"
                  hour="2-digit"
                  minute="2-digit"
                  second="2-digit"
                  hour12={false}
                  value={x.createdAt}
                />
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td className={classnames('status', x.status.toLowerCase())}>
                {x.status}
              </td>
            </tr>
          </tbody>
        </Table>
      ))
    ) : (
      <div>
        You don't have any whitelistings yet or generated deposit addresses.
        <div>
          Deposit address can be generated using{' '}
          <a
            target="_blank"
            href="https://lykkecity.github.io/Trading-API/#create-deposit-addresses"
          >
            this
          </a>{' '}
          API.
        </div>
      </div>
    );
  };
}
