// model class
class Person {
  constructor(name, surname, email) {
    this.name = name;
    this.surname = surname;
    this.email = email;
  }
}

class Util {
  static checkEmptyField(...fields) {
    let result = true;
    fields.forEach((field) => {
      if (field.length === 0) {
        result = false;
        return result;
      }
    });

    return result;
  }

  static isEmailValid(email) {
    const re = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    return re;
  }
}

// UI / HTML DOM
class Screen {
  constructor() {
    this.nameField = document.getElementById("name");
    this.surnameField = document.getElementById("surname");
    this.emailField = document.getElementById("email");
    this.saveUpdateBtn = document.querySelector(".saveUpdate");
    this.form = document.getElementById("form-contacts");
    this.form.addEventListener("submit", this.saveUpdate.bind(this));
    this.peopleList = document.querySelector(".person-list");
    this.peopleList.addEventListener("click", this.updateDelete.bind(this));
    this.store = new Store();
    this.selectedLine = undefined; // storage for tr element related to its "update" and "delete" buttons while clicking
    this.printPeopleToScreen();
  }

  saveUpdate(e) {
    e.preventDefault();
    // console.log(this);

    const person = new Person(
      this.nameField.value,
      this.surnameField.value,
      this.emailField.value
    );
    // console.log(person);

    const result = Util.checkEmptyField(
      person.name, // we need to write the variables name as in Person Class
      person.surname,
      person.email
    );

    console.log(this.emailField.value);
    const isEmailValid = Util.isEmailValid(this.emailField.value);
    console.log(this.emailField.value + " result: " + isEmailValid);

    // all fields are full
    if (result) {
      //   update new person to the Screen

      // const updatedPerson = new Person(
      //   this.nameField.value,
      //   this.surnameField.value,
      //   this.emailField.value
      // );

      // console.log(updatedPerson);

      if (!isEmailValid) {
        this.createInfo("Please enter a valid email address!");
        return;
      }

      if (this.selectedLine) {
        // if selectedLine is not "undefined", update process
        this.updatePersonOnScreen(person);
      } else {
        const result = this.store.addPerson(person);
        console.log(result);
        if (result) {
          //   add new person to the LocalStorage
          this.createInfo("Saved Successfully", true);

          //   add new person to the Screen
          this.addPersonToScreen(person);

          this.clearFields();
        } else {
          this.createInfo("Please write an Unique Email Address!");
        }

        //   add new person to the LocalStorage
        // this.store.addPerson(person);
      }

      //   "some fields are empty"
    } else {
      this.createInfo("Please fill up the form!");
    }
  }

  //   Uncaught TypeError: this.addPersonToScreen is not a function --> caused when we don't use "bind" keyword in constructor
  addPersonToScreen(person) {
    const createdTr = document.createElement("tr");
    createdTr.innerHTML = `<tr>
              <td>${person.name}</td>
              <td>${person.surname}</td>
              <td>${person.email}</td>
              <td>
                <button class="btn btn--edit">
                  <i class="far fa-edit"></i>
                </button>
                <button class="btn btn--delete">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
            </tr>`;

    this.peopleList.appendChild(createdTr);
  }

  printPeopleToScreen() {
    // we had to use "arrow function" in forEach due to "this" keyword
    this.store.allPeople.forEach((person) => {
      this.addPersonToScreen(person);
    });
  }

  updateDelete(e) {
    const clickedField = e.target;

    if (clickedField.classList.contains("btn--delete")) {
      this.selectedLine = clickedField.parentElement.parentElement;
      this.saveUpdateBtn.value = "Save";
      console.log(this.selectedLine);
      this.deletePersonFromScreen();
    } else if (clickedField.classList.contains("btn--edit")) {
      this.selectedLine = clickedField.parentElement.parentElement;
      this.saveUpdateBtn.value = "Update";
      this.nameField.value = this.selectedLine.cells[0].textContent;
      this.surnameField.value = this.selectedLine.cells[1].textContent;
      this.emailField.value = this.selectedLine.cells[2].textContent;
      //   this.saveUpdateBtn.value = "Save";
    }
  }

  deletePersonFromScreen() {
    this.selectedLine.remove();
    console.log(this.selectedLine);

    const emailToDelete = this.selectedLine.cells[2].textContent;
    this.store.deletePerson(emailToDelete);
    this.clearFields();
    this.selectedLine = undefined;
    this.createInfo("Person Deleted from Contacts", true);
  }

  updatePersonOnScreen(person) {
    console.log(person);
    const result = this.store.updatePerson(
      person,
      this.selectedLine.cells[2].textContent
    );
    /*const unUpdatedPerson = new Person(
      this.selectedLine.cells[0].textContent,
      this.selectedLine.cells[1].textContent,
      this.selectedLine.cells[2].textContent
    );
    console.log(unUpdatedPerson);*/ // deprecated

    if (result) {
      this.selectedLine.cells[0].textContent = person.name;
      this.selectedLine.cells[1].textContent = person.surname;
      this.selectedLine.cells[2].textContent = person.email;

      this.clearFields();
      this.selectedLine = undefined;
      this.saveUpdateBtn.value = "Save";
      this.createInfo("Updated Successfully", true);
    } else {
      this.createInfo("Please write an Unique Email Address!");
    }
  }

  clearFields() {
    this.nameField.value = "";
    this.surnameField.value = "";
    this.emailField.value = "";
  }

  createInfo(message, status) {
    const warningDiv = document.querySelector(".info");
    // const createdInfo = document.createElement("div");
    warningDiv.textContent = message; // innerHTML
    // createdInfo.className = "info";

    warningDiv.classList.add(status ? "info--success" : "info--error");

    //   document.querySelector(".container").appendChild(createdInfo); // this creates at the bottom of parent as a child
    // document.querySelector(".container").insertBefore(createdInfo, this.form);

    //   setTimeout, setInterval --> by Browser, not JS(including document keyword)
    setTimeout(function () {
      warningDiv.className = "info";
    }, 2000);
  }
}

// helper class / like database
class Store {
  constructor() {
    this.allPeople = this.getPeople(); // this.allPeople = []; --> caused error
  }

  // datas got when app is opened
  getPeople() {
    let allPeopleLocal;

    if (localStorage.getItem("allPeople") === null) {
      allPeopleLocal = [];
    } else {
      allPeopleLocal = JSON.parse(localStorage.getItem("allPeople"));
    }

    // this.allPeople = allPeopleLocal; // no need "here"
    return allPeopleLocal;
  }

  addPerson(person) {
    /* FIRST WAY */
    // this.getPeople();
    // const allPeopleLocal = this.allPeople;

    /* SECOND WAY */
    // const allPeopleLocal = this.getPeople();
    // allPeopleLocal.push(person);
    // localStorage.setItem("allPeople", JSON.stringify(allPeopleLocal));
    // this.allPeople = allPeopleLocal; /* ANOTHER WAY */

    /* THIRD WAY */
    if (this.isEmailUnique(person.email)) {
      this.allPeople.push(person);
      localStorage.setItem("allPeople", JSON.stringify(this.allPeople));
      return true;
    } else {
      return false;
    }
  }

  deletePerson(email) {
    this.allPeople.forEach((person, index) => {
      if (person.email === email) {
        this.allPeople.splice(index, 1);
      }
    });
    localStorage.setItem("allPeople", JSON.stringify(this.allPeople));
  }

  // email to find data 's order(index) in array to check the correct data
  // updatedPerson : new Values, email: contains old value to find it in store
  updatePerson(updatedPerson, email) {
    if (updatedPerson.email === email) {
      this.allPeople.forEach((person, index) => {
        if (person.email === email) {
          this.allPeople[index] = updatedPerson;
          localStorage.setItem("allPeople", JSON.stringify(this.allPeople));
        }
      });
      return true;
    }

    if (this.isEmailUnique(updatedPerson.email)) {
      // here, "forEach" is asynchronous
      this.allPeople.forEach((person, index) => {
        if (person.email === email) {
          this.allPeople[index] = updatedPerson;
          localStorage.setItem("allPeople", JSON.stringify(this.allPeople));
          //   return true; // forEach doesn't wait for this return
        }
      });
      return true;
    } else {
      return false;
    }
  }

  isEmailUnique(email) {
    const result = this.allPeople.find((person) => {
      return person.email === email;
    });

    if (result) {
      // this email cannot be added (unique)
      return false;
    } else {
      // this email can be added (not unique)
      return true;
    }
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  // to trigger the constructor of Screen Class
  const screen = new Screen();
});
