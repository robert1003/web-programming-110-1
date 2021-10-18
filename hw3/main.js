var TodoItem = (function () {
    function TodoItem(item, id) {
        this.item = item;
        this.id = id;
        this.completed = false;
    }
    TodoItem.prototype.done = function () {
        this.completed = true;
    };
    return TodoItem;
}());
var TodoList = (function () {
    function TodoList() {
        this.items = new Array();
    }
    TodoList.prototype.addItem = function (newItem) {
        this.items.push(newItem);
    };
    TodoList.prototype.removeItem = function (id) {
        var idx = -1;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (id === item.id) {
                idx = i;
                break;
            }
        }
        if (idx != -1) {
            this.items.splice(idx, 1);
        }
    };
    TodoList.prototype.flipItem = function (id) {
        this.items.forEach(function (item, idx) {
            if (id === item.id) {
                item.completed = (item.completed ? false : true);
            }
        });
    };
    TodoList.prototype.getItems = function (status) {
        var result = new Array();
        this.items.forEach(function (item, idx) {
            if (status === null || item.completed === status) {
                result.push(item);
            }
        });
        return result;
    };
    TodoList.prototype.countItems = function (status) {
        var cnt = 0;
        this.items.forEach(function (item, idx) {
            if (status === null) {
                cnt++;
            }
            else if (item.completed === status) {
                cnt++;
            }
        });
        return cnt;
    };
    return TodoList;
}());
var todoList = new TodoList();
var curStatus = null;
var itemIdx = 0;
function _changeDisplayState(id, display) {
    var element = document.getElementById(id);
    if (display) {
        element.style.removeProperty("display");
    }
    else {
        element.style.display = "none";
    }
}
function _changeVisibleState(id, visible) {
    var element = document.getElementById(id);
    if (visible) {
        element.style.removeProperty("visibility");
    }
    else {
        element.style.visibility = "hidden";
    }
}
function _cleanAll(id) {
    var element = document.getElementById(id);
    element.innerHTML = "";
}
function _cleanValue(id) {
    var element = document.getElementById(id);
    element.value = "";
}
function _htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}
function _appendHtmlToElement(id, html) {
    var element = document.getElementById(id);
    element.appendChild(_htmlToElement(html));
}
function _updateUndoneCount() {
    var element = document.getElementById("todo-incomplete-count");
    var undoneCount = todoList.countItems(false);
    element.innerText = undoneCount + " left";
}
function _updateTabState() {
    document.getElementById("tab-all").style.border = "1px solid transparent";
    document.getElementById("tab-completed").style.border = "1px solid transparent";
    document.getElementById("tab-active").style.border = "1px solid transparent";
    if (curStatus === null) {
        document.getElementById("tab-all").style.border = "1px solid";
    }
    else if (curStatus) {
        document.getElementById("tab-completed").style.border = "1px solid";
    }
    else {
        document.getElementById("tab-active").style.border = "1px solid";
    }
}
function render(status) {
    if (todoList.items.length === 0) {
        _changeDisplayState("todo-list", false);
        _changeDisplayState("todo-footer", false);
    }
    else if (todoList.countItems(status) === 0) {
        _changeDisplayState("todo-list", false);
        _changeDisplayState("todo-footer", true);
        _updateUndoneCount();
        _changeVisibleState("todo-clean", false);
        _updateTabState();
    }
    else {
        _cleanAll("todo-list");
        var items = todoList.getItems(status);
        items.forEach(function (item, idx) {
            var completed = (item.completed ? "checked" : "");
            var liStyle = (completed ? "text-decoration: line-through; opacity: 0.5;" : "");
            var template = "\n\t\t\t\t<li class=\"todo-app__item\" style=\"" + liStyle + "\">\n\t\t            <div class=\"todo-app__checkbox\">\n\t\t                <input type=\"checkbox\" onclick=\"flipTodoItem(this.id)\" id=\"" + item.id + "\" " + completed + ">\n\t\t                <label for=\"" + item.id + "\"></label>\n\t\t            </div>\n\t\t            " + item.item + "\n\t\t            <img src=\"img/x.png\" class=\"todo-app__item-x\" onclick=\"removeTodoItem(this)\">\n\t\t        </li>\n\t\t\t";
            _appendHtmlToElement("todo-list", template);
        });
        _changeDisplayState("todo-list", true);
        _changeDisplayState("todo-footer", true);
        _updateUndoneCount();
        _changeVisibleState("todo-clean", (todoList.countItems(true) > 0));
        _updateTabState();
    }
}
function addTodoItem(item, event) {
    var keyPressed = event.keyCode || event.which;
    if (keyPressed === 13) {
        todoList.addItem(new TodoItem(item, itemIdx++));
        _cleanValue("todo-input");
        render(curStatus);
    }
}
function flipTodoItem(itemId) {
    todoList.flipItem(parseInt(itemId));
    render(curStatus);
}
function removeTodoItem(img) {
    var element = img.parentNode.firstElementChild.firstElementChild;
    todoList.removeItem(parseInt(element.id));
    render(curStatus);
}
function removeAllDoneTodoItem() {
    var done = todoList.getItems(true);
    done.forEach(function (item, idx) {
        todoList.removeItem(item.id);
    });
    render(curStatus);
}
function changeState(state) {
    if (state === "Active")
        curStatus = false;
    else if (state === "Completed")
        curStatus = true;
    else
        curStatus = null;
    render(curStatus);
}
//# sourceMappingURL=main.js.map