import Condition from './condition'

class Expression {
  #items = []

  #pipeline

  constructor (pipeline) {
    this.#pipeline = pipeline
  }

  get items () {
    return this.getItems()
  }

  getItems () {
    return this.#items
  }

  and (...args) {
    return this.add(
      'AND',
      args[0] instanceof Expression ? args[0] : this.constraint(...args)
    )
  }

  where (...args) {
    return this.and(...args)
  }

  or (...args) {
    return this.add(
      'OR',
      args[0] instanceof Expression ? args[0] : this.constraint(...args)
    )
  }

  orWhere (...args) {
    return this.or(...args)
  }

  add (operator, constraint) {
    this.#items.push({
      operator,
      constraint
    })

    return this
  }

  constraint (...args) {
    if (typeof args[0] === 'function') {
      const expression = new Expression(this.#pipeline)
      args[0](expression)
      return expression
    }

    args[0] = this.#pipeline.resolve(args[0])

    return new Condition().resolve(...args)
  }

  count () {
    return this.#items.length
  }
}

export default Expression
