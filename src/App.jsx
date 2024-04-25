import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import usersFromServer from './api/users';
import getPreparedProducts from './utils/getPreparedProducts';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [filterByUser, setFilterByUser] = useState('All');
  const [query, setQuery] = useState('');
  const [filterByCategory, setFilterByCategory] = useState([]);
  const [sortingOrder, setSortingOrder] = useState('');
  const [sortByCategory, setSortByCategory] = useState('');

  const visibleProducts = getPreparedProducts(products, {
    filterByUser,
    query,
    filterByCategory,
    sortingOrder,
    sortByCategory,
  });

  const handleResetFilter = () => {
    setFilterByUser('All');
    setQuery('');
    setFilterByCategory([]);
  };

  const handleFilterByCategory = category => {
    if (filterByCategory.includes(category.title)) {
      setFilterByCategory(
        filterByCategory.filter(item => item !== category.title),
      );
    } else {
      setFilterByCategory([...filterByCategory, category.title]);
    }
  };

  const handleSort = category => {
    if (sortByCategory !== category) {
      setSortByCategory(category);
      setSortingOrder('asc');

      return;
    }

    if (sortingOrder === 'asc') {
      setSortingOrder('desc');

      return;
    }

    setSortByCategory('');
    setSortingOrder('asc');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={cn('', {
                  'is-active': filterByUser === 'All',
                })}
                onClick={() => setFilterByUser('All')}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => setFilterByUser(user.name)}
                  className={cn('', {
                    'is-active': user.name === filterByUser,
                  })}
                  data-cy="FilterUser"
                  href="#/"
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setFilterByCategory([])}
                className={cn('button is-success mr-6', {
                  'is-outlined': filterByCategory.length !== 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  onClick={() => handleFilterByCategory(category)}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': filterByCategory.includes(category.title),
                  })}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={handleResetFilter}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length ? (
            <p data-cy="NoMatchingMessage">No results</p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {['ID', 'Product', 'Category', 'User'].map(col => (
                    <th key={col}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {col}
                        <a href="#/" onClick={() => handleSort(col)}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort':
                                  sortByCategory !== col || sortingOrder === '',
                                'fa-sort-up':
                                  sortByCategory === col &&
                                  sortingOrder === 'asc',
                                'fa-sort-down':
                                  sortByCategory === col &&
                                  sortingOrder === 'desc',
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn('', {
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
