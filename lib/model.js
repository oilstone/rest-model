import { Dispatcher } from '@oilstone/events'
import { Blender } from '@oilstone/blender'
import Aggregate from './relations/aggregate'
import Nested from './relations/nested'
import RecordScope from './scopes/record'

class Model {
  #registry

  #http

  #adapter

  #type

  #baseUrl

  #events = new Dispatcher()

  #relations = new Aggregate()

  #mixins = {
    query: {},
    record: {}
  }

  #primaryKey = 'id'

  constructor (registry, http, adapter, type, baseUrl = null) {
    this.#registry = registry
    this.#http = http
    this.#adapter = adapter
    this.#type = type
    this.#baseUrl = baseUrl
  }

  get registry () {
    return this.getRegistry()
  }

  getRegistry () {
    return this.#registry
  }

  get http () {
    return this.getHttp()
  }

  getHttp () {
    return this.#http
  }

  get adapter () {
    return this.getAdapter()
  }

  getAdapter () {
    return this.#adapter
  }

  get type () {
    return this.getType()
  }

  getType () {
    return this.#type
  }

  set type (type) {
    return this.setType(type)
  }

  setType (type) {
    this.#type = type

    return this
  }

  get baseUrl () {
    return this.getBaseUrl()
  }

  getBaseUrl () {
    return this.#baseUrl
  }

  set baseUrl (url) {
    return this.setBaseUrl(url)
  }

  setBaseUrl (url) {
    this.#baseUrl = url

    return this
  }

  get events () {
    return this.getEvents()
  }

  getEvents () {
    return this.#events
  }

  get relations () {
    return this.getRelations()
  }

  getRelations () {
    return this.#relations
  }

  get primaryKey () {
    return this.getPrimaryKey()
  }

  getPrimaryKey () {
    return this.#primaryKey
  }

  set primaryKey (value) {
    this.setPrimaryKey(value)
  }

  setPrimaryKey (key) {
    this.#primaryKey = key

    return this
  }

  mix (mixins) {
    if ('model' in mixins) {
      Blender.on(this).mix(mixins.model)
      delete mixins.model
    }

    for (const prop in mixins) {
      if (prop in this.#mixins) {
        this.#mixins[prop] = Blender.mix(this.#mixins[prop], mixins[prop])
      }
    }

    return this
  }

  observe (observer) {
    this.#events.listen(observer)
  }

  hydrateOne (data) {
    this.#events.fire('hydratingOne', data.attributes)

    // noinspection JSUnresolvedFunction
    const record = this.newRecord().$fill(data.attributes).$setMeta(data.meta)
    const scope = this.scope(record[this.getPrimaryKey()])

    for (const key in data.relations) {
      record.$setRelation(
        key,
        scope.resolve(key).hydrate(data.relations[key])
      )
    }

    this.#events.fire('hydratedOne', record)

    return record.$mix(this.#mixins.record)
  }

  record (attributes) {
    this.#events.fire('making', attributes)

    // noinspection JSUnresolvedFunction
    const record = this.newRecord().$fill(attributes)

    this.#events.fire('made', record)

    return record.$mix(this.#mixins.record)
  }

  nest (name, callback = null) {
    this.#relations.register(name, () => {
      const relation = new Nested(this)

      this.#bootstrapRelation(name, relation, callback)

      return relation
    })

    return this
  }

  #bootstrapRelation (name, relation, callback) {
    if (callback) {
      callback(relation)
    }

    relation.setKey(name)

    if (!relation.binding) {
      relation.setBinding(name)
    }
  }

  query () {
    // noinspection JSUnresolvedFunction
    const builder = this.queryBuilder()

    return builder.mix(this.#mixins.query)
  }

  scope (key) {
    return new RecordScope(this).setKey(key)
  }
}

export default Model
