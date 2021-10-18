type State = null | boolean;

class TodoItem {
	item: string;
	id: number;
	completed: boolean;

	constructor(item: string, id: number) {
		this.item = item;
		this.id = id;
		this.completed = false;
	}
	done() {
		this.completed = true;
	}

}

class TodoList {
	items: Array<TodoItem>;

	constructor() {
		this.items = new Array<TodoItem>();
	}
	addItem(newItem: TodoItem) {
		this.items.push(newItem);
	}
	removeItem(id: number) {
		let idx = -1;
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (id === item.id) {
				idx = i;
				break;
			}
		}

		if (idx != -1) {
			this.items.splice(idx, 1);
		}
	}
	flipItem(id: number) {
		this.items.forEach((item, idx) => {
			if (id === item.id) {
				item.completed = (item.completed ? false : true);
			}
		});
	}
	getItems(status: State) {
		let result = new Array<TodoItem>();
		this.items.forEach((item, idx) => {
			if (status === null || item.completed === status) {
				result.push(item);
			}
		});

		return result;
	}
	countItems(status: State) {
		let cnt = 0;
		this.items.forEach((item, idx) => {
			if (status === null) {
				cnt++;
			} else if (item.completed === status) {
				cnt++;
			}
		});
		return cnt;
	}
}

const todoList = new TodoList();
let curStatus: State = null;
let itemIdx = 0;

function _changeDisplayState(id: string, display: boolean) {
	const element = document.getElementById(id);
	if (display) {
		element.style.removeProperty("display");
	} else {
		element.style.display = "none";
	}
}
function _changeVisibleState(id: string, visible: boolean) {
	const element = document.getElementById(id);
	if (visible) {
		element.style.removeProperty("visibility");
	} else {
		element.style.visibility = "hidden";
	}
}
function _cleanAll(id: string) {
	const element = document.getElementById(id);
	element.innerHTML = "";
}
function _cleanValue(id: string) {
	const element = document.getElementById(id) as HTMLInputElement;
	element.value = "";
}
function _htmlToElement(html: string) {
	const template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}
function _appendHtmlToElement(id: string, html: string) {
	const element = document.getElementById(id);
	element.appendChild(_htmlToElement(html));
}
function _updateUndoneCount() {
	const element = document.getElementById("todo-incomplete-count");
	let undoneCount = todoList.countItems(false);
	element.innerText = `${undoneCount} left`;
}
function _updateTabState() {
	document.getElementById("tab-all").style.border = "1px solid transparent";
	document.getElementById("tab-completed").style.border = "1px solid transparent";
	document.getElementById("tab-active").style.border = "1px solid transparent";

	if (curStatus === null) {
		document.getElementById("tab-all").style.border = "1px solid";
	} else if (curStatus) {
		document.getElementById("tab-completed").style.border = "1px solid";
	} else {
		document.getElementById("tab-active").style.border = "1px solid";
	}
}

function render(status: State) {
	// no items
	if (todoList.items.length === 0) {
		_changeDisplayState("todo-list", false);
		_changeDisplayState("todo-footer", false);
	}
	// have some items, might be done or undone
	else if (todoList.countItems(status) === 0) {
		_changeDisplayState("todo-list", false);
		_changeDisplayState("todo-footer", true);
		_updateUndoneCount();
		_changeVisibleState("todo-clean", false);
		_updateTabState();
	} else {
		_cleanAll("todo-list");
		const items = todoList.getItems(status);
		items.forEach((item, idx) => {
			const completed = (item.completed ? "checked" : "");
			const liStyle = (completed ? "text-decoration: line-through; opacity: 0.5;" : "");
			const template = `
				<li class="todo-app__item" style="${liStyle}">
		            <div class="todo-app__checkbox">
		                <input type="checkbox" onclick="flipTodoItem(this.id)" id="${item.id}" ${completed}>
		                <label for="${item.id}"></label>
		            </div>
		            ${item.item}
		            <img src="img/x.png" class="todo-app__item-x" onclick="removeTodoItem(this)">
		        </li>
			`;
			_appendHtmlToElement("todo-list", template);
		});
		_changeDisplayState("todo-list", true);
		_changeDisplayState("todo-footer", true);
		_updateUndoneCount();
		_changeVisibleState("todo-clean", (todoList.countItems(true) > 0));
		_updateTabState();
	}
}

function addTodoItem(item: string, event: KeyboardEvent) {
	let keyPressed = event.keyCode || event.which;
	if (keyPressed === 13) {
		todoList.addItem(new TodoItem(item, itemIdx++));
		_cleanValue("todo-input");
		render(curStatus);
	}
}

function flipTodoItem(itemId: string) {
	todoList.flipItem(parseInt(itemId));
	render(curStatus);
}

function removeTodoItem(img: HTMLImageElement) {
	const element = img.parentNode.firstElementChild.firstElementChild;
	todoList.removeItem(parseInt(element.id));
	render(curStatus);
}

function removeAllDoneTodoItem() {
	const done = todoList.getItems(true);
	done.forEach((item, idx) => {
		todoList.removeItem(item.id);
	});
	render(curStatus);
}

function changeState(state: string) {
	if (state === "Active") curStatus = false;
	else if (state === "Completed") curStatus = true;
	else curStatus = null;
	render(curStatus);
}