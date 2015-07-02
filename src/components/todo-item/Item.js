goog.provide('todomvc.components.TodoItem.Item');
goog.require('goog.dom.classlist');
goog.require('tart.ui.DlgComponent');
goog.require('todomvc.components.TodoItem.ItemModel');



/**
 *
 * @constructor
 * @extends {tart.ui.DlgComponent}
 */
todomvc.components.TodoItem.Item = function(item) {
    this.model = new todomvc.components.TodoItem.ItemModel(item);
    goog.base(this);
};
goog.inherits(todomvc.components.TodoItem.Item, tart.ui.DlgComponent);


/**
 * @override
 */
todomvc.components.TodoItem.Item.prototype.bindModelEvents = function() {
    this.model.listen('toggle' + this.model.item.id, this.onToggle, false, this);
};


/**
 * Toggles the completed state of this todo item.
 */
todomvc.components.TodoItem.Item.prototype.toggle = function() {
    this.model.toggle();
};


/**
 * Removes this todo item.
 */
todomvc.components.TodoItem.Item.prototype.destroy = function() {
    this.model.remove();
};


/**
 * Toggle event handler. Sets the `completed` class appropriately.
 */
todomvc.components.TodoItem.Item.prototype.onToggle = function() {
    goog.dom.classlist.enable(this.getElement(), 'completed', this.model.item.completed);

    this.getChild('.toggle')[0].checked = this.model.item.completed;
};


/**
 * @override
 */
todomvc.components.TodoItem.Item.prototype.disposeInternal = function() {
    this.model.unlisten('toggle', this.onToggle, false, this);
    this.model.dispose();
    this.model = null;
};


/**
 * @override
 */
todomvc.components.TodoItem.Item.prototype.templates_base = function() {
    var completed = this.model.item.completed ? 'completed' : '',
        checked = this.model.item.completed ? 'checked' : '';

    return '<li class="' + completed + '" id="' + this.getId() + '">' +
        '<div class="view">' +
        '<input class="toggle" type="checkbox" ' + checked + '>' +
        '<label>' + this.model.item.title + '</label>' +
        '<button class="destroy"></button>' +
        '</div>' +
        '<input class="edit" value="Create a TodoMVC template">' +
        '</li>';
};


todomvc.components.TodoItem.Item.prototype.events = {
    'click': {
        '.toggle': todomvc.components.TodoItem.Item.prototype.toggle,
        '.destroy': todomvc.components.TodoItem.Item.prototype.destroy
    }
};
