goog.provide('todomvc.models.TodoModel');
goog.require('goog.events.EventTarget');
goog.require('tart.storage.Storage');
goog.require('todomvc.entities.Todo');



/**
 * Provides storage and CRUD operations for todo items.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
todomvc.models.TodoModel = function() {
    goog.base(this);
    this.storage = new tart.storage.Storage();
    this.loadTodos_();
};
goog.inherits(todomvc.models.TodoModel, goog.events.EventTarget);
goog.addSingletonGetter(todomvc.models.TodoModel);


/**
 * @type {Array.<todomvc.entities.Todo>}
 * @private
 */
todomvc.models.TodoModel.prototype.todos_;


todomvc.models.TodoModel.prototype.getTodos = function() {
    return this.todos_;
};


todomvc.models.TodoModel.prototype.toggleTodo = function(id) {
    var todo = goog.array.find(this.todos_, this.idPredicate(id));

    if (!todo) return null;

    todo.completed = !todo.completed;

    this.dispatchEvent('toggle' + todo.id);

    this.storeTodos_();

    return todo.completed;
};


todomvc.models.TodoModel.prototype.removeTodo = function(id) {
    var removed = goog.array.removeIf(this.todos_, this.idPredicate(id));

    if (removed == 0) return;

    this.dispatchEvent('remove');
    this.dispatchEvent('remove' + id);

    this.storeTodos_();
};


todomvc.models.TodoModel.prototype.addTodo = function(title) {
    var todo = new todomvc.entities.Todo({
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


todomvc.models.TodoModel.prototype.clearCompleted = function() {
    goog.array.removeAllIf(this.todos_, this.completedPredicate(true));

    this.dispatchEvent('clear');

    this.storeTodos_();
};


todomvc.models.TodoModel.prototype.idPredicate = function(id) {
    return function(todo) {
        return todo.id == id;
    };
};


todomvc.models.TodoModel.prototype.completedPredicate = function(isCompleted) {
    return function(todo) {
        return todo.completed == isCompleted;
    };
};


todomvc.models.TodoModel.prototype.setAllTodosToCompleted = function(isCompleted) {
    this.todos_.forEach(function(todo) {
        todo.completed = isCompleted;
    });

    this.dispatchEvent('mark all');

    this.storeTodos_();
};


todomvc.models.TodoModel.prototype.isCompleted = function() {
    return this.todos_.every(this.completedPredicate(true));
};


todomvc.models.TodoModel.prototype.getUncompletedTodos = function() {
    return this.todos_.filter(this.completedPredicate(false));
};


todomvc.models.TodoModel.prototype.getCompletedTodos = function() {
    return this.todos_.filter(this.completedPredicate(true));
};


/**
 *
 * @private
 */
todomvc.models.TodoModel.prototype.storeTodos_ = function() {
    this.dispatchEvent('update');

    this.storage.set('todomvc-tartjs', this.todos_.map(this.serializeTodo));
};


/**
 *
 * @private
 */
todomvc.models.TodoModel.prototype.loadTodos_ = function() {
    this.todos_ = this.storage.get('todomvc-tartjs').map(this.deserializeTodo);
};


/**
 * Serializes a todo instance for storage purposes.
 *
 * @param {todomvc.entities.Todo} todo
 */
todomvc.models.TodoModel.prototype.serializeTodo = function(todo) {
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
todomvc.models.TodoModel.prototype.deserializeTodo = function(obj) {
    return new todomvc.entities.Todo(obj);
};
