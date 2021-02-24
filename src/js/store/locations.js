import api from "../services/apiService";

class Locations {
  constructor(api) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shorCitiesList = null;
  }
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
    ]);

    const [countries, cities] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shorCitiesList = this.createShortCitiesList(this.cities);
    console.log("countries", this.countries);
    console.log("cities", this.cities);
    console.log("shor list", this.shorCitiesList);

    return response;
  }

  getCityCodeByKey(key) {
    return this.cities[key].code;
  }

  createShortCitiesList(cities) {
    // key : value
    // [key, value]
    return Object.entries(cities).reduce((acc, [key]) => {
      acc[key] = null;
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
    // {'City, Country': {...} }
    return cities.reduce((acc, city) => {
      const cityName = city.name || city.name_translations.en;
      const countryName = this.searchCountryByCode(city.country_code);
      const key = `${cityName}, ${countryName}`;
      acc[key] = city;
      return acc;
    }, {});
  }

  searchCountryByCode(code) {
    return (
      this.countries[code].name || this.countries[code].name_translations.en
    );
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    console.log("response", response);
  }
}

const locations = new Locations(api);

export default locations;
