'use strict'

var taskId = 1;

function Task(id, status, description, isFocus) {
    this.id = id || "taskId" + taskId;

    // taskId = (taskId < id) ? (id + 1) : taskId + 1;
    taskId++;
    this.status = status;
    this.description = description;
    this.isFocus = isFocus;
}
var list = _getTaskList();
function _getTaskList() {
    var tasks = [];

    function getTaskById(id) {
        var result = tasks.filter(function (item) {
            return (item.id === id)
        })
        return result[0];
    }

    var taskList = {
        add: function (id, status, description, isFocus) {
            var task = new Task(id, status, description, isFocus);
            tasks.push(task);
            localStorage.setItem(task.id, JSON.stringify(task))
            return task;

        },
        remove: function (id) {
            var removeIndex = -1;
            tasks.filter(function (element, index) {
                if (element.id === id) {
                    removeIndex = index;
                    return true;
                }
            });
            tasks.splice(removeIndex, 1);
            localStorage.removeItem(id);
        },

        removeCompleted: function () {
            var taskResult = tasks.filter(function (current) {
                return (!current.status)

            })
            tasks = taskResult;
        },
        edit: function (id, newText) {
            var task = getTaskById(id);
            task.description = newText;
            localStorage.setItem(id, JSON.stringify(task));
        },

        changeStatus: function (id) {
            var task = getTaskById(id);
            task.status = !task.status;
            localStorage.setItem(id, JSON.stringify(task));
        },

        changeFocus: function (id) {
            var task = getTaskById(id);
            task.isFocus = !task.isFocus;
            localStorage.setItem(id, JSON.stringify(task));
        },


        filter: {
            all: function () {
                return tasks
            },
            active: function () {
                var result = tasks.filter(function (element) {
                    return (!element.status);
                })
                return result;
            },
            completed: function () {
                var result = tasks.filter(function (element) {
                    return (element.status);
                })
                return result;
            }
        },
        info: {
            activeCount: function () {
                var result = tasks.reduce(function (sum, current) {
                    if (!current.status) {
                        return sum + 1
                    }
                    return sum;
                }, 0);
                return result;
            },
            completedCount: function () {
                var result = tasks.reduce(function (sum, current) {
                    if (current.status) {
                        return sum + 1
                    }
                    return sum;
                }, 0);
                return result;
            }
        }
    }

    return {
        taskList: taskList,
        getTaskById: getTaskById
    };
}





