interface OpenFlightEntry extends Object {
    /**
     * Unique OpenFlights identifier for this airport.
     */
    airportid: string,
    /**
     * Name of airport. May or may not contain the City name.
     */
    name: string,
    /**
     * Main city served by airport. May be spelled differently from Name.
     */
    city: string,
    /**
     * Country or territory where airport is located. See countries.dat to cross-reference to ISO 3166-1 codes.
     */
    country: string,
    /**
     * 3-letter IATA code. Null if not assigned/unknown.
     */
    iata?: string,
    /**
     * 4-letter ICAO code.
     */
    icao?: string,
    /**
     * Decimal degrees, usually to six significant digits. Negative is South, positive is North.
     */
    latitude: string,
    /**
     * Decimal degrees, usually to six significant digits. Negative is West, positive is East.
     */
    longitude: string,
    /**
     * In feet.
     */
    altitude: string,
    /**
     * Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5.
     */
    timezone?: string,
    /**
     * Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown). See also: Help: Time
     */
    dst?: string,
    /**
     * database time zone	Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".
     */
    tz?: string,
    /**
     * Type of the airport. Value "airport" for air terminals, "station" for train stations, "port" for ferry terminals and "unknown" if not known. In airports.csv, only type=airport is included.
     */
    type: string,
    /**
     * Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions. In airports.csv, only source=OurAirports is included.
     */
    source: string,
}

declare module "openflights-cached/array" {
    /** An array of all OpenFlight entries */
    export const array: OpenFlightEntry[];
}

declare module "openflights-cached/icao" {

    /** An object of OpenFlight entry values and icao ids as keys */
    export const icao : { [icao: string]: OpenFlightEntry };
}

declare module "openflights-cached/iata" {
    /** An object of OpenFlight entry values and iata ids as keys */
    export const iata : { [iata: string]: OpenFlightEntry };
}

/**
 * Exports all objects - it's recommended not to use this import.
 */
declare module "openflights-cached" {
    export { iata } from "openflights-cached/iata"
    export { icao } from "openflights-cached/icao";
    export { array } from "openflights-cached/array";
}
