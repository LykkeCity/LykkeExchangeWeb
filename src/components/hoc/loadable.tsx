import * as React from 'react';
import Spinner from '../../components/Spinner';

type WrappedComponentProps<P> = React.ComponentClass<P> | React.SFC<P>;

type HOCComponent = <P>(
  loading: boolean | ((p: P) => boolean)
) => (C: WrappedComponentProps<P>) => React.SFC<P>;

export const loadable: HOCComponent = loading => C => props =>
  loading ? <Spinner /> : <C {...props} />;
