class TypeConstraint {
  #items = {}

  #model

  #pipeline

  constructor (model, pipeline) {
    this.#model = model
    this.#pipeline = pipeline
  }

  get items () {
    return this.getItems()
  }

  getItems () {
    return this.#items
  }

  resolve (...args) {
    if (args.length === 1) {
      this.#items[this.#model.type] = args[0]

      return
    }

    const pieces = this.#pipeline.pieces(args[0])

    this.#items[pieces[pieces.length - 1]] = args[1]
  }

  count () {
    return Object.keys(this.#items).length
  }
}

export default TypeConstraint
