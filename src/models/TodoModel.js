goog.module('todomvc.models.TodoModel');

var EventTarget = goog.require('goog.events.EventTarget');
var Storage = goog.require('tart.storage.Storage');
var Todo = goog.require('todomvc.entities.Todo');



/**
 * Provides storage and CRUD operations for todo items.
 *
 * @constructor
 * @extends {EventTarget}
 */
function TodoModel() {
    TodoModel.base(this, 'constructor');
    this.storage = new Storage();
    this.loadTodos_();
}
goog.inherits(TodoModel, EventTarget);


/**
 * @type {Array.<todomvc.entities.Todo>}
 * @private
 */
TodoModel.prototype.todos_;


TodoModel.prototype.getTodos = function() {
    return this.todos_;
};


TodoModel.prototype.toggleTodo = function(id) {
    var todo = goog.array.find(this.todos_, this.idPredicate(id));

    if (!todo) return null;

    todo.completed = !todo.completed;

    this.dispatchEvent('toggle' + todo.id);

    this.storeTodos_();

    return todo.completed;
};


TodoModel.prototype.removeTodo = function(id) {
    var removed = goog.array.removeIf(this.todos_, this.idPredicate(id));

    if (removed == 0) return;

    this.dispatchEvent('remove');
    this.dispatchEvent('remove' + id);

    this.storeTodos_();
};


TodoModel.prototype.addTodo = function(title) {
    var todo = new Todo({
        title: title,
        completed: false
    });

    this.todos_.push(todo);

    this.dispatchEvent({
        type: 'add',
        todo: todo
    });

    this.storeTodos_();
};


TodoModel.prototype.clearCompleted = function() {
    goog.array.removeAllIf(this.todos_, this.completedPredicate(true));

    this.dispatchEvent('clear');

    this.storeTodos_();
};


TodoModel.prototype.idPredicate = function(id) {
    return function(todo) {
        return todo.id == id;
    };
};


TodoModel.prototype.completedPredicate = function(isCompleted) {
    return function(todo) {
        return todo.completed == isCompleted;
    };
};


TodoModel.prototype.setAllTodosToCompleted = function(isCompleted) {
    this.todos_.forEach(function(todo) {
        todo.completed = isCompleted;
    });

    this.dispatchEvent('mark all');

    this.storeTodos_();
};


TodoModel.prototype.isCompleted = function() {
    return this.todos_.every(this.completedPredicate(true));
};


TodoModel.prototype.getUncompletedTodos = function() {
    return this.todos_.filter(this.completedPredicate(false));
};


TodoModel.prototype.getCompletedTodos = function() {
    return this.todos_.filter(this.completedPredicate(true));
};


/**
 *
 * @private
 */
TodoModel.prototype.storeTodos_ = function() {
    this.dispatchEvent('update');

    this.storage.set('todomvc-tartjs', this.todos_.map(this.serializeTodo));
};


/**
 *
 * @private
 */
TodoModel.prototype.loadTodos_ = function() {
    this.todos_ = (this.storage.get('todomvc-tartjs') || []).map(this.deserializeTodo);
};


/**
 * Serializes a todo instance for storage purposes.
 *
 * @param {todomvc.entities.Todo} todo
 */
TodoModel.prototype.serializeTodo = function(todo) {
    return {
        'id': todo.id,
        'title': todo.title,
        'completed': todo.completed
    };
};


/**
 * Deserializes a JSON object and returns a new todo instance.
 *
 * @param {Object} obj
 * @return {todomvc.entities.Todo}
 */
TodoModel.prototype.deserializeTodo = function(obj) {
    return new Todo(obj);
};


exports = new TodoModel();
