// Todo Class to manage todo operations
class Todo {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.initializeElements();
        this.addEventListeners();
        this.render();
    }

    initializeElements() {
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        this.tasksCount = document.getElementById('tasks-count');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });
    }

    addTodo() {
        const text = this.input.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text,
                completed: false
            };
            this.todos.push(todo);
            this.saveTodos();
            this.input.value = '';
            this.render();
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Update tasks count
        const activeTodos = this.todos.filter(todo => !todo.completed).length;
        this.tasksCount.textContent = `${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`;

        // Clear list
        this.list.innerHTML = '';

        // Render todos
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Add event listeners
            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.list.appendChild(li);
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new Todo();
});
