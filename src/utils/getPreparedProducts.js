const getPreparedProducts = (products, { filterByUser, query }) => {
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

  return preparedProducts;
};

export default getPreparedProducts;
