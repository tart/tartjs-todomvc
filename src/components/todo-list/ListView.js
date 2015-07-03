goog.module('todomvc.components.TodoList.ListView');

var DlgComponent = goog.require('tart.ui.DlgComponent');
var Item = goog.require('todomvc.components.TodoItem.Item');
var ListViewModel = goog.require('todomvc.components.TodoList.ListViewModel');

exports = ListView;



/**
 *
 * @constructor
 * @extends {DlgComponent}
 */
function ListView() {
    this.model = new ListViewModel();

    ListView.base(this, 'constructor');

    this.children = this.model.todos.map(function(todo) {
        return new Item(todo);
    }, this);
}
goog.inherits(ListView, DlgComponent);


/**
 * @override
 */
ListView.prototype.bindModelEvents = function() {
    this.model.listen('add', this.onUpdate, false, this);
    this.model.listen('remove', this.onUpdate, false, this);
    this.model.listen('clear', this.onUpdate, false, this);
};


ListView.prototype.onUpdate = function() {
    this.children.forEach(function(child) {
        child.dispose();
    });

    this.children = this.model.todos.map(function(todo) {
        return new Item(todo);
    }, this);

    this.getElement().innerHTML = this.templates_todos();
};


/**
 * @override
 */
ListView.prototype.disposeInternal = function() {
    this.model.dispose();

    this.children.forEach(function(child) {
        child.dispose();
    });

    this.children = null;
};


ListView.prototype.templates_base = function() {
    return '<ul class="todo-list" id="' + this.getId() + '">' +
        this.templates_todos() +
        '</ul>';
};


ListView.prototype.templates_todos = function() {
    return this.children.map(function(child) {
        return child.getPlaceholder();
    }).join('');
};
