import React, { useState, useEffect } from 'react';
import './App.css';

function ComponentMain({ todoList, addItem, dropItem, flipItem, status, setStatus }) {
	let addTodoItem = (e) => {
		let keyPressed = e.keyCode || e.which;
		if (keyPressed === 13) {
			addItem({
				"item": e.target.value, 
				"id": String(Date.now()), 
				"status": false});
			e.target.value = "";
		}
	}
	let flipTodoItem = (e) => {
		flipItem(e.target.id);
	}
	let dropTodoItem = (e) => {
		let element = e.target.parentNode.firstElementChild.firstElementChild;
		dropItem(element.id);
	}
	let clearCompleted = (e) => {
		todoList.filter(x => x.status === true).forEach((x, _) => dropItem(x.id));
	}
	let changeStatus = (newStatus) => {
		setStatus(newStatus);
	}

	return (
		<>
			<section className="todo-app__main">
				<input 
					className="todo-app__input" 
					type="text" 
					placeholder="What needs to be done?" 
					id="todo-input"
					onKeyPress={addTodoItem}
				/>
				<ul className="todo-app__list" id="todo-list">
					{
						todoList.filter(x => status === null || x.status === status).map((obj, idx) =>
							<li 
								className="todo-app__item" 
								style={obj.status ? {textDecoration: "line-through", opacity: 0.5} : {}}>
								<div className="todo-app__checkbox">
										<input 
											type="checkbox" 
											id={obj.id}
											key={obj.id} 
											checked={obj.status ? "checked": ""}
											onClick={flipTodoItem}
										/>
										<label htmlFor={obj.id}></label>
								</div>
								{obj.item}
								<img src="img/x.png" className="todo-app__item-x" onClick={dropTodoItem} />
							</li>
						)
					}
				</ul>
			</section>
			{
				todoList.length > 0 &&
				<footer className="todo-app__footer" id="todo-footer">
						<div className="todo-app__total" id="todo-incomplete-count">
								{todoList.filter(x => x.status === false).length} left
						</div>
						<ul className="todo-app__view-buttons">
								<button onClick={() => changeStatus(null)} id="tab-all">All</button>
								<button onClick={() => changeStatus(false)} id="tab-active">Active</button>
								<button onClick={() => changeStatus(true)} id="tab-completed">Completed</button>
						</ul>
						<div className="todo-app__clean" id="todo-clean" 
							style={todoList.filter(x => x.status === true).length === 0 ? 
								{visibility:"hidden"} : {}}>
								<button onClick={clearCompleted}>Clear completed</button>
						</div>
				</footer>
			}
		</>
	);
}

function useTodoList(data) {
	const [items, setItems] = useState(data);

	const addItem = (item) => {
		setItems(prev => [...prev, item]);
	}
	const dropItem = (id) => {
		setItems(prev => prev.filter(x => x.id !== id));
	}
	const flipItem = (id) => {
		setItems(prev => prev.map(
			(x, _) => x.id === id ? {...x, "status": !x.status} : x
		));
	}

	return [
		items,
		addItem,
		dropItem,
		flipItem
	];
}

function App() {
	const [todoList, addItem, dropItem, flipItem] = useTodoList(new Array());
	const [status, setStatus] = useState(null);

	return (
		<>
			<header className="todo-app__header">
				 <h1 className="todo-app__title">todos</h1>
			</header>
			<ComponentMain 
				todoList={todoList}
				addItem={addItem}
				dropItem={dropItem}
				flipItem={flipItem}
				status={status}
				setStatus={setStatus}
			/>
		</>
	);
}

export default App;