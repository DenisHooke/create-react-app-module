import Category from './components/pages/Category';
import Dashboard from './components/pages/Dashboard';

export default {
  index: {
    path: '/',
    exact: true,
    component: Category
  },
  new_index: {
    path: '/dashboard',
    component: Dashboard
  }
};
