class Registry {
  #factory
  #items = {}

  set factory (factory) {
    this.setFactory(factory)
  }

  get factory () {
    return this.getFactory()
  }

  setFactory(factory) {
    this.#factory = factory

    return this
  }

  getFactory() {
    return this.#factory
  }

  has (name) {
    return typeof this.#items[name] !== 'undefined'
  }

  add (name, item) {
    this.#items[name] = item

    return this
  }

  get (name) {
    return this.has(name) ? this.resolve(name) : null
  }

  resolve (name) {
    let item = this.#items[name]

    if (typeof item === 'function') {
      item = item(this.#factory)
      this.add(name, item)
    }

    return item
  }
}

export default Registry
