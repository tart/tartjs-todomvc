goog.provide('todomvc.components.TodoList.ListView');
goog.require('tart.ui.DlgComponent');
goog.require('todomvc.components.TodoItem.Item');
goog.require('todomvc.components.TodoList.ListViewModel');



/**
 *
 * @constructor
 * @extends {tart.ui.DlgComponent}
 */
todomvc.components.TodoList.ListView = function() {
    this.model = new todomvc.components.TodoList.ListViewModel();

    goog.base(this);

    this.children = this.model.todos.map(function(todo) {
        return new todomvc.components.TodoItem.Item(todo);
    }, this);
};
goog.inherits(todomvc.components.TodoList.ListView, tart.ui.DlgComponent);


/**
 * @override
 */
todomvc.components.TodoList.ListView.prototype.bindModelEvents = function() {
    this.model.listen('add', this.onUpdate, false, this);
    this.model.listen('remove', this.onUpdate, false, this);
    this.model.listen('clear', this.onUpdate, false, this);
};


todomvc.components.TodoList.ListView.prototype.onUpdate = function() {
    this.children.forEach(function(child) {
        child.dispose();
    });

    this.children = this.model.todos.map(function(todo) {
        return new todomvc.components.TodoItem.Item(todo);
    }, this);

    this.getElement().innerHTML = this.templates_todos();
};


/**
 * @override
 */
todomvc.components.TodoList.ListView.prototype.disposeInternal = function() {
    this.model.dispose();

    this.children.forEach(function(child) {
        child.dispose();
    });

    this.children = null;
};


todomvc.components.TodoList.ListView.prototype.templates_base = function() {
    return '<ul class="todo-list" id="' + this.getId() + '">' +
        this.templates_todos() +
        '</ul>';
};


todomvc.components.TodoList.ListView.prototype.templates_todos = function() {
    return this.children.map(function(child) {
        return child.getPlaceholder();
    }).join('');
};
