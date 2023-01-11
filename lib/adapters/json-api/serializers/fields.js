class Select {
  static serialize (model, fields, relations) {
    const serialized = {}
    const items = fields.items

    if (!relations.length && fields.count() === 1 && typeof items[model.type] !== 'undefined') {
      return items[model.type].join()
    }

    for (const type in items) {
      serialized[type] = items[type].join()
    }

    return serialized
  }
}

export default Select
