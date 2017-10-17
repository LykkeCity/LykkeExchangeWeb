import Spin from 'antd/lib/spin';
import * as React from 'react';

type WrappedComponentProps<P> = React.ComponentClass<P> | React.SFC<P>;

type HOCComponent<W> = <P extends W>(
  C: WrappedComponentProps<P>
) => React.SFC<P>;

export interface LoadableProps {
  loading: boolean;
}

export const loadable: HOCComponent<LoadableProps> = C => props =>
  props.loading ? (
    <div style={{textAlign: 'center', margin: '50px auto'}}>
      <Spin size="large" />
    </div>
  ) : (
    <C {...props} />
  );
