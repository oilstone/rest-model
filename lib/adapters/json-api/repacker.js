class Repacker {
  #model

  #record

  constructor (model, record) {
    this.#model = model
    this.#record = record
  }

  data () {
    const id = this.extractId()
    const attributes = this.extractAttributes()
    const data = {
      type: this.#model.type
    }

    if (id) {
      data.id = id
    }

    if (attributes) {
      data.attributes = attributes
    }

    return {
      data
    }
  }

  extractId () {
    const attributes = this.#record.$attributes

    return typeof attributes[this.#model.primaryKey] !== 'undefined' && attributes[this.#model.primaryKey] ? attributes[this.#model.primaryKey] : null
  }

  extractAttributes () {
    const attributes = JSON.parse(
      JSON.stringify(this.#record.$attributes)
    )

    if (typeof attributes[this.#model.primaryKey] !== 'undefined') {
      delete attributes[this.#model.primaryKey]
    }

    return attributes
  }
}

export default Repacker
