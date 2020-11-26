import Relation from './relation'
import Path from '../path';

class Nested extends Relation {
    query(scope) {
        let query = this.foreignModel.query();

        query.path.prepend(
            new Path(this.localModel).setKey(scope.recordScope.key)
        );

        return query;
    }
}

export default Nested;