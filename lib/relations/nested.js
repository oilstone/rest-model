import Relation from './relation'
import Path from '../path'
import Collection from '../collection'

class Nested extends Relation {
  query (scope) {
    const query = this.foreignModel.query()

    query.path.prepend(
      this.#scopedParentPath(scope)
    )

    return query
  }

  hydrateOne (scope, data) {
    const record = this.foreignModel.hydrateOne(data)

    record.$path.prepend(
      this.#scopedParentPath(scope)
    )

    return record
  }

  record (scope, attributes) {
    const record = this.foreignModel.record(attributes)

    record.$path.prepend(
      this.#scopedParentPath(scope)
    )

    return record
  }

  collection (scope, items) {
    const collection = new Collection()

    items.forEach(item => {
      collection.push(this.record(scope, item))
    })

    return collection
  }

  hydrateMany (scope, data) {
    const collection = new Collection().setMeta(data.meta)

    data.items.forEach(item => {
      collection.push(
        this.hydrateOne(scope, item)
      )
    })

    return collection
  }

  destroy (scope, id) {
    return this.record(scope, { id }).$destroy()
  }

  #scopedParentPath (scope) {
    return new Path(this.localModel).setKey(scope.recordScope.key)
  }
}

export default Nested
