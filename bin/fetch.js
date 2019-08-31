#!/usr/bin/env node

/** eslint-disable node/shebang */

const fs = require("fs");
const {resolve} = require("path");
const {StringStream, DataStream} = require("scramjet");
const {promisify} = require("util");

const {get} = require("https");

(async () => {
    const out = await new Promise(
        s => get("https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat", (stream) => s(stream))
    );

    const columns = [
        "airportid", //	Unique OpenFlights identifier for this airport.
        "name",  //	Name of airport. May or may not contain the City name.
        "city",  //	Main city served by airport. May be spelled differently from Name.
        "country",   //	Country or territory where airport is located. See countries.dat to cross-reference to ISO 3166-1 codes.
        "iata",  //	3-letter IATA code. Null if not assigned/unknown.
        "icao",  //	4-letter ICAO code.
        "latitude",  //	Decimal degrees, usually to six significant digits. Negative is South, positive is North.
        "longitude", //	Decimal degrees, usually to six significant digits. Negative is West, positive is East.
        "altitude",  //	In feet.
        "timezone",  //	Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5.
        "dst",   //	Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown). See also: Help: Time
        "tz",    // database time zone	Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".
        "type",  //	Type of the airport. Value "airport" for air terminals, "station" for train stations, "port" for ferry terminals and "unknown" if not known. In airports.csv, only type=airport is included.
        "source",    //	Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions. In airports.csv, only source=OurAirports is included.
    ];

    /**
     * @type {DataStream}
     */
    const stream = StringStream.from(out, {})
        .CSVParse()
        .map(x => x.slice().map(col => col === "\\N" ? "" : col))
        .map(x => {
            const out = {};
            for (let i = 0; i < columns.length; i++) out[columns[i]] = x[i];

            return out;
        });

    stream.tap();

    return Promise.all([
        new Promise((s, j) => stream.pipe(new DataStream({}), {}).toJSONArray().pipe(fs.createWriteStream(resolve(__dirname, "../dist/array.json"))).on("finish", s).on("error", j)),
        new Promise((s, j) => stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONArray(["{\n","\n}"], ",\n", item => `"${item.iata}": "${item.icao}"`).pipe(fs.createWriteStream(resolve(__dirname, "../dist/iata2icao.json"))).on("finish", s).on("error", j)),
        new Promise((s, j) => stream.pipe(new DataStream({}), {}).map(item => item.icao).toJSONArray().pipe(fs.createWriteStream(resolve(__dirname, "../dist/icaos.json"))).on("finish", s).on("error", j)),
        new Promise((s, j) => stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONObject(item => item.iata).pipe(fs.createWriteStream(resolve(__dirname, "../dist/iata.json"))).on("finish", s).on("error", j)),
        new Promise((s, j) => stream.pipe(new DataStream({}), {}).filter(item => item.icao).toJSONObject(item => item.icao).pipe(fs.createWriteStream(resolve(__dirname, "../dist/icao.json"))).on("finish", s).on("error", j)),
        stream.each(airport => promisify(fs.writeFile)(resolve(__dirname, `../dist/icaos/${airport.icao}.json`), JSON.stringify(airport), {flag:"w+"})).run(),
    ]);
})()
    .then(
        () => 0,
        (e) => {
            throw e;
        }
    );
