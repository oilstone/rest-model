import Singleton from './singleton'
import Collectable from './collectable'

class Factory {
  #registry
  #http
  #adapter
  #baseUrl = null

  set registry (registry) {
    this.setRegistry(registry)
  }

  get registry () {
    return this.getRegistry()
  }

  set http (http) {
    this.setHttp(http)
  }

  get http () {
    return this.getHttp()
  }

  set adapter (adapter) {
    this.setAdapter(adapter)
  }

  get adapter () {
    return this.getAdapter()
  }

  set baseUrl (url) {
    this.setBaseUrl(url)
  }

  get baseUrl () {
    return this.getBaseUrl()
  }

  setRegistry(registry) {
    this.#registry = registry

    return this
  }

  getRegistry() {
    return this.#registry
  }

  setHttp(http) {
    this.#http = http

    return this
  }

  getHttp() {
    return this.#http
  }

  setBaseUrl (url) {
    this.#baseUrl = url

    return this
  }

  getBaseUrl () {
    return this.#baseUrl
  }

  setAdapter(adapter) {
    this.#adapter = adapter

    return this
  }

  getAdapter() {
    return this.#adapter
  }

  singleton (type, baseUrl = null) {
    return new Singleton(this.#registry, this.#http, this.#adapter, type, baseUrl || this.#baseUrl)
  }

  collectable (type, baseUrl = null) {
    return new Collectable(this.#registry, this.#http, this.#adapter, type, baseUrl || this.#baseUrl)
  }
}

export default Factory
