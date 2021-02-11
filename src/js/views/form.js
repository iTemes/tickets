class FormUI {
  constructor() {
    this._form = document.forms["locationControls"];
    this.origin = document.getElementById("autocomplete-origin");
    this.destination = document.getElementById("autocomplete-destination");
    this.dateDepart = document.getElementById("datepicker-depart");
    this.dateReturn = document.getElementById("datepicker-return");
  }
}

const formUI = new FormUI();

export default formUI;
