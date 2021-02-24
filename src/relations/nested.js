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

    record(scope) {
        let record = this.foreignModel.record();

        record.$path.prepend(
            this.#scopedParentPath(scope)
        );

        return record;
    }

    #scopedParentPath(scope) {
        return new Path(this.localModel).setKey(scope.recordScope.key);
    }
}

export default Nested;