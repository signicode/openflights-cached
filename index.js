const lazy = {
    iata: null,
    array: null,
    icao: null,
    icaos: null,
    iata2icao: null,
    entries: {}
};

const requireicao = (id) => self.icaos.includes(id) && require(`./dist/icaos/${id.substr(0,1)}/${id}.json`);

const index = (aoo) => {
    const entries = Array.isArray(aoo) ? aoo : Object.values(aoo);
    entries.filter(({icao}) => !(icao in lazy.entries)).forEach(entry => lazy.entries[entry.icao] = entry);
    return aoo;
};

const self = module.exports = {
    get iata() { return lazy.iata || index(lazy.iata = require("./iata")); },
    get icao() { return lazy.icao || index(lazy.icao = require("./icao")); },
    get array() { return lazy.array || index(lazy.array = require("./array")); },
    get icaos() { return lazy.icaos || (lazy.icaos = require("./icaos")); },
    get iata2icao() { return lazy.iata2icao || (lazy.iata2icao = require("./iata2icao")); },
    findICAO(id) { return id && self.icaos.includes(id) && lazy.entries[id] || (lazy.entries[id] = requireicao(id)); },
    findIATA(id) { return self.findICAO(self.iata2icao[id]); }
};
