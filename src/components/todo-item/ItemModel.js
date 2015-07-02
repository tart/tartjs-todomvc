goog.provide('todomvc.components.TodoItem.ItemModel');
goog.require('tart.ui.ComponentModel');



/**
 *
 * @constructor
 * @extends {tart.ui.ComponentModel}
 */
todomvc.components.TodoItem.ItemModel = function(item) {
    goog.base(this);

    this.item = item;
    this.todoModel = todomvc.models.TodoModel.getInstance();

    this.todoModel.listen('toggle' + this.item.id, this.dispatchEvent, false, this);
    this.markListener = this.todoModel.listen('mark all', function() {
        this.dispatchEvent('toggle' + this.item.id);
    }, false, this);
};
goog.inherits(todomvc.components.TodoItem.ItemModel, tart.ui.ComponentModel);


todomvc.components.TodoItem.ItemModel.prototype.toggle = function() {
    todomvc.models.TodoModel.getInstance().toggleTodo(this.item.id);
};

todomvc.components.TodoItem.ItemModel.prototype.remove = function() {
    todomvc.models.TodoModel.getInstance().removeTodo(this.item.id);
};


/**
 * @override
 */
todomvc.components.TodoItem.ItemModel.prototype.disposeInternal = function() {
    this.todoModel.unlisten('toggle' + this.item.id, this.dispatchEvent, false, this);
    this.todoModel.unlistenByKey(this.markListener);

    this.item = null;
    this.todoModel = null;
};
