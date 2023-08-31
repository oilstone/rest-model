import Registry from './registry'
import Factory from './factory'
import Adapter from './adapters/json-api/adapter';

class RestModel {
  #registry = new Registry()
  #factory = new Factory()

  constructor () {
    this.#factory.setRegistry(
      this.#registry
    ).setAdapter(
      new Adapter()
    )

    this.#registry.setFactory(
      this.#factory
    )
  }

  setBaseUrl (url) {
    this.#factory.setBaseUrl(url)

    return this
  }

  setHttp (http) {
    this.#factory.setHttp(http)

    return this
  }

  setAdapter (adapter) {
    this.#factory.setAdapter(adapter)

    return this
  }

  getAdapter () {
    return this.#factory.getAdapter()
  }

  setAccessToken (accessToken) {
    this.#factory.getAdapter().setAccessToken(accessToken)

    return this
  }

  getAccessToken () {
    return this.#factory.getAdapter().getAccessToken()
  }

  register (name, callback) {
    this.#registry.add(name, callback)

    return this
  }

  resolve (name) {
    return this.#registry.get(name)
  }

  addRequestInterceptor (onFulfilled, onRejected) {
    this.#factory.getHttp().interceptors.request.use(onFulfilled, onRejected)
  }

  addResponseInterceptor (onFulfilled, onRejected) {
    this.#factory.getHttp().response.use(onFulfilled, onRejected)
  }
}

export default RestModel
