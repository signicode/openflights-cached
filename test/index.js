#!/usr/bin/env node

const assert = require("assert");


assert.doesNotThrow(() => {
    require("../array");
    require("../icao");
    require("../iata");
    require("../");
});

(() => {
    const openflights = require("../array");
    const myAirport = openflights.find(({iata}) => iata === "WAW"); // -> Warsaw Chopin

    assert.deepStrictEqual(
        myAirport,
        {"airportid":"679","name":"Warsaw Chopin Airport","city":"Warsaw","country":"Poland","iata":"WAW","icao":"EPWA","latitude":"52.1656990051","longitude":"20.967100143399996","altitude":"362","timezone":"1","dst":"E","tz":"Europe/Warsaw","type":"airport","source":"OurAirports"},
        "Should return Warsaw!"
    );


})();

(() => {
    const openflights = require("../icao");
    const myAirport = openflights["EHAM"] // -> Amsterdam Schiphol

    assert.deepStrictEqual(
        myAirport,
        {"airportid":"580","name":"Amsterdam Airport Schiphol","city":"Amsterdam","country":"Netherlands","iata":"AMS","icao":"EHAM","latitude":"52.308601","longitude":"4.76389","altitude":"-11","timezone":"1","dst":"E","tz":"Europe/Amsterdam","type":"airport","source":"OurAirports"},
        "Should return Amsterdam!"
    );
})();


(() => {
    const openflights = require("../iata");
    const myAirport = openflights["JFK"] // -> New York, JFK

    assert.deepStrictEqual(
        myAirport,
        {"airportid":"3797","name":"John F Kennedy International Airport","city":"New York","country":"United States","iata":"JFK","icao":"KJFK","latitude":"40.63980103","longitude":"-73.77890015","altitude":"13","timezone":"-5","dst":"A","tz":"America/New_York","type":"airport","source":"OurAirports"},
        "Should return JFK!"
    );
})();
