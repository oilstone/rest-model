import Model from './model'
import Query from './queries/collectable'
import Record from './records/collectable'
import Path from './path'
import Collection from './collection'

class Collectable extends Model {
  queryBuilder () {
    return new Query(this, new Path(this))
  }

  newRecord () {
    return new Record(this)
  }

  create (attributes) {
    return this.record(attributes).$save()
  }

  hydrateMany (data) {
    const collection = this.collection([]).setMeta(data.meta)

    if (!Array.isArray(data.items)) {
      return collection
    }

    data.items.forEach(item => {
      collection.push(
        this.hydrateOne(item)
      )
    })

    return collection
  }

  collection (data) {
    const collection = new Collection()

    data.forEach(record => {
      collection.push(this.record(record))
    })

    return collection
  }

  all () {
    return this.query().get()
  }

  destroy (id) {
    return this.newRecord().$fill({ id }).$destroy()
  }
}

export default Collectable
