//Book Class: Represents a Book
class User {
  constructor(id, name, mail, birth, gender) {
    this.id = id;
    this.name = name;
    this.mail = mail;
    this.birth = birth;
    this.gender = gender;
  }
}

//UI Class: Handle UI Tasks
class UI {
  static displayUsers() {
    const users = Store.getUsers();

    users.forEach(user => UI.addUserToList(user)); //loop throw the array and call the method add book to list
  }

  static addUserToList(user) {
    //create the book-data row
    const list = document.querySelector("#user-list");

    const row = document.createElement("tr");

    const birth = `${user.birth}`;
    const age = moment().diff(moment(birth, "YYYY-MM--DD"), "years");

    row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.mail}</td>
    <td>${age}</td>
    <td>${user.gender}</td>
    
    <td><a href="#" class="btn btn-danger btn-sm delete"><i class="far fa-trash-alt"></i></a></td>
    <td> <a href="#" class="btn btn-primary btn-sm edit"><i class="far fa-edit"></i></a></td>
    `;

    list.appendChild(row);
  }
  // <td><a href="#" class="delete" ><i class="far fa-trash-alt"></i></a></td>
  static deleteUser(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const table = document.querySelector("#user-table");
    container.insertBefore(div, table);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#id").value = "";
    document.querySelector("#name").value = "";
    document.querySelector("#mail").value = "";
    document.querySelector("#birth").value = "";
    document.querySelector("#gender").value = "";
  }
}

//Store Class: Handle Storage
class Store {
  static getUsers() {
    let users;
    if (localStorage.getItem("users") === null) {
      users = [];
    } else {
      users = JSON.parse(localStorage.getItem("users"));
    }
    return users;
  }

  static addUser(user) {
    const users = Store.getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  static removeUser(id) {
    const users = Store.getUsers();
    console.log(users);
    users.forEach((user, index) => {
      if (user.id === id) {
        users.splice(index, 1);
      }
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayUsers);

//Event: Add a Book
document.querySelector("#user-form").addEventListener("submit", e => {
  //Prevent actual submit
  e.preventDefault();

  //Get form values
  const id = document.querySelector("#id").value;
  const name = document.querySelector("#name").value;
  const mail = document.querySelector("#mail").value;
  const birth = document.querySelector("#birth").value;
  const gender = document.querySelector("#gender").value;

  // Validate
  if (
    id === "" ||
    name === "" ||
    mail === "" ||
    birth === "" ||
    gender === ""
  ) {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instatiate book
    const user = new User(id, name, mail, birth, gender);

    // Add Book to UI
    UI.addUserToList(user);

    // Add book to store
    Store.addUser(user);

    // Show Succes Msg
    UI.showAlert("User Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#user-list").addEventListener("click", e => {
  // Remove Book from UI
  UI.deleteUser(e.target);

  // Remove a book from store
  Store.removeUser(e.target);

  // Show Succes Msg
  UI.showAlert("User Removed", "success");
});
