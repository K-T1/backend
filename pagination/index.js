function modelPaginator(result) {
  let fromOffset = 0
  let toOffset = 0

  if (result.offset) {
    fromOffset = result.offset
    toOffset = result.offset
  } else {
    const pageOffset = (result.page - 1) * result.limit
    fromOffset = pageOffset + 1
    toOffset = pageOffset + (result.docs.length)
  }

  return {
    total: result.total,
    from: fromOffset,
    to: toOffset,
    currentPage: result.page,
    lastPage: result.pages,
    perPage: result.limit,
    data: result.docs
  }
};

function staticPaginator(items) {
  const length = items.length

  return {
    total: length,
    from: 1,
    to: length,
    currentPage: 1,
    lastPage: 1,
    perPage: 2147483647,
    data: items
  }
};

export {
  modelPaginator,
  staticPaginator
}
