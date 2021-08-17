import Record from './record';
import RestModel from "../rest-model";

class Singleton extends Record {
    $save() {
        this.$model.events.fire('updating', this);

        if (!this._dirty) {
            return Promise.resolve(this);
        }

        return this.$model.http.patch(
            this.$path.resolve(),
            RestModel.adapter.repack(this.$model, this),
            {headers: RestModel.adapter.headers()}
        ).then(response => {
            this.$fill(RestModel.adapter.unpack(this.$model, response));
            this.$model.events.fire('updated', this);

            return this;
        }).catch(error => {
            throw RestModel.adapter.unpack(this.$model, error.response);
        });
    }
}

export default Singleton;