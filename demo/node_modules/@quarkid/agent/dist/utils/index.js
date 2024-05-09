"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchParam = void 0;
const getSearchParam = (key, url) => {
    if (!url.includes(key))
        return null;
    try {
        return url.split(`${key}=`)[1].split('&')[0];
    }
    catch (e) {
        return null;
    }
};
exports.getSearchParam = getSearchParam;
//# sourceMappingURL=index.js.map