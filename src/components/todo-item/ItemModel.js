goog.module('todomvc.components.TodoItem.ItemModel');
var ComponentModel = goog.require('tart.ui.ComponentModel');
var TodoModel = goog.require('todomvc.models.TodoModel');

exports = ItemModel;



/**
 *
 * @constructor
 * @extends {ComponentModel}
 */
function ItemModel(item) {
    ItemModel.base(this, 'constructor');

    this.item = item;

    TodoModel.listen('toggle' + this.item.id, this.dispatchEvent, false, this);
    this.markListener = TodoModel.listen('mark all', function() {
        this.dispatchEvent('toggle' + this.item.id);
    }, false, this);
}
goog.inherits(ItemModel, ComponentModel);


ItemModel.prototype.toggle = function() {
    TodoModel.toggleTodo(this.item.id);
};

ItemModel.prototype.remove = function() {
    TodoModel.removeTodo(this.item.id);
};


/**
 * @override
 */
ItemModel.prototype.disposeInternal = function() {
    TodoModel.unlisten('toggle' + this.item.id, this.dispatchEvent, false, this);
    TodoModel.unlistenByKey(this.markListener);

    this.item = null;
};
