import axios from 'axios';
import Singleton from './singleton';
import Collectable from './collectable';
import Nested from './relations/nested';

class Factory {
    static singleton(type, baseUrl = null) {
        return new Singleton(axios, type, baseUrl);
    }

    static collectable(type, baseUrl = null) {
        return new Collectable(axios, type, baseUrl);
    }

    static nested(localModel) {
        return new Nested(localModel);
    }
}

export default Factory;