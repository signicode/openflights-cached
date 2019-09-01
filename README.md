# OpenFlights Cached

A module that fetches newest [OpenFlights](https://openflights.org/data.html) airport data upon install and exposes in simple API.

## Usage:

```
$ npm install -s openflights-cached
```

Remeber that the data is fetched upon installation so it's always fresh, but also needs a connection to the NPM repo.

## Module API

The module API exposes a number of methods allowing different ways to access OpenFlights data. The recommended ones are with the two lookup methods:

```javascript
const openflights = require("openflights-cached");

console.log(openflights.findIATA("PEK").name);
// -> Beijing Capital International Airport

console.log(openflights.findICAO("SBUA").country)
// -> Brazil
```

These methods use simple lookup methods without loading any large data sets.

### Exports

`openflights-cached` exports the following methods and properties:

* `findICAO(icao: string): OpenFlightsEntry` - find airport data for ICAO code
* `findIATA(iata: string): OpenFlightsEntry` - find airport data for IATA code
* `iata2icao: {[iata: string]: string}` - lazy loader for [`openflights-cached/iata2icao`](#IATA2ICAO)
* `icaos` - lazy loader for [`openflights-cached/icaos`](#ICAOs)
* `array` - lazy loader for [`openflights-cached/array`](#Array)
* `icao` - lazy loader for [`openflights-cached/icao`](#ICAO)
* `iata` - lazy loader for [`openflights-cached/iata`](#IATA)

### IATA2ICAO

`openflights-cached/iata2icao` exposes a simple hash of IATA keys and ICAO values.

```javascript
const openflights = require("openflights-cached/iata2icao");
//    ^^^^^^^^^^^ - this here's an object

const myAirport = openflights.BCN; // -> LEBL
```

### ICAOs

`openflights-cached/icaos` exposes a simple array of all ICAO ids.

```javascript
const openflights = require("openflights-cached/icaos");
//    ^^^^^^^^^^^ - this here's an array

const myAirport = openflights.includes('KLAS') // has Las Vegas
const myAirport = openflights.includes('KLAK') // this is a typo
```

### Array

`openflights-cached/array` exposes an array of all [OpenFlight entries](#Entry type) - the JSON is approx. 2.1 megs and will probably use approx. double the amount of memory.

```javascript
const openflights = require("openflights-cached/array");
//    ^^^^^^^^^^^ - this here's an array

const myAirport = openflights.find(({iata}) => iata === "WAW"); // -> Warsaw Chopin
```

## ICAO

`openflights-cached/icao` exposes an object of all [OpenFlight entries](#Entry+type) indexed by ICAO ids - the JSON is approx. 2.3 megs and will probably use approx. double the amount of memory.

```javascript
const openflights = require("openflights-cached/icao");
//    ^^^^^^^^^^^ - this here's an object with icao ids as keys

const myAirport = openflights["EHAM"] // -> Amsterdam Schiphol
```

## IATA

`openflights-cached/iata` exposes an object of all [OpenFlight entries](#Entry+type) indexed by IATA ids - the JSON is approx. 1.7 megs and will probably use approx. double the amount of memory.

```javascript
const openflights = require("openflights-cached/iata");
//    ^^^^^^^^^^^ - this here's an object with iata ids as keys

const myAirport = openflights["JFK"] // -> New York, JFK
```

### Entry type

Each entry exposed by the module is type of OpenFlightsEntry is an object with the following keys:

* **airportid**: string - Unique OpenFlights identifier for this airport.
* **name**: string - Name of airport. May or may not contain the City name.
* **city**: string - Main city served by airport. May be spelled differently from Name.
* **country**: string - Country or territory where airport is located. See countries.dat to cross-reference to ISO 3166-1 codes.
* **iata**: string - 3-letter IATA code. Null if not assigned/unknown.
* **icao**: string - 4-letter ICAO code.
* **latitude**: string - Decimal degrees, usually to six significant digits. Negative is South, positive is North.
* **longitude**: string - Decimal degrees, usually to six significant digits. Negative is West, positive is East.
* **altitude**: string - In feet.
* **\[timezone\]**: string - Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5.
* **\[dst\]**: string - Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown). See also: Help: Time
* **\[tz\]**: string - database time zone	Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".
* **type**: string - Type of the airport. Value "airport" for air terminals, "station" for train stations, "port" for ferry terminals and "unknown" if not known. In airports.csv, only type=airport is included.
* **source**: string - Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions.

## License

The module code is licensed as MIT ([see MIT license here](./LICENSE)), the module fetches data from [OpenFlights](https://openflights.org/data.html#license), keep in mind you **need** to follow that license too.
