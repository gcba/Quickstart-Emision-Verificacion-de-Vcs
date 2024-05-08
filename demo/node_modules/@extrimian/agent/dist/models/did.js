"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DID = void 0;
const base_64_1 = require("base-64");
class DID {
    constructor(did) {
        if (this.validate(did)) {
            this.value = did;
        }
    }
    /**
     * This method converts a string value or full verification method id to a data value DID object.
     *
     * @param did - DID input. This value can also be a full verification method id.
     * @returns Data value object that represent a DID
     */
    static from(did) {
        if ((did === null || did === void 0 ? void 0 : did.indexOf('#')) > -1) {
            return new DID(did.substring(0, did.indexOf('#')));
        }
        return new DID(did);
    }
    validate(did) {
        return true;
    }
    getDidMethod() {
        return this.value.substring(0, this.value.lastIndexOf(':'));
    }
    isEqual(other) {
        // Lógica de comparación personalizada aquí
        // Compara los atributos relevantes de los objetos y devuelve true si son iguales, false en caso contrario
        return this.value == other.value;
    }
    isLongDIDFor(shortDID) {
        return !shortDID.isLongDID() && this.isLongDID() && this.value.indexOf(shortDID.value) != -1;
    }
    isShortDIDFor(longDID) {
        return longDID.isLongDIDFor(this);
    }
    getDIDSuffix() {
        return this.isLongDID() ? this.getLongDIDSuffix() : this.value.substring(this.value.lastIndexOf(":") + 1);
    }
    getLongDIDSuffix() {
        const ultimoIndice = this.value.lastIndexOf(":");
        if (ultimoIndice === -1) {
            return null;
        }
        const index = this.value.lastIndexOf(":", ultimoIndice - 1);
        return this.value.substring(index + 1);
    }
    isLongDID() {
        try {
            const lastSegment = this.value.substring(this.value.lastIndexOf(':') + 1);
            const data = (0, base_64_1.decode)(lastSegment);
            const obj = JSON.parse(data);
            return obj.delta != null;
        }
        catch (_a) {
            return false;
        }
    }
}
exports.DID = DID;
//# sourceMappingURL=did.js.map