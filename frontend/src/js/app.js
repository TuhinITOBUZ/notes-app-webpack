import "../scss/app.scss";
import "bootstrap/scss/bootstrap.scss";

const taskDetails = document.getElementById("taskDetails");
const taskHeading = document.getElementById("taskHeading");
const taskList = document.getElementById("taskList");
const createTaskDiv = document.getElementById("createTask");
const colorArray = ["#ccd5ae", "#e9edc9", "#faedcd", "#d4a373"];
const notesCount = document.getElementById("notesSubHeading");
const clearButtons = document.querySelectorAll(".clear-note-button");
const checkBox = document.getElementById("checkBox");
const seeTask = document.getElementById("viewTask");
const seeTaskHeading = document.getElementById("viewTaskHeading");
const seeTaskDeatils = document.getElementById("viewTaskDetails");
const closeToastMessage = document.querySelector(".close");
const toastMessage = document.getElementById("toastMessage");
const toastMessageText = document.getElementById("toastMessageText");
let updateId = "";
let deleteId = "";

closeToastMessage.addEventListener("click", () => {
  toastMessage.style.display = "none";
});

clearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    taskHeading.value = taskDetails.value = "";
  });
});

function setTaskBackgroundColor() {
  document.querySelectorAll(".task").forEach((task, index) => {
    task.style.backgroundColor = colorArray[index % 4];
  });
}

function createTask() {
  createTaskDiv.style.display = "flex";
  document.getElementById("addNoteButton").innerHTML = "Save";
  taskDetails.focus();
}

function closeNoteView() {
  seeTask.style.display = "none";
}

function closeCreateForm() {
  createTaskDiv.style.display = "none";
  taskHeading.value = "";
  taskDetails.value = "";
}

function confirmDeleteTask(id) {
  deleteId = id;
  checkBox.style.display = "flex";
}

document.getElementById("yesDeleteNote").addEventListener("click", () => {
  deleteTask(deleteId);
});
document.getElementById("noDeleteNote").addEventListener("click", () => {
  deleteId = "";
  checkBox.style.display = "none";
});

async function editTask(id, heading, details) {
  createTaskDiv.style.display = "flex";
  taskHeading.value = heading;
  taskDetails.value = details;
  document.getElementById("addNoteButton").innerHTML = "Update";
  taskHeading.focus();
  updateId = id;
}

function viewTask(heading, details) {
  seeTask.style.display = "flex";
  seeTaskHeading.innerHTML = heading;
  seeTaskDeatils.innerHTML = details;
}

function handleFormSubmit(event) {
  const operationToBePerformed =
    document.getElementById("addNoteButton").innerHTML;
  if (operationToBePerformed === "Save") {
    handleOnSubmitCreate(event);
  } else if (operationToBePerformed === "Update") {
    handleOnSubmitUpdate(event);
  }
}

async function performBackendOperation(path, method, bodyDetails) {
  let url = `http://localhost:3000/${path}`;
  if (method === "GET") {
    return await fetch(url).then(function (res) {
      return res.json();
    });
  } else {
    const response = await fetch(url, {
      method: method,
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(bodyDetails),
    })
      .then(function (res) {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(response);
    return response;
  }
}

async function handleOnSubmitCreate(event) {
  event.preventDefault();
  if (taskHeading.value.trim() != "" && taskDetails.value.trim() != "") {
    const bodyDetails = {
      heading: taskHeading.value,
      details: taskDetails.value,
    };
    await performBackendOperation("add_note", "POST", bodyDetails).then(() => {
      createTaskDiv.style.display = "none";
      taskHeading.value = taskDetails.value = "";
      toastMessageText.innerHTML = "Note added successfully";
      toastMessage.style.display = "flex";
      setTimeout(() => {
        toastMessage.style.display = "none";
      }, 3000);
      createTaskDiv.style.display = "none";
      getTasks();
    });
  }
}

async function handleOnSubmitUpdate(event) {
  event.preventDefault();
  if (taskHeading.value.trim() != "" && taskDetails.value.trim() != "") {
    const bodyDetails = {
      _id: updateId,
      heading: taskHeading.value,
      details: taskDetails.value,
    };
    await performBackendOperation("modify_note", "PUT", bodyDetails).then(
      () => {
        taskHeading.value = taskDetails.value = "";
        toastMessageText.innerHTML = "Note updated successfully";
        toastMessage.style.display = "flex";
        setTimeout(() => {
          toastMessage.style.display = "none";
        }, 3000);
      }
    );
    createTaskDiv.style.display = "none";
    getTasks();
  }
}

async function getTasks() {
  const response = await performBackendOperation("notes", "GET", {});
  if (!response.error) {
    if (response.data.length > 0) {
      notesCount.display = "block";
      notesCount.innerHTML = `${response.data.length} Notes`;
    } else {
      notesCount.display = "none";
      notesCount.innerHTML = "";
    }
    taskList.innerHTML = "";
    for (let i = 0; i < response.data.length; i++) {
      let task = `
      <div class="task p-2 position-relative">
      <h2 class="w-75 overflow-auto">${response.data[i].heading}</h2>
      <p class="width-85">${response.data[i].details}</p>
      <div class="position-absolute top-0 end-0 d-flex flex-column gap-2 p-1">
        <button onclick="viewTask('${response.data[i].heading}', '${response.data[i].details}')" class="view-button border-0 bg-transparent"><i class="fa-regular fa-eye"></i></button>
        <button onclick="editTask('${response.data[i]._id}', '${response.data[i].heading}', '${response.data[i].details}')" class="edit-button border-0 bg-transparent"><i class="fa-regular fa-pen-to-square"></i></button>
        <button onclick="confirmDeleteTask('${response.data[i]._id}')" class="delete-button border-0 bg-transparent"><i class="fa-solid fa-trash"></i></button>
      </div>
      <hr>
      <p class="last-updated-on">Updated on :${response.data[i].date}</p>
      </div>
      `;
      taskList.innerHTML += task;
    }
    setTaskBackgroundColor();
  }
}
getTasks();

async function deleteTask(id) {
  checkBox.style.display = "none";
  const bodyDetails = { _id: id };
  const response = await performBackendOperation(
    "delete_note",
    "DELETE",
    bodyDetails
  ).then(() => {
    toastMessageText.innerHTML = "Note deleted successfully";
    toastMessage.style.display = "flex";
    setTimeout(() => {
      toastMessage.style.display = "none";
    }, 3000);
  });
  getTasks();
}

window.viewTask = viewTask;
window.closeNoteView = closeNoteView;
window.editTask = editTask;
window.handleOnSubmitCreate = handleOnSubmitCreate;
window.handleOnSubmitUpdate = handleOnSubmitUpdate;
window.closeCreateForm = closeCreateForm;
window.handleFormSubmit = handleFormSubmit;
window.confirmDeleteTask = confirmDeleteTask;
window.createTask = createTask;
window.performBackendOperation = performBackendOperation;
window.getTasks = getTasks;
window.setTaskBackgroundColor = setTaskBackgroundColor;
window.deleteTask = deleteTask;
