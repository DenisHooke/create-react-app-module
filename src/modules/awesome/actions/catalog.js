/* global _ */
/* eslint no-param-reassign: 0 */
import { batchActions } from 'redux-batched-actions';
import { createSelector } from 'reselect';
import arrayToTree from 'array-to-tree';
import epiAdapter from '../services/EpiAdapter';
import Product from '../model/Product';
import App from '../../../system';
import loaderAction from '../../main/actions/loader';

// Constants
export const LOAD_PRODUCTS = 'LOAD_PRODUCTS';
export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';

// Sorting
const sortRootCategoryConfig = [
  'women',
  'shoes',
  'luggage',
  'jewellery & accessories',
  'beauty',
  'men',
  'kids',
  'home',
  'more',
  'kleinfeld',
  'one size',
];
export const getSortingRootCategories = (categories = []) =>
  categories.sort((a, b) =>
    (_.indexOf(sortRootCategoryConfig, a.name.toLowerCase()) === -1 &&
      _.indexOf(sortRootCategoryConfig, b.name.toLowerCase()) === -1
      ? a.name.toLowerCase() > b.name.toLowerCase()
      : _.indexOf(sortRootCategoryConfig, a.name.toLowerCase()) -
          _.indexOf(sortRootCategoryConfig, b.name.toLowerCase())));

// Setters
export const setProducts = (products = { items: [], hasMore: true }) => ({
  type: 'CATALOG_SET_CATEGORY_PRODUCTS',
  products,
});
export const setProductValues = (id, values = {}) => ({
  type: 'CATALOG_SET_CATEGORY_PRODUCT_VALUES',
  id,
  values,
});
export const clearProducts = () => setProducts();
export const setCategoriesTree = items => ({ type: 'CATALOG_SET_CATEGORIES_TREE', items });
export const setCategories = (categories = []) => ({
  type: 'CATALOG_SET_CATEGORY_CATEGORIES',
  categories,
});
export const clearCategories = () => setCategories();
export const setCategoryPath = (path = []) => ({ type: 'CATALOG_SET_CATEGORY_PATH', path });
export const clearCategoryPath = () => setCategoryPath();
export const setFilterOptions = filterOptions => ({
  type: 'CATALOG_SET_FILTER_OPTIONS',
  filterOptions,
});
export const setMenuRootCategoryValues = values => ({
  type: 'CATALOG_SET_MENU_ROOT_CATEGORY_VALUES',
  ...values,
});

// Getters
const getCategoryPage = state => state.catalog.category;
export const getCategoriesTree = state => state.catalog.categoriesTree;
export const getCategoryTree = (state, id) => _.find(getCategoriesTree(state), { id });
export const getCategoryInfo = state => _.last(getCategoryPage(state).path);
export const getCategoryPath = state => getCategoryPage(state).path;
export const getFilterOptions = state => getCategoryPage(state).filterOptions;
export const getCategoryPageCategories = state => getCategoryPage(state).categories;
export const hasMoreCategoryPageProducts = state => getCategoryPage(state).products.hasMore;
export const getCategoryPageProducts = createSelector(
  state => getCategoryPage(state).products.items,
  items => _.map(items, item => new Product(_.clone(item))),
);
export const getMenuRootCategory = state => state.catalog.rootMenuCategory;

/**
 * Recursive function wich allow return category by categoryId
 * @param id
 * @param categories
 * @returns {{}}
 */
export const getCategoryTreeById = (id, categories) => {
  let result = false;

  _.each(categories, (category) => {
    if (parseInt(category.id) === parseInt(id)) {
      result = category;
    } else if (category.children) {
      result = getCategoryTreeById(id, category.children);
    }

    if (result) {
      return false;
    }
  });

  return result;
};

/**
 * Showing root subcategories tree
 * @param rootId
 */
export const showMenuRootCategory = rootId => (dispatch, getState) => {
  const state = getState();
  const category = getCategoryTree(state, rootId);

  dispatch(setMenuRootCategoryValues({ isActive: true, category }));
};
export const hideMenuRootCategory = () => setMenuRootCategoryValues({ isActive: false });

