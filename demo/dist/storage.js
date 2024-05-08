"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemStorage = exports.FileSystemAgentSecureStorage = exports.MemorySecureStorage = exports.MemoryStorage = void 0;
const fs_1 = require("fs");
class MemoryStorage {
    constructor() {
        this.mapper = new Map();
    }
    async add(key, value) {
        this.mapper.set(key, value);
    }
    async get(key) {
        return this.mapper.get(key);
    }
    async update(key, value) {
        this.mapper.set(key, value);
    }
    async getAll() {
        return this.mapper;
    }
    async remove(key) {
        this.mapper.delete(key);
    }
}
exports.MemoryStorage = MemoryStorage;
class MemorySecureStorage {
    constructor() {
        this.mapper = new Map();
    }
    async add(key, value) {
        this.mapper.set(key, value);
    }
    async get(key) {
        return this.mapper.get(key);
    }
    async getAll() {
        return this.mapper;
    }
    async update(key, value) {
        this.mapper.set(key, value);
    }
    async remove(key) {
        this.mapper.delete(key);
    }
}
exports.MemorySecureStorage = MemorySecureStorage;
class FileSystemAgentSecureStorage {
    constructor(params) {
        this.filepath = params.filepath;
    }
    async add(key, data) {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }
    async get(key) {
        return this.getData().get(key);
    }
    async getAll() {
        return this.getData();
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
class FileSystemStorage {
    constructor(params) {
        this.filepath = params.filepath;
    }
    async update(key, value) {
        const map = this.getData();
        map.set(key, value);
        this.saveData(map);
    }
    async getAll() {
        return this.getData();
    }
    async remove(key) {
        const map = this.getData();
        map.delete(key);
        this.saveData(map);
    }
    async add(key, data) {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }
    async get(key) {
        return this.getData().get(key);
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
exports.FileSystemStorage = FileSystemStorage;
//# sourceMappingURL=storage.js.map