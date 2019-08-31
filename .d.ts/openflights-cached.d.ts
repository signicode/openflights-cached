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

/** An array of all OpenFlight entries */
declare module "openflights-cached/array" {
    const array: OpenFlightEntry[];

    export default array;
}

/** An object of OpenFlight entry values and icao ids as keys */
declare module "openflights-cached/icao" {
    const icao: { [icao: string]: OpenFlightEntry }

    export default icao;
}

/** An object of OpenFlight entry values and iata ids as keys */
declare module "openflights-cached/iata" {
    const iata: { [iata: string]: OpenFlightEntry }

    export default iata;
}


/** An object of iata ids as keys and icao ids as values */
declare module "openflights-cached/iata2icao" {
    const iata2icao: { [iata: string]: string };

    export default iata2icao;
}

/** An array of all ICAO ids */
declare module "openflights-cached/icaos" {
    const icaos: string[];

    export default icaos;
}

/**
 * Exports all objects - it's recommended not to use this import.
 */
declare module "openflights-cached" {
    import iata from "openflights-cached/iata"
    import icao from "openflights-cached/icao";
    import array from "openflights-cached/array";
    import iata2icao from "openflights-cached/iata2icao";
    import icaos from "openflights-cached/icaos";

    /**
     * Fetches a single airport data for the given icao id.
     * @param icao the airport ICAO id to fetch
     */
    function findICAO ( icao : string ) : OpenFlightEntry | null;
    /**
     * Fetches a single airport data for the given iata id.
     * @param iata the airport IATA id to fetch
     */
    function findIATA ( iata : string ) : OpenFlightEntry | null;

    export {
        iata,
        icao,
        array,
        icaos,
        iata2icao,
        findICAO,
        findIATA
    }
}
