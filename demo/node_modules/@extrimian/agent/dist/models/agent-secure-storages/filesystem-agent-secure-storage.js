"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemAgentSecureStorage = void 0;
const fs_1 = require("fs");
class FileSystemAgentSecureStorage {
    constructor(params) {
        this.filepath = params.filepath;
    }
    add(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const map = this.getData();
            map.set(key, data);
            this.saveData(map);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getData().get(key);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getData();
        });
    }
    update(key, data) {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }
    remove(key) {
        const map = this.getData();
        map.delete(key);
        this.saveData(map);
    }
    getData() {
        if (!(0, fs_1.existsSync)(this.filepath)) {
            return new Map();
        }
        const file = (0, fs_1.readFileSync)(this.filepath, {
            encoding: "utf-8",
        });
        if (!file) {
            return new Map();
        }
        return new Map(Object.entries(JSON.parse(file)));
    }
    saveData(data) {
        (0, fs_1.writeFileSync)(this.filepath, JSON.stringify(Object.fromEntries(data)), {
            encoding: "utf-8",
        });
    }
}
exports.FileSystemAgentSecureStorage = FileSystemAgentSecureStorage;
//# sourceMappingURL=filesystem-agent-secure-storage.js.map