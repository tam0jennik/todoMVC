var newItemText = document.getElementById("new-item__text");
var allTasksBttn = document.getElementById("all-tasks-bttn");
var activeTaskBttn = document.getElementById("active-tasks-bttn");
var completedTaskBttn = document.getElementById("completed-tasks-bttn");
var clearBttn = document.querySelector(".clear-block__button-clear");


var listeners = {
    addEnterListener: function (node, eventFunction) {
        node.addEventListener("keypress", function (e) {
            var key = e.keyCode;
            if (key === 13) {
                eventFunction();
            }
        });
    },
    addEscListener: function (node, eventFunction) {
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                eventFunction();
            }
        };
    },
    addBttnListener: function (node, func) {
        node.addEventListener("click", func);
    },
    addOnLoadListener: function (func) {
        window.addEventListener("load", func);
    }
}


listeners.addEnterListener(newItemText, function () {
    var taskDescription = newItemText.value;
    var task = list.taskList.add('', false, taskDescription, false)
    viewer.showTask(task);
})


var controller = _controller();

function _controller() {
    var previewItemId = '';

    function saveChanges(item) {
        if (previewItemId) {
            var previewItem = list.getTaskById(previewItemId);
            if ((!!previewItem) && (previewItem.isFocus)) {
                var newItemValue = getNewTaskDescription(previewItemId);
                previewItem.isFocus = false;
                if (newItemValue.length == 0) {
                    revertChanges(previewItem);
                }
                else {
                    list.taskList.edit(previewItemId, newItemValue);
                    viewer.updateTask(previewItem);
                }

            }
        }
    }

    function getNewTaskDescription(itemId) {
        var task = document.getElementById(itemId);
        var newDescription = task.getElementsByClassName("item-description__text")[0].value
        return newDescription.trim();
    }

    function revertChanges(item) {
        viewer.updateTask(item);
    }

    var obj = {

        singleClick: function (itemId) {
            var currentItem = list.getTaskById(itemId);
            saveChanges(currentItem);
            list.taskList.changeStatus(itemId);
            viewer.updateTask(currentItem);
            previewItemId = itemId;

        },

        doubleClick: function (itemId) {
            console.log("double-click");
            var currentItem = list.getTaskById(itemId);
            saveChanges(currentItem);
            list.taskList.changeFocus(itemId);
            viewer.updateTask(currentItem);
            previewItemId = itemId;
        },

        enterClick: function (itemId) {
            console.log("enter-click");
            saveChanges(itemId);

        },

        escClick: function (itemId) {
            console.log("esc - click");
            var task = list.getTaskById(itemId);
            task.isFocus = false;
            revertChanges(task);
        },

        deleteClick: function (itemId) {
            console.log("delete- button")
            var task = list.taskList.remove(itemId);
            viewer.removeTask(itemId);

        },
        showAllItems: function () {
            var allItems = list.taskList.filter.all();

            allTasksBttn.classList.add(cssClasses.selectedButton);
            activeTaskBttn.classList.remove(cssClasses.selectedButton);
            completedTaskBttn.classList.remove(cssClasses.selectedButton);

            viewer.showTaskList(allItems);

        },
        showActiveItems: function () {
            var activeItems = list.taskList.filter.active();

            allTasksBttn.classList.remove(cssClasses.selectedButton);
            activeTaskBttn.classList.add(cssClasses.selectedButton);
            completedTaskBttn.classList.remove(cssClasses.selectedButton);

            viewer.showTaskList(activeItems);
        },
        showCompletediItems: function () {
            var completedItems = list.taskList.filter.completed();
            allTasksBttn.classList.remove(cssClasses.selectedButton);
            activeTaskBttn.classList.remove(cssClasses.selectedButton);
            completedTaskBttn.classList.add(cssClasses.selectedButton);

            viewer.showTaskList(completedItems);
        },
        removeCompleted: function () {
            list.taskList.removeCompleted();
            var tasks = list.taskList.filter.all();
            viewer.showTaskList(tasks);
        },
        loadTasksFromLocalStorage: function () {
            for (var taskKey in localStorage) {
                var item = JSON.parse(localStorage.getItem(taskKey));
                var task = list.taskList.add(item.id, item.status, item.description, item.isFocus);
                viewer.showTask(task);
            }
        }

    }

    return obj;
}
listeners.addBttnListener(activeTaskBttn, controller.showActiveItems);
listeners.addBttnListener(allTasksBttn, controller.showAllItems);
listeners.addBttnListener(completedTaskBttn, controller.showCompletediItems);
listeners.addBttnListener(clearBttn, controller.removeCompleted);
listeners.addOnLoadListener(controller.loadTasksFromLocalStorage);