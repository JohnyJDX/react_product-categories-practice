const getPreparedProducts = (
  products,
  { filterByUser, query, filterByCategory, sortingOrder, sortByCategory },
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

  if (sortingOrder && sortByCategory) {
    preparedProducts.sort((a, b) => {
      const order = sortingOrder === 'asc' ? 1 : -1;

      switch (sortByCategory) {
        case 'ID':
          return order * (a.id - b.id);
        case 'Product':
          return order * a.name.localeCompare(b.name);
        case 'Category':
          return order * a.category.title.localeCompare(b.category.title);
        case 'User':
          return order * a.user.name.localeCompare(b.user.name);
        default:
          return 0;
      }
    });
  }

  return preparedProducts;
};

export default getPreparedProducts;
