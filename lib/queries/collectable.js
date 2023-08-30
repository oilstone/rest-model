import Query from './query'
import Expression from './builders/expression'
import Orders from './builders/orders'
import TypeConstraint from './builders/type-constraint'

class Collectable extends Query {
  #filters

  #orders

  #limits

  #offsets

  #searchQuery = ''

  constructor (model, path) {
    super(model, path)

    this.#filters = new Expression(this.pipeline)
    this.#orders = new Orders(model, this.pipeline)
    this.#limits = new TypeConstraint(model, this.pipeline)
    this.#offsets = new TypeConstraint(model, this.pipeline)
  }

  get filters () {
    return this.getFilters()
  }

  getFilters () {
    return this.#filters
  }

  get orders () {
    return this.getOrders()
  }

  getOrders () {
    return this.#orders
  }

  get limits () {
    return this.getLimits()
  }

  getLimits () {
    return this.#limits
  }

  get offsets () {
    return this.getOffsets()
  }

  getOffsets () {
    return this.#offsets
  }

  get searchQuery () {
    return this.getSearchQuery()
  }

  getSearchQuery () {
    return this.#searchQuery
  }

  where (...args) {
    this.#filters.where(...args)

    return this
  }

  orWhere (...args) {
    this.#filters.orWhere(...args)

    return this
  }

  sort (pipeline, direction = 'asc') {
    this.#orders.resolve(pipeline, direction)

    return this
  }

  limit (...args) {
    this.#limits.resolve(...args)

    return this
  }

  offset (...args) {
    this.#offsets.resolve(...args)

    return this
  }

  search (query) {
    this.#searchQuery = query

    return this
  }

  find (id) {
    this.model.events.fire('fetchingOne', this)

    return this.model.http.get(this.path.setKey(id).resolve(), this.buildRequestConfig()).then(response => {
      const record = this.model.hydrateOne(this.model.adapter.unpack(this.model, response))

      this.model.events.fire('fetchedOne', record)

      return record
    }).catch(error => {
      if (!error.response) {
        throw error
      }

      throw this.model.adapter.unpack(this.model, error.response)
    })
  }

  get () {
    this.model.events.fire('fetchingMany', this)

    return this.model.http.get(this.path.resolve(), this.buildRequestConfig()).then(response => {
      const collection = this.model.hydrateMany(
        this.model.adapter.unpack(this.model, response)
      )

      this.model.events.fire('fetchedMany', collection)

      return collection
    }).catch(error => {
      if (!error.response) {
        throw error
      }

      throw this.model.adapter.unpack(this.model, error.response)
    })
  }

  first () {
    return this.get().then(result => {
      return result.length ? result[0] : null
    })
  }
}

export default Collectable
