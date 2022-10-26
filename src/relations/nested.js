import Relation from './relation'
import Path from '../path';
import Collection from '../collection';

class Nested extends Relation {
    query(scope) {
        let query = this.foreignModel.query();

        query.path.prepend(
            this.#scopedParentPath(scope)
        );

        return query;
    }

    hydrateOne(scope, data) {
        return this.record(scope, data.attributes).$setMeta(data.meta);
    }

    record(scope, attributes) {
        let record = this.foreignModel.record(attributes);

        record.$path.prepend(
            this.#scopedParentPath(scope)
        );

        return record;
    }

    collection(scope, items) {
        const collection = new Collection();

        items.forEach(item => {
            collection.push(this.record(scope, item));
        });

        return collection;
    }

    hydrateMany(scope, data) {
        const collection = this.collection(scope,[]).setMeta(data.meta);

        data.items.forEach(item => {
            collection.push(
                this.hydrateOne(scope, item)
            );
        });

        return collection;
    }

    destroy(scope, id) {
        return this.record(scope, {id}).$destroy();
    }

    #scopedParentPath(scope) {
        return new Path(this.localModel).setKey(scope.recordScope.key);
    }
}

export default Nested;
