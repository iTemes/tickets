import api from "../services/apiService";
import { formatDate } from "../helpers/date";

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shorCitiesList = null;
    this.airlines = null;
    this.lastSearch = {};
    this.formatDate = helpers.formatDate;
  }
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
    ]);

    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shorCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);

    console.log("this.cities ", this.cities);

    return response;
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(
      (item) => item.full_name === key
    );

    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  getLogoByAirlineCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : "";
  }

  getNameByAirlineCode(code) {
    return this.airlines[code] ? this.airlines[code].name : "";
  }

  createShortCitiesList(cities) {
    // key : value
    // [key, value]
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    }, {});
  }

  serializeCountries(countries) {
    // {'Country code': {...} }
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  serializeCities(cities) {
    // {'Code': {...} }
    return cities.reduce((acc, city) => {
      const cityName = city.name || city.name_translations.en;
      const countryName = this.searchCountryByCode(city.country_code);
      const full_name = `${cityName}, ${countryName}`;
      acc[city.code] = {
        ...city,
        countryName,
        full_name,
      };
      return acc;
    }, {});
  }

  searchCountryByCode(code) {
    return (
      this.countries[code].name || this.countries[code].name_translations.en
    );
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, airline) => {
      airline.logo = `http://pics.avs.io/200/200/${airline.code}.png`;
      airline.name = airline.name || airline.name_translations.en;
      acc[airline.code] = airline;
      return acc;
    }, {});
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
    console.log("response", this.lastSearch);
  }

  serializeTickets(tickets) {
    return Object.values(tickets).map((ticket) => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getLogoByAirlineCode(ticket.airline),
        airline_name: this.getNameByAirlineCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, "dd MMM yyyy hh:mm"),
        return_at: this.formatDate(ticket.return_at, "dd MMM yyyy hh:mm"),
      };
    });
  }
}

const locations = new Locations(api, { formatDate });

export default locations;
