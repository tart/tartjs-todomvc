goog.provide('todomvc.components.TodoList.ListViewModel');
goog.require('tart.ui.ComponentModel');
goog.require('todomvc.models.TodoModel');



/**
 *
 * @constructor
 * @extends {tart.ui.ComponentModel}
 */
todomvc.components.TodoList.ListViewModel = function() {
    goog.base(this);

    this.todoModel = todomvc.models.TodoModel.getInstance();

    this.todos = this.todoModel.getTodos();

    this.addListener = this.todoModel.listen('add', this.dispatchEvent, false, this);
    this.removeListener = this.todoModel.listen('remove', this.dispatchEvent, false, this);
    this.clearListener = this.todoModel.listen('clear', this.dispatchEvent, false, this);
};
goog.inherits(todomvc.components.TodoList.ListViewModel, tart.ui.ComponentModel);


/**
 * @override
 */
todomvc.components.TodoList.ListViewModel.prototype.disposeInternal = function() {
    this.todoModel.unlistenByKey(this.addListener);
    this.todoModel.unlistenByKey(this.removeListener);
    this.todoModel.unlistenByKey(this.clearListener);

    this.todoModel = null;
    this.todos = null;
};
