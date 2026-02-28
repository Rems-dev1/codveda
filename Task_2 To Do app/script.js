window.onload = function () {
  var inputField = document.getElementById("taskInput");
  var addButton = document.getElementById("addBtn");
  var listArea = document.getElementById("taskList");

  function saveToMemory() {
    var allTasks = [];
    var listItems = listArea.getElementsByTagName("li");

    for (var i = 0; i < listItems.length; i++) {
      var textElement = listItems[i].getElementsByClassName("task-text")[0];
      var taskObject = {
        text: textElement.innerText,
        isDone: listItems[i].getAttribute("data-done") === "true",
      };
      allTasks.push(taskObject);
    }

    var textToSave = JSON.stringify(allTasks);
    localStorage.setItem("mySavedTasks", textToSave);
  }

  function createNewTaskElement(taskText, isDone) {
    var listItem = document.createElement("li");

    // here I should be checking the status
    if (isDone === true || isDone === "true") {
      listItem.setAttribute("data-done", "true");
    } else {
      listItem.setAttribute("data-done", "false");
    }

    var textSpan = document.createElement("span");
    textSpan.innerText = taskText;
    textSpan.className = "task-text";

    if (listItem.getAttribute("data-done") === "true") {
      textSpan.className = "task-text completed-text";
    }

    var btnContainer = document.createElement("div");
    btnContainer.className = "button-group";

    var editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";

    var deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";

    //checking if the text field was cliked
    textSpan.onclick = function () {
      var status = listItem.getAttribute("data-done");
      if (status === "false") {
        listItem.setAttribute("data-done", "true");
        textSpan.className = "task-text completed-text";
      } else {
        listItem.setAttribute("data-done", "false");
        textSpan.className = "task-text";
      }
      saveToMemory();
    };

    editBtn.onclick = function (event) {
      // Stop the click from traveling to the textSpan
      event.stopPropagation();

      var oldText = textSpan.innerText;
      var newText = prompt("Change your task to:", oldText);

      if (newText !== null && newText !== "") {
        textSpan.innerText = newText;
        saveToMemory();
      }
    };

    // delete button
    deleteBtn.onclick = function (event) {
      event.stopPropagation();
      listArea.removeChild(listItem);
      saveToMemory();
    };

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    listItem.appendChild(textSpan);
    listItem.appendChild(btnContainer);

    listArea.appendChild(listItem);
  }

  function handleAddClick() {
    var typedValue = inputField.value;
    if (typedValue.trim() === "") {
      return;
    }
    createNewTaskElement(typedValue, false);
    inputField.value = "";
    saveToMemory();
  }

  inputField.onkeypress = function (e) {
    if (e.key === "Enter") {
      handleAddClick();
    }
  };

  function loadFromMemory() {
    var savedData = localStorage.getItem("mySavedTasks");
    if (savedData !== null) {
      var parsedTasks = JSON.parse(savedData);
      for (var i = 0; i < parsedTasks.length; i++) {
        var item = parsedTasks[i];
        createNewTaskElement(item.text, item.isDone);
      }
    }
  }

  addButton.onclick = handleAddClick;
  loadFromMemory();
};
