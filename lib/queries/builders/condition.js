class Condition {
  #column = ''

  #operator = '='

  #value = ''

  resolve (...args) {
    if (args.length) {
      this.column(args.shift())

      if (args.length === 1 && args[0] !== null) {
        this.value(args[0])
      } else {
        this.operator(args[0]).value(typeof args[1] === 'undefined' ? '' : args[1])
      }
    }

    return this
  }

  column (column) {
    this.#column = column

    return this
  }

  operator (operator) {
    this.#operator = operator ? operator.toLowerCase() : null

    return this
  }

  value (value) {
    this.#value = value

    return this
  }

  getColumn () {
    return this.#column
  }

  getOperator () {
    return this.#operator
  }

  getValue () {
    return this.#value
  }
}

export default Condition
