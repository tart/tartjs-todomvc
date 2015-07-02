goog.provide('todomvc.components.Root.RootViewModel');
goog.require('tart.ui.ComponentModel');
goog.require('todomvc.models.TodoModel');



/**
 *
 * @constructor
 * @extends {tart.ui.ComponentModel}
 */
todomvc.components.Root.RootViewModel = function() {
    goog.base(this);

    this.todoModel = todomvc.models.TodoModel.getInstance();
    this.items = this.todoModel.getTodos();

    this.update();

    this.todoModel.listen('update', function() {
        this.update();

        this.dispatchEvent('update');
    }, false, this);
};
goog.inherits(todomvc.components.Root.RootViewModel, tart.ui.ComponentModel);


todomvc.components.Root.RootViewModel.prototype.toggleAll = function() {
    this.isCompleted = !this.isCompleted;

    this.todoModel.setAllTodosToCompleted(this.isCompleted);
};


todomvc.components.Root.RootViewModel.prototype.update = function() {
    this.isCompleted = this.todoModel.isCompleted();

    this.uncompletedCount = this.todoModel.getUncompletedTodos().length;
};


todomvc.components.Root.RootViewModel.prototype.addTodo = function(title) {
    this.todoModel.addTodo(title);
};


todomvc.components.Root.RootViewModel.prototype.clearCompleted = function() {
    this.todoModel.clearCompleted();
};
