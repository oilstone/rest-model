import Relation from './relation'
import Path from '../path';

class Nested extends Relation {
    query(scope) {
        let query = this.foreignModel.query();

        query.path.prepend(
            this.#scopedParentPath(scope)
        );

        return query;
    }

    record(scope, attributes) {
        let record = this.foreignModel.record(attributes);

        record.$path.prepend(
            this.#scopedParentPath(scope)
        );

        return record;
    }

    collection(scope, items) {
        return items.map(item => {
            return this.record(scope, item);
        })
    }

    destroy(id) {
        return this.record().$fill({id}).$destroy();
    }

    #scopedParentPath(scope) {
        return new Path(this.localModel).setKey(scope.recordScope.key);
    }
}

export default Nested;
