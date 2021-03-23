import { getSelectInstance } from "../plugins/materialize";

class CurrencyUI {
  constructor() {
    this._currency = document.getElementById("currency");
    this.dictionary = {
      RUB: "₽",
      USD: "$",
      EUR: "€",
    };
  }

  get currencyValue() {
    return this._currency.value;
  }

  getCurrencySymbol() {
    console.log(this);
    return this.dictionary[this.currencyValue];
  }
}

const currencyUI = new CurrencyUI();

export default currencyUI;
