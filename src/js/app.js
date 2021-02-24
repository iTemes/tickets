import "../css/style.css";
import "./plugins";
import locations from "./store/locations";
import formUI from "./views/form";
import currencyUI from "./views/currency";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  const form = formUI.form;

  // Events
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("send data");
    onFormSubmit();
    // form.reset();
  });
  // Handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shorCitiesList);
  }

  async function onFormSubmit() {
    // get data from inputs

    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    console.log(origin, destination, depart_date, return_date, currency);

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });
    // CODE, CODE, 2021-02, 2021-02
  }
});
