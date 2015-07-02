goog.provide('todomvc.entities.Todo');



/**
 * Todo entity holds information for a given todo item. Instantiate with a todo JSON.
 *
 * @param {Object} obj JSON for a todo item.
 * @constructor
 */
todomvc.entities.Todo = function(obj) {
    this.id = obj.id || tart.getUid();
    this.title = obj['title'];
    this.completed = obj['completed'];
};
