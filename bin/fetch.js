#!/usr/bin/env node

/** eslint-disable node/shebang */

const OPENFLIGHTS_URL = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const WAIT_BETWEEN_ATTEMPTS = 1e4;

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
    const fetch = () => new Promise(s => get(OPENFLIGHTS_URL, stream => s(stream)).end());

    const columns = [
        "airportid", "name", "city", "country", "iata", "icao", "latitude", "longitude", "altitude", "timezone", "dst", "tz", "type", "source"
    ];

    const stream = StringStream.from(async function() {
        let retries = 5;
        while (retries-- > 0) {
            /** @type {import("http").IncomingMessage} */
            const ret = await fetch();
            if (ret.statusCode >= 200 && ret.statusCode < 300)
                return ret;
            if (ret.statusCode >= 400 && ret.statusCode < 500)
                throw new Error("400 error!");
            await new Promise(s => setTimeout(s, WAIT_BETWEEN_ATTEMPTS));

            console.error("Retry...");
        }
        throw new Error("Too many errors...");
    }, {})
        .CSVParse()
        .batch(100)
        .map(arr => {
            return arr.map(x => {
                const out = {};
                for (let i = 0; i < columns.length; i++) {
                    const col = x[i];
                    out[columns[i]] = col === "\\N" ? "" : col;
                }

                return out;
            });
        })
        .flatten()
    ;

    const dirs = {};

    const distDir = resolve(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    return Promise.all([
        awaitWritten(stream.pipe(new DataStream({}), {}).toJSONArray(), "../dist/array.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONArray(
            // @ts-ignore
            ["{\n","\n}"], ",\n", item => `"${item.iata}": "${item.icao}"`
        ), "../dist/iata2icao.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).map(item => item.icao).toJSONArray(), "../dist/icaos.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONObject(item => item.iata), "../dist/iata.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.icao).toJSONObject(item => item.icao), "../dist/icao.json"),
        stream.consume(async airport => {
            const dir = resolve(__dirname, `../dist/icaos/${airport.icao.substr(0, 1)}`);
            if (!dirs[dir]) {
                dirs[dir] = promisify(fs.stat)(dir)
                    .catch(() => null)
                    .then(exists => exists || promisify(fs.mkdir)(dir, { recursive: true }));
            }
            await dirs[dir];
            await promisify(fs.writeFile)(resolve(dir, `${airport.icao}.json`), JSON.stringify(airport), {flag:"w+"});
        })
    ]);
})()
    .then(
        () => new Promise(res => setTimeout(res, 1000)),
        (e) => { throw e; }
    );
