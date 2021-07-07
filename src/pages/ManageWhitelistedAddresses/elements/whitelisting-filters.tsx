import React from 'react';

interface Props {
  filter: string;
  filteredCount: number;
  allCount: number;
  filterChange: (value: string) => void;
}

export class WhitelistingFilters extends React.Component<Props> {
  render() {
    return (
      <div className="filters">
        {this.props.filteredCount !== this.props.allCount && (
          <span className="hint">{`${this.props.filteredCount}/${this.props
            .allCount}`}</span>
        )}
        <input
          autoFocus
          value={this.props.filter}
          onChange={this.handleFilterChange}
          className="form-control"
          placeholder="Filters..."
        />
      </div>
    );
  }

  private handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.filterChange(e.currentTarget.value);
  };
}
