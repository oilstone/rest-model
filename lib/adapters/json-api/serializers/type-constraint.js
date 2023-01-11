class TypeConstraint {
  static serialize (model, typeConstraint) {
    const items = typeConstraint.items

    if (typeConstraint.count() === 1 && typeof items[model.type] !== 'undefined') {
      return items[model.type]
    }

    return items
  }
}

export default TypeConstraint
