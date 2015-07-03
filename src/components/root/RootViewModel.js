goog.module('todomvc.components.Root.RootViewModel');
var ComponentModel = goog.require('tart.ui.ComponentModel');
var TodoModel = goog.require('todomvc.models.TodoModel');

exports = RootViewModel;



/**
 *
 * @constructor
 * @extends {tart.ui.ComponentModel}
 */
function RootViewModel() {
    RootViewModel.base(this, 'constructor');

    this.items = TodoModel.getTodos();

    this.update();

    TodoModel.listen('update', function() {
        this.update();

        this.dispatchEvent('update');
    }, false, this);
}
goog.inherits(RootViewModel, tart.ui.ComponentModel);


RootViewModel.prototype.toggleAll = function() {
    this.isCompleted = !this.isCompleted;

    TodoModel.setAllTodosToCompleted(this.isCompleted);
};


RootViewModel.prototype.update = function() {
    this.isCompleted = TodoModel.isCompleted();

    this.uncompletedCount = TodoModel.getUncompletedTodos().length;
};


RootViewModel.prototype.addTodo = function(title) {
    TodoModel.addTodo(title);
};


RootViewModel.prototype.clearCompleted = function() {
    TodoModel.clearCompleted();
};
