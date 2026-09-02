/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const productsReceivedFromServer = [...productsFromServer].map(product => {
  const category = categoriesFromServer.find(
    categoryServer => categoryServer.id === product.categoryId,
  );
  const user = usersFromServer.find(
    userServer => category.ownerId === userServer.id,
  );

  return { ...product, category, user };
});

const users = [...usersFromServer];
const categories = [...categoriesFromServer];

function preparedProducts(
  products,
  { userFilter, inputValue, selectedCategories, sortProducts },
) {
  let finalProducts = [...products];

  if (userFilter !== '') {
    finalProducts = finalProducts.filter(({ user }) => user.id === userFilter);
  }

  if (inputValue !== '') {
    const normalizedInputValue = inputValue.trim().toLowerCase();

    finalProducts = finalProducts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizedInputValue);
    });
  }

  if (selectedCategories.length) {
    finalProducts = finalProducts.filter(({ category }) => {
      return selectedCategories.includes(category.id);
    });
  }

  if (sortProducts !== '') {
    switch (sortProducts[0]) {
      case 'id':
        finalProducts.sort((product1, product2) => {
          return product1.id - product2.id;
        });
        break;

      case 'product':
        finalProducts.sort((product1, product2) => {
          return product1.name.localeCompare(product2.name);
        });
        break;

      case 'category':
        finalProducts.sort((product1, product2) => {
          return product1.category.title.localeCompare(product2.category.title);
        });
        break;

      case 'user':
        finalProducts.sort((product1, product2) => {
          return product1.user.name.localeCompare(product2.user.name);
        });
        break;

      default:
        break;
    }
  }

  if (sortProducts[1] === 'desc') {
    return [...finalProducts].reverse();
  }

  return finalProducts;
}

export const App = () => {
  const [userFilter, setUserFilter] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortProducts, setSortProducts] = useState('');

  const products = preparedProducts(productsReceivedFromServer, {
    userFilter,
    inputValue,
    selectedCategories,
    sortProducts,
  });

  const handleUserSelect = userId => {
    setUserFilter(userId);
  };

  const handleInputChange = value => {
    setInputValue(value);
  };

  const handleResetButton = () => {
    setInputValue('');
    setUserFilter('');
    setSelectedCategories([]);
  };

  const handleCategorySelect = value => {
    if (!value) {
      setSelectedCategories([]);
    } else if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter(id => id !== value));
    } else if (
      !selectedCategories.find(categorySelected => categorySelected === value)
    ) {
      const categoriesThatAreSelected = [...selectedCategories];

      categoriesThatAreSelected.push(value);

      setSelectedCategories(categoriesThatAreSelected);
    }
  };

  const handleSort = value => {
    if (sortProducts[0] === value) {
      if (sortProducts[1] === 'asc') {
        setSortProducts([value, 'desc']);
      } else {
        setSortProducts([]);
      }
    } else {
      setSortProducts([value, 'asc']);
    }
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
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleUserSelect('')}
                className={userFilter === '' ? 'is-active' : ''}
              >
                All
              </a>

              {users.map(({ id, name }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={id}
                  onClick={() => handleUserSelect(id)}
                  className={userFilter === id ? 'is-active' : ''}
                >
                  {name}
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
                  value={inputValue}
                  onChange={event => handleInputChange(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {inputValue !== '' && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => handleInputChange('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategories.length !== 0,
                })}
                onClick={() => handleCategorySelect('')}
              >
                All
              </a>

              {categories.map(({ title, id }) => (
                <a
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'mr-1', {
                    'is-info': selectedCategories.includes(id),
                  })}
                  href="#/"
                  key={id}
                  onClick={() => handleCategorySelect(id)}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => handleResetButton()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {products.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
          {products.length !== 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/" onClick={() => handleSort('id')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortProducts[0] !== 'id',
                              'fa-sort-up':
                                sortProducts[0] === 'id' &&
                                sortProducts[1] === 'asc',
                              'fa-sort-down':
                                sortProducts[0] === 'id' &&
                                sortProducts[1] === 'desc',
                            })}
                          />
                        </span>
                        {/* className="fas fa-sort" */}
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/" onClick={() => handleSort('product')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortProducts[0] !== 'product',
                              'fa-sort-up':
                                sortProducts[0] === 'product' &&
                                sortProducts[1] === 'asc',
                              'fa-sort-down':
                                sortProducts[0] === 'product' &&
                                sortProducts[1] === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/" onClick={() => handleSort('category')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortProducts[0] !== 'category',
                              'fa-sort-up':
                                sortProducts[0] === 'category' &&
                                sortProducts[1] === 'asc',
                              'fa-sort-down':
                                sortProducts[0] === 'category' &&
                                sortProducts[1] === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/" onClick={() => handleSort('user')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortProducts[0] !== 'user',
                              'fa-sort-up':
                                sortProducts[0] === 'user' &&
                                sortProducts[1] === 'asc',
                              'fa-sort-down':
                                sortProducts[0] === 'user' &&
                                sortProducts[1] === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(({ id, name, category, user }) => (
                  <tr data-cy="Product" key={id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>

                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">
                      {category.icon} - {category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {user.name}
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
