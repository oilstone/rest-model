class Sort {
  static serialize (model, orders) {
    const serialized = {}
    const items = orders.items

    if (orders.count() === 1 && typeof items[model.type] !== 'undefined') {
      return Sort.format(items[model.type])
    }

    for (const type in items) {
      serialized[type] = Sort.format(items[type])
    }

    return serialized
  }

  static format (items) {
    const formatted = []

    for (const item in items) {
      formatted.push(
        items[item] === 'desc' ? `-${item}` : item
      )
    }

    return formatted.join()
  }
}

export default Sort
