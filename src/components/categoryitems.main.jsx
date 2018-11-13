/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { navigationLookup } from '../utils/AuthService';
import ProductListMain from './productlist.main';
import ProductListPagination from './productlistpagination.main';

class CategoryItemsMain extends React.Component {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryModel: { links: [], _items: [] },
    };
  }

  componentDidMount() {
    const { categoryId } = this.props;
    this.setState({ isLoading: true });
    navigationLookup(categoryId)
      .then((res) => {
        this.setState({
          isLoading: false,
          categoryModel: res,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        throw error;
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isLoading: true });
    navigationLookup(nextProps.categoryId)
      .then((res) => {
        this.setState({
          isLoading: false,
          categoryModel: res,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        throw error;
      });
  }

  render() {
    const { isLoading, categoryModel } = this.state;
    const products = (categoryModel._items || []) ? categoryModel._items[0] : categoryModel;
    const noProducts = !products || !products.links || products.links.length === 0 || !products.pagination;
    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          {(() => {
            if (isLoading) {
              return (<div className="loader" />);
            }

            if (noProducts) {
              return (
                <h3 className="view-title">
                  {intl.get('no-products-found')}
                </h3>
              );
            }

            return (
              <div>
                <h1 className="view-title">
                  {categoryModel['display-name']}
                </h1>
                <div className="products-container">
                  <ProductListPagination paginationDataProps={products} isTop />
                  <ProductListMain productData={products} />
                  <ProductListPagination paginationDataProps={products} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}

export default CategoryItemsMain;
