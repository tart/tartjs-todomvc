goog.module('todomvc.entities.Todo');

exports = Todo;

/**
 * Todo entity holds information for a given todo item. Instantiate with a todo JSON.
 *
 * @param {Object} obj JSON for a todo item.
 * @constructor
 */
function Todo(obj) {
    this.id = obj.id || tart.getUid();
    this.title = obj['title'];
    this.completed = obj['completed'];
};
