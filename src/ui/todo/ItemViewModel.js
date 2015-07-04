goog.module('todomvc.ui.todo.ItemViewModel');

var ComponentModel = goog.require('tart.ui.ComponentModel');
var TodoModel = goog.require('todomvc.models.TodoModel');



/**
 *
 * @constructor
 * @extends {ComponentModel}
 */
function ViewModel(item) {
    ViewModel.base(this, 'constructor');

    this.item = item;

    TodoModel.listen('toggle' + this.item.id, this.dispatchEvent, false, this);
    this.markListener = TodoModel.listen('mark all', function() {
        this.dispatchEvent('toggle' + this.item.id);
    }, false, this);
}
goog.inherits(ViewModel, ComponentModel);


ViewModel.prototype.toggle = function() {
    TodoModel.toggleTodo(this.item.id);
};

ViewModel.prototype.remove = function() {
    TodoModel.removeTodo(this.item.id);
};


/**
 * @override
 */
ViewModel.prototype.disposeInternal = function() {
    TodoModel.unlisten('toggle' + this.item.id, this.dispatchEvent, false, this);
    TodoModel.unlistenByKey(this.markListener);

    this.item = null;
};


exports = ViewModel;
