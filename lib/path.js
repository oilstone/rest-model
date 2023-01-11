import RestModel from './rest-model'

class Path {
  #model

  #key

  #parent

  constructor (model) {
    this.#model = model
  }

  set key (key) {
    this.setKey(key)
  }

  get key () {
    return this.#key
  }

  setKey (key) {
    this.#key = key

    return this
  }

  prepend (path) {
    this.#parent = path

    return this
  }

  resolve () {
    const pieces = []

    if (this.#parent) {
      pieces.push(this.#parent.resolve())
    } else {
      pieces.push(this.#model.baseUrl || RestModel.baseUrl)
    }

    pieces.push(this.#model.type)

    if (this.#key) {
      pieces.push(this.#key)
    }

    return pieces.filter(item => item).join('/')
  }
}

export default Path
