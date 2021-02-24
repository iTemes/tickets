import { getSelectInstance } from "../plugins/materialize";

class CurrencyUI {
  constructor() {
    this._currency = document.getElementById("currency");
  }

  get currencyValue() {
    return this._currency.value;
  }
}

const currencyUI = new CurrencyUI();

export default currencyUI;
