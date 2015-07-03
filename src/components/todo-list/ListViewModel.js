goog.module('todomvc.components.TodoList.ListViewModel');

var ComponentModel = goog.require('tart.ui.ComponentModel');
var TodoModel = goog.require('todomvc.models.TodoModel');

exports = ListViewModel;



/**
 *
 * @constructor
 * @extends {tart.ui.ComponentModel}
 */
function ListViewModel() {
    ListViewModel.base(this, 'constructor');

    this.todos = TodoModel.getTodos();

    this.addListener = TodoModel.listen('add', this.dispatchEvent, false, this);
    this.removeListener = TodoModel.listen('remove', this.dispatchEvent, false, this);
    this.clearListener = TodoModel.listen('clear', this.dispatchEvent, false, this);
}
goog.inherits(ListViewModel, ComponentModel);


/**
 * @override
 */
ListViewModel.prototype.disposeInternal = function() {
    TodoModel.unlistenByKey(this.addListener);
    TodoModel.unlistenByKey(this.removeListener);
    TodoModel.unlistenByKey(this.clearListener);

    this.todos = null;
};
