#!/usr/bin/env node

/** eslint-disable node/shebang */

// Airlines adaption

const DIGITS_AND_LETTERS = /^[0-9a-zA-Z]+$/;

const OPENFLIGHTS_URL = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";
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
        "airlineid", "name", "alias", "iata", "icao", "callsign", "country", "active"
    ];
    
    let i = 0; let j = 0;
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
        .each(() => j++)
        .map(x => x.map(col => col === "\\N" ? "" : col))
        .map(x => {
            const out = {};
            for (let i = 0; i < columns.length; i++) {
                if (i === 3 || i === 4) {
                    // Ignore bad iatas and icaos.
                    if(!x[i].match(DIGITS_AND_LETTERS)) x[i] = "";
                }
                out[columns[i]] = x[i];
            }

            return out;
        })
        .each(() => i++)
    ;

    const dirs = {};

    return Promise.all([
        awaitWritten(stream.pipe(new DataStream({}), {}).toJSONArray(), "../dist/airlines/array.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONArray(
            // @ts-ignore
            ["{\n","\n}"], ",\n", item => `"${item.iata}": "${item.icao}"`
        ), "../dist/airlines/iata2icao.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).map(item => item.icao).toJSONArray(), "../dist/airlines/icaos.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.iata).toJSONObject(item => item.iata), "../dist/airlines/iata.json"),
        awaitWritten(stream.pipe(new DataStream({}), {}).filter(item => item.icao).toJSONObject(item => item.icao), "../dist/airlines/icao.json"),
        stream.consume(async airline => {
            const dir = resolve(__dirname, `../dist/airlines/icaos/${airline.icao.substr(0, 1)}`);
            if (!dirs[dir]) {
                dirs[dir] = promisify(fs.stat)(dir)
                    .catch(() => null)
                    .then(exists => exists || promisify(fs.mkdir)(dir));
            }
            await dirs[dir];
            await promisify(fs.writeFile)(resolve(dir, `${airline.icao}.json`), JSON.stringify(airline), {flag:"w+"});
        })
    ]);
})()
    .then(
        () => new Promise(res => setTimeout(res, 1000)),
        (e) => { throw e; }
    );
