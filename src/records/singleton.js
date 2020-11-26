import Record from './record';
import Model from '../model';
import RestModel from "../rest-model";

class Singleton extends Record {
    $save() {
        this.$model.events.fire('updating', this);

        return this.$model.http.patch(
            this.$path.resolve(),
            RestModel.adapter.repack(this.$model, this)
        ).then(response => {
            this.$fill(RestModel.adapter.unpack(response));

            this.$model.events.fire('updated', this);

            return this;
        }).catch(error => {
            throw RestModel.adapter.unpack(error.response);
        });
    }
}

export default Singleton;