/**
 * Fetch categories by parent Id
 * @param parentId
 * @param limit
 * @param offset
 * @param otherCategories
 */
const fetchCategories = async (parentId, limit = 1000, offset = 0, otherCategories = []) => {
  const response = await epiAdapter.fetchSubCategories(parentId, limit, offset);
  const categories = _.get(response, 'categories', []);
  const allCategories = [
    ...otherCategories,
    ...categories,
  ];
  const totalCount = _.get(response, 'total_count', 0);

  if (offset < totalCount && allCategories.length !== totalCount) {
    return fetchCategories(parentId, limit, offset + limit, allCategories);
  }

  return allCategories;
};

/**
 * Generate categories tree by array
 * @param categories
 */
const generateCategoriesTree = (categories) => {
  const items = _.chain(categories)
    .filter({
      ...(!App.getModule('Catalog').getConfig('showHiddenCategories') && { hidden: '0' }),
    })
    .sortBy('name')
    .value();
  return _.filter(arrayToTree(items, { parentProperty: 'parent_category_id' }), {
    parent_category_id: '0',
  });
};

/**
 * Fetch categories tree by parentId
 * @param parentId
 */
export const fetchCategoriesTree = (parentId = 0) => async (dispatch) => {
  const allCategories = await fetchCategories(parentId);
  const categoriesTree = generateCategoriesTree(allCategories);
  const locale = App.getCurrentLocale();
  App.getCache().local.set(`catalog_${locale}`, { categoriesTree }, 360);

  dispatch(setCategoriesTree(categoriesTree));

  return categoriesTree;
};

/**
 * Load Filter options from GRAPI
 * @param params
 */
export const fetchFilters = params => async (dispatch) => {
  const { offset = 0 } = params;
  const excludeParams = ['price[]', 'brand[]', 'offset'];
  const paramsForFacetsRequest = _.omit(params, excludeParams);

  // GET Filters only for first page request
  if (offset === 0) {
    const { facets = [] } = await epiAdapter.fetchFilters({
      ...paramsForFacetsRequest,
      per_page: 0,
    });

    if (!_.isEmpty(facets)) {
      const filters = _.map(facets, filter => ({
        ...filter,
        values: _.sortBy(filter.values, ['value']),
      }));

      dispatch(setFilterOptions(filters));
    }
  }
};

/**
 * Load products from GRAPI, also allow infinity scroll
 * @param params
 */
export const fetchProducts = params => async (dispatch, getState) => {
  const products = getCategoryPageProducts(getState());

  try {
    // Stopped load products, while one action is loading
    dispatch(batchActions([
      loaderAction.set(LOAD_PRODUCTS),
      setProducts({ items: products, hasMore: false }),
    ]));
    const response = await epiAdapter.searchProducts(params);

    const items = _.concat(products, response.products); // Merging products
    const hasMore = _.size(response.products) === params.per_page;

    dispatch(fetchFilters(params));
    // Set products and filter options
    dispatch(setProducts({ items, hasMore }));
  } catch (errors) {
    console.log('Some problems on fetching products', errors);
  }

  // Remove loader key
  dispatch(loaderAction.remove(LOAD_PRODUCTS));
};

export const getCategoryPathById = (id, categories) => {
  const result = [];

  do {
    const category = getCategoryTreeById(id, categories);
    if (category) {
      result.push(category);
    }

    id = parseInt(_.get(category, 'parent_category_id', 0), 10);
  } while (id !== 0);

  _.reverse(result);

  return result;
};

/**
 * Store to Redux category page parameters
 * e.g. subcategories of current category
 * e.g. clear product store
 * e.g. breadcrumbs
 * @param categoryId
 */
export const fetchCategoryPage = (categoryId = 0) => (dispatch, getState) => {
  const categories = getCategoriesTree(getState());
  const category = getCategoryTreeById(categoryId, categories);
  const categoryPath = getCategoryPathById(category.parent_category_id, categories);
  const subcategories = category.children
    ? _.get(category, 'children', [])
    : _.get(_.last(categoryPath), 'children', []);

  return dispatch(batchActions([
    clearProducts(),
    setCategories(subcategories),
    setCategoryPath(_.concat(categoryPath, category)),
  ]));
};
