import Record from './record';
import RestModel from "../rest-model";

class Collectable extends Record {
    #create() {
        this.$model.events.fire('creating', this);

        return this.$model.http.post(
            this.$path.resolve(),
            RestModel.adapter.repack(this.$model, this)
        ).then(response => {
            this.$fill(RestModel.adapter.unpack(response));

            this.$model.events.fire('created', this);

            return this;
        }).catch(error => {
            throw RestModel.adapter.unpack(error.response);
        });
    }

    #update() {
        this.$model.events.fire('updating', this);

        return this.$model.getHttp().patch(
            this.$path.setKey(this[this.$model.primaryKey]).resolve(),
            RestModel.adapter.repack(this.$model, this)
        ).then(response => {
            this.$fill(RestModel.adapter.unpack(response));

            this.$model.events.fire('updated', this);

            return this;
        }).catch(error => {
            throw RestModel.adapter.unpack(error.response);
        });
    }

    $save() {
        return this.$resolved() ? this.#update() : this.#create();
    }

    $destroy() {
        if (this.$resolved()) {
            this.$model.events.fire('deleting', this);

            return this.$model.http.delete(
                this.$path.setKey(this[this.$model.primaryKey]).resolve()
            ).then(() => {
                this.$model.events.fire('deleted', this);

                return true;
            }).catch(error => {
                throw RestModel.adapter.unpack(error.response);
            });
        }
    }

    $resolved() {
        return (this.$model.primaryKey in this && this[this.$model.primaryKey]);
    }
}

export default Collectable;