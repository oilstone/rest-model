class Collection extends Array {
  #meta = {}

  get meta () {
    return this.getMeta()
  }

  set meta (meta) {
    return this.setMeta(meta)
  }

  getMeta () {
    return this.#meta
  }

  setMeta (meta) {
    this.#meta = meta

    return this
  }

  toArrayPrimitive () {
    const items = [...this].map(item => {
      return item.$toObjectPrimitive()
    })

    items.$meta = this.#meta

    return items
  }
}

export default Collection
