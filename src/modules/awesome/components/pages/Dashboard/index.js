import Loading from '../../Loading';
import Loadable from 'react-loadable';

const LoadableComponent = Loadable({
    loader: () => import('./Dashboard'),
    loading: Loading,
});

export default LoadableComponent;