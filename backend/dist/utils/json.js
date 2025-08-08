"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonWithBigInt = jsonWithBigInt;
function jsonWithBigInt(data) {
    return JSON.stringify(data, (_, value) => typeof value === 'bigint' ? value.toString() : value);
}
//# sourceMappingURL=json.js.map