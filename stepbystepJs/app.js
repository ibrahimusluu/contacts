const name = document.getElementById("name");
const surname = document.getElementById("surname");
const email = document.getElementById("email");

const form = document.getElementById("form-contacts");
const personList = document.querySelector(".person-list");

// definitions of eventListeners
form.addEventListener("submit", save);
personList.addEventListener("click", doPersonProcess);

// array for all people
const allPeopleArray = [];
let selectedLine = undefined;

function doPersonProcess(event) {
  // event.target.className === "" --> not recommended
  if (event.target.classList.contains("btn--delete")) {
    const deletedTr = event.target.parentElement.parentElement;
    const deletedEmail =
      event.target.parentElement.previousElementSibling.textContent;
    deleteFromContacts(deletedTr, deletedEmail);
  } else if (event.target.classList.contains("btn--edit")) {
    document.querySelector(".saveUpdate").value = "Update";
    const updatedTr = event.target.parentElement.parentElement;
    const updatedEmail = updatedTr.cells[2].textContent;

    name.value = updatedTr.cells[0].textContent;
    surname.value = updatedTr.cells[1].textContent;
    email.value = updatedTr.cells[2].textContent;

    selectedLine = updatedTr;
    console.log(allPeopleArray);
  }
}

function deleteFromContacts(deletedTrElement, deletedEmail) {
  deletedTrElement.remove();

  /* FIRST WAY with forEach */
  //   deleting process by unique email
  //   allPeopleArray.forEach((person, index) => {
  //     if (person.email === deletedEmail) {
  //       allPeopleArray.splice(index, 1);
  //     }
  //   });

  /* SECOND WAY with filter */
  const notDeletedPeople = allPeopleArray.filter(function (person, index) {
    return person.email !== deletedEmail;
  });

  allPeopleArray.length = 0;
  allPeopleArray.push(...notDeletedPeople);

  console.log(allPeopleArray);
  document.querySelector(".saveUpdate").value = "Save";
  clearFields();
}

function save(e) {
  e.preventDefault();

  const addedOrUpdatedPerson = {
    name: name.value,
    surname: surname.value,
    email: email.value,
  };

  const result = checkDatas(addedOrUpdatedPerson);

  console.log(result.status);
  if (result.status) {
    console.log(selectedLine);
    if (selectedLine) {
      updatePerson(addedOrUpdatedPerson);
    } else {
      addPerson(addedOrUpdatedPerson);
    }
  } else {
    createInfo(result.message, result.status);
  }
}

function updatePerson(person) {
  // there are new values of selected person in "person" parameter

  for (let i = 0; i < allPeopleArray.length; i++) {
    if (allPeopleArray[i].email === selectedLine.cells[2].textContent) {
      allPeopleArray[i] = person;
      break;
    }
  }
  // there are old values in selectedLine
  selectedLine.cells[0].textContent = person.name;
  selectedLine.cells[1].textContent = person.surname;
  selectedLine.cells[2].textContent = person.email;

  document.querySelector(".saveUpdate").value = "Save";
  selectedLine = undefined;

  console.log(allPeopleArray);
}

function addPerson(addedPerson) {
  // need to add under <tbody> parent element
  const createdTrElement = document.createElement("tr");
  /* FIRST WAY with \ for every each line of HTML Codes when we write HTML in JS Codes */

  /* SECOND WAY with Back Quotes */
  createdTrElement.innerHTML = `<tr>
              <td>${addedPerson.name}</td>
              <td>${addedPerson.surname}</td>
              <td>${addedPerson.email}</td>
              <td>
                <button class="btn btn--edit">
                  <i class="far fa-edit"></i>
                </button>
                <button class="btn btn--delete">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
            </tr>`;

  personList.appendChild(createdTrElement);
  allPeopleArray.push(addedPerson);

  console.log("added completed: ", allPeopleArray);

  createInfo("Person saved to Contacts.", true);
}

function checkDatas(person) {
  // "value of people" in arrays

  // "in" usage in objects
  for (const key in person) {
    if (person[key]) {
      console.log(person[key]);
    } else {
      const result = {
        status: false,
        message: "Don't ignore empty fields!",
      };

      return result;
    }
  }

  clearFields();
  return {
    status: true,
    message: "Saved",
  };
}

function createInfo(message, status) {
  const createdInfo = document.createElement("div");
  createdInfo.textContent = message;
  createdInfo.className = "info";

  createdInfo.classList.add(status ? "info--success" : "info--error");

  //   document.querySelector(".container").appendChild(createdInfo); // this creates at the bottom of parent as a child
  document.querySelector(".container").insertBefore(createdInfo, form);

  //   setTimeout, setInterval --> by Browser, not JS(including document keyword)
  setTimeout(function () {
    const deletedDiv = document.querySelector(".info");
    if (deletedDiv) {
      deletedDiv.remove();
    }
  }, 2000);
}

function clearFields() {
  name.value = "";
  surname.value = "";
  email.value = "";
}
