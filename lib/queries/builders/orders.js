class Orders {
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

  resolve (pipeline, direction) {
    const pieces = this.#pipeline.pieces(pipeline)
    const field = pieces.pop()
    const type = pieces.length ? pieces.join('.') : this.#model.type

    if (typeof this.#items[type] === 'undefined') {
      this.#items[type] = {}
    }

    this.#items[type][field] = direction
  }

  count () {
    return Object.keys(this.#items).length
  }
}

export default Orders
