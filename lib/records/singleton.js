import Record from './record'

class Singleton extends Record {
  $save () {
    this.$model.events.fire('updating', this)

    if (!this._dirty) {
      return Promise.resolve(this)
    }

    return this.$model.http.patch(
      this.$path.resolve(),
      this.$model.adapter.repack(this.$model, this),
      { headers: this.$model.adapter.headers() }
    ).then(response => {
      this.$fill(this.$model.adapter.unpack(this.$model, response).attributes)
      this.$model.events.fire('updated', this)

      return this
    }).catch(error => {
      throw this.$model.adapter.unpack(this.$model, error.response)
    })
  }
}

export default Singleton
