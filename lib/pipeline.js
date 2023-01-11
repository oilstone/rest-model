class Pipeline {
  #model

  constructor (model) {
    this.#model = model
  }

  pieces (path) {
    let model = this.#model
    let resolved = []
    const pieces = path.split('.')

    while (pieces.length) {
      const piece = pieces.shift()
      const relation = model.relations.get(piece)

      if (!relation) {
        resolved.push(piece)
        resolved = resolved.concat(pieces)
        break
      }

      resolved.push(relation.foreignModel.type || piece)

      model = relation.foreignModel
    }

    return resolved
  }

  resolve (path) {
    return this.pieces(path).join('.')
  }
}

export default Pipeline
