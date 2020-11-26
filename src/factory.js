import axios from 'axios';
import Collectable from './collectable';
import Nested from './relations/nested';

class Factory {
    static collectable(url) {
        return new Collectable(axios, url);
    }

    static nested(localModel) {
        return new Nested(localModel);
    }
}

export default Factory;