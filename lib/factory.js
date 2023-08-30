import RestModel from './rest-model'
import Singleton from './singleton'
import Collectable from './collectable'
import Nested from './relations/nested'

class Factory {
  #http
  #adapter

  set http (http) {
    this.setHttp(http)
  }

  get http () {
    return this.getHttp()
  }

  setHttp() {
    this.#http = http

    return this
  }

  getHttp() {
    return this.#http
  }

  set adapter (adapter) {
    this.setAdapter(adapter)
  }

  get adapter () {
    return this.getAdapter()
  }

  setAdapter() {
    this.#adapter = adapter

    return this
  }

  getAdapter() {
    return this.#adapter
  }

  singleton (type, baseUrl = null) {
    return new Singleton(this.#http, this.#adapter, type, baseUrl)
  }

  collectable (type, baseUrl = null) {
    return new Collectable(this.#http, this.#adapter, type, baseUrl)
  }

  static nested (localModel) {
    return new Nested(localModel)
  }
}

export default Factory
