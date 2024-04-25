const getPreparedProducts = (
  products,
  { filterByUser, query, filterByCategory },
) => {
  let preparedProducts = [...products];

  if (filterByUser !== 'All') {
    preparedProducts = preparedProducts.filter(
      product => product.user.name === filterByUser,
    );
  }

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();

    preparedProducts = preparedProducts.filter(product =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (filterByCategory.length > 0) {
    preparedProducts = preparedProducts.filter(product =>
      filterByCategory.includes(product.category.title),
    );
  }

  return preparedProducts;
};

export default getPreparedProducts;
