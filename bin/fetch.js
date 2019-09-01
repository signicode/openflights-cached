#!/usr/bin/env node

/** eslint-disable node/shebang */

const fs = require("fs");
const {resolve} = require("path");
const {StringStream, DataStream} = require("scramjet");
const {promisify} = require("util");

const {get} = require("https");

const awaitWritten = (stream, path) => {
    return new Promise(
        (s, j) => stream
            .pipe(fs.createWriteStream(resolve(__dirname, path)))
            .on("finish", s).on("error", j)
    );
};

(async () => {
    const out = await new Promise(
        s => get("https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat", (stream) => s(stream)).end()
    );

    const columns = [
        "airportid", "name", "city", "country", "iata", "icao", "latitude", "longitude", "altitude", "timezone", "dst", "tz", "type", "source"
    ];

    let i = 0; let j = 0;
    const stream = StringStream.from(out, {})
        .CSVParse()
        .each(() => j++)
        .map(x => x.map(col => col === "\\N" ? "" : col))
        .map(x => {
            const out = {};
            for (let i = 0; i < columns.length; i++) out[columns[i]] = x[i];

            return out;
        })
        .each(() => i++)
    ;

    return Promise.all([
        awaitWritten(stream.pipe(new DataStream({}), {}).toJSONArray(), "../dist/array.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONArray(
            // @ts-ignore
            ["{\n","\n}"], ",\n", item => `"${item.iata}": "${item.icao}"`
        ), "../dist/iata2icao.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).map(item => item.icao).toJSONArray(), "../dist/icaos.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONObject(item => item.iata), "../dist/iata.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.icao).toJSONObject(item => item.icao), "../dist/icao.json"),
        stream.consume(airport => promisify(fs.writeFile)(resolve(__dirname, `../dist/icaos/${airport.icao}.json`), JSON.stringify(airport), {flag:"w+"}))
    ]);
})()
    .then(
        () => new Promise(res => setTimeout(res, 1000)),
        (e) => { throw e; }
    );
