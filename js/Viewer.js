var todolist = document.querySelector(".todo-list");
var cssClasses = {};

cssClasses.activeItem = "item-modifying";
cssClasses.taskIsDone = "list-item_done";
cssClasses.descriptionText = "item-description__text";
cssClasses.selectedButton = "active-info__selected";


function doubleclick(task, element, onsingle, ondouble) {
    if (!element.parentNode.classList.contains("item-modifying")) {
        if (element.getAttribute("data-dblclick") == null) {
            element.setAttribute("data-dblclick", 1);
            setTimeout(function () {
                if (element.getAttribute("data-dblclick") == 1) {
                    onsingle(task.id);
                }
                element.removeAttribute("data-dblclick");
            }, 200);
        } else {
            element.removeAttribute("data-dblclick");
            ondouble(task.id);
        }
    }
}

function prepareItem(value) {
    var itemTemplate = [
        '<div class="item-status">',
        '<span class="item-status__status-icon">', '&#10004;', '</span>',
        '</div>',
        '<div class="item-description">',
        '<input class="item-description__text" value="{value}" disabled>',
        '</div>',
        '<button class="items-info__button-close">',
        '&#10010;',
        '</button>',
    ].join('\n');
    var result = itemTemplate.replace('{value}', value);

    return result;
}

var viewer = _viewer();

function _viewer() {
    var counter = document.querySelector(".items-info__items-left-count");
    var buttonCounter = document.querySelector(".button-counter");


    function updateLeftCounter() {
        counter.textContent = list.taskList.info.activeCount();
    }

    function updateCompletedCounter() {
        buttonCounter.textContent = list.taskList.info.completedCount();
    }

    function removeAllTasks() {
        var todoNodes = todolist.children;
        var todoArray = Array.prototype.slice.call(todoNodes);

        todoArray.forEach(function (element) {
            if (element.id) {
                todolist.removeChild(element);
            }
        })
    };
    function appendTask(task) {
        var itemElement = document.createElement('div');
        itemElement.className = "list-item";
        itemElement.id = task.id;
        taskBuild(itemElement, task);
        todolist.appendChild(itemElement);
    }

    function taskBuild(itemElement, task) {
        if (task.status) {
            itemElement.classList.add(cssClasses.taskIsDone);
        }
        else {
            itemElement.classList.remove(cssClasses.taskIsDone)
        }

        itemElement.innerHTML = prepareItem(task.description);
        var itemDescription = itemElement.querySelector(".item-description");
        itemDescription.addEventListener('click', function () {
            doubleclick(task, itemDescription, controller.singleClick, controller.doubleClick)
        });

        var descriptionText = itemDescription.children[0];
        listeners.addEnterListener(descriptionText, function () {
            controller.enterClick(task.id);
        });
        listeners.addEscListener(descriptionText, function () {
            controller.escClick(task.id);
        });

        var button = itemElement.querySelector(".items-info__button-close");
        button.addEventListener('click', function () {
            controller.deleteClick(task.id)
        })

        //todo extract to function
        if (task.isFocus) {
            itemElement.classList.add(cssClasses.activeItem);
            itemElement.querySelector("." + cssClasses.descriptionText).disabled = false;
        }
        else {
            itemElement.classList.remove(cssClasses.activeItem);
            itemElement.querySelector("." + cssClasses.descriptionText).disabled = true;
        }

        return itemElement;
    }

    return {
        showTask: function (task) {
            appendTask(task);
            updateCompletedCounter();
            updateLeftCounter();
        },
        showTaskList: function (tasks) {
            removeAllTasks();
            tasks.forEach(function (task) {
                appendTask(task);
            })
            updateCompletedCounter();

        },
        updateTask: function (task) {
            var taskId = task.id;
            var textNode = document.querySelector("#" + taskId);
            textNode.parentNode.replaceChild(taskBuild(textNode, task), textNode);
            updateLeftCounter();
            updateCompletedCounter();
        },
        removeTask: function (taskId) {
            var taskDocument = document.querySelector("#" + taskId);
            taskDocument.parentNode.removeChild(taskDocument);
            updateCompletedCounter();
            updateLeftCounter();
        }
    }
}

