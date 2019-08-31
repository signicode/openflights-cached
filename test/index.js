#!/usr/bin/env node

/** eslint-disable node/shebang */

const assert = require("assert");
const si = require("si");

const mem0 = process.memoryUsage().rss;

assert.doesNotThrow(() => {
    // @ts-ignore
    const main = require("../");
    require("../iata2icao");
    require("../icaos");

    main.findIATA("WDU");
    main.findICAO("LFPG");

    const mem1 = process.memoryUsage().rss;

    require("../icao");
    require("../iata");
    const mem2 = process.memoryUsage().rss;

    if (mem1 - mem0 > 3000000) throw new Error(`Large data should not be loaded with main module mem0=${mem0}, mem1=${mem1}, diff=${mem1-mem0}`);
    // @ts-ignore
    console.error(`✔ lazy memory usage test passed usage=${si.bin.format(mem1-mem0)}`);

    if (mem2 - mem1 < 10000000) throw new Error(`Large data should load on direct exports mem1=${mem1}, mem2=${mem2}, diff=${mem2-mem1}`);
    // @ts-ignore
    console.error(`✔ lazy memory usage test passed usage=${si.bin.format(mem2-mem0)} diff=${si.bin.format(mem2-mem1)}`);
});

(() => {
    // @ts-ignore
    const {findIATA, findICAO, array, iata, icao, icaos, iata2icao} = require("../");

    assert.strictEqual(typeof findIATA, "function", "Should expose findIATA as function");
    assert.strictEqual(typeof findICAO, "function", "Should expose findICAO as function");

    assert.ok(Array.isArray(array), "Should expose array");
    assert.strictEqual(typeof icao, "object", "Should expose icao as function");
    assert.strictEqual(typeof iata, "object", "Should expose iata as function");
    assert.ok(Array.isArray(icaos), "Should expose findICAO as function");
    assert.strictEqual(typeof iata2icao, "object", "Should expose findICAO as function");

    assert.strictEqual(array, require("../array"), "Must expose array key as the same object as the module");
    assert.strictEqual(iata, require("../iata"), "Must expose iata key as the same object as the module");
    assert.strictEqual(icao, require("../icao"), "Must expose icao key as the same object as the module");
    assert.strictEqual(icaos, require("../icaos"), "Must expose icaos key as the same object as the module");
    assert.strictEqual(iata2icao, require("../iata2icao"), "Must expose iata2icao key as the same object as the module");

    const mem1 = process.memoryUsage().rss;
    // @ts-ignore
    console.error(`✔ module main checks completed usage=${si.bin.format(mem1-mem0)}`);
})();

(() => {
    const openflights = require("../iata2icao");
    const myAirport = openflights["TKU"]; // -> Warsaw Chopin

    assert.strictEqual(
        myAirport,
        "EFTU",
        "Should return ICAO for Turku, Finland!"
    );
    console.error("✔ iata2icso test succeeded");
})();

(() => {
    const openflights = require("../array");
    const myAirport = openflights.find(({iata}) => iata === "WAW"); // -> Warsaw Chopin

    assert.deepStrictEqual(
        myAirport,
        {"airportid":"679","name":"Warsaw Chopin Airport","city":"Warsaw","country":"Poland","iata":"WAW","icao":"EPWA","latitude":"52.1656990051","longitude":"20.967100143399996","altitude":"362","timezone":"1","dst":"E","tz":"Europe/Warsaw","type":"airport","source":"OurAirports"},
        "Should return Warsaw!"
    );
    console.error("✔ array test succeeded");
})();

(() => {
    const openflights = require("../icao");
    const myAirport = openflights["EHAM"]; // -> Amsterdam Schiphol

    assert.deepStrictEqual(
        myAirport,
        {"airportid":"580","name":"Amsterdam Airport Schiphol","city":"Amsterdam","country":"Netherlands","iata":"AMS","icao":"EHAM","latitude":"52.308601","longitude":"4.76389","altitude":"-11","timezone":"1","dst":"E","tz":"Europe/Amsterdam","type":"airport","source":"OurAirports"},
        "Should return Amsterdam!"
    );
    console.error("✔ icao test succeeded");
})();

(() => {
    const openflights = require("../iata");
    const myAirport = openflights["JFK"]; // -> New York, JFK

    assert.deepStrictEqual(
        myAirport,
        {"airportid":"3797","name":"John F Kennedy International Airport","city":"New York","country":"United States","iata":"JFK","icao":"KJFK","latitude":"40.63980103","longitude":"-73.77890015","altitude":"13","timezone":"-5","dst":"A","tz":"America/New_York","type":"airport","source":"OurAirports"},
        "Should return JFK!"
    );
    console.error("✔ iata test succeeded");
})();
