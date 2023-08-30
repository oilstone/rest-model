import Query from './query'

class Singleton extends Query {
  find () {
    this.model.events.fire('fetching', this)

    return this.model.http.get(this.path.resolve(), this.buildRequestConfig()).then(response => {
      const record = this.model.hydrateOne(this.model.adapter.unpack(this.model, response))

      this.model.events.fire('fetched', record)

      return record
    }).catch(error => {
      throw this.model.adapter.unpack(this.model, error.response)
    })
  }
}

export default Singleton
