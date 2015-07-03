goog.module('todomvc.components.TodoItem.Item');

var classlist = goog.require('goog.dom.classlist');
var DlgComponent = goog.require('tart.ui.DlgComponent');
var ItemModel = goog.require('todomvc.components.TodoItem.ItemModel');

exports = Item;



/**
 *
 * @constructor
 * @extends {tart.ui.DlgComponent}
 */
function Item(item) {
    this.model = new ItemModel(item);
    Item.base(this, 'constructor');
}
goog.inherits(Item, DlgComponent);


/**
 * @override
 */
Item.prototype.bindModelEvents = function() {
    this.model.listen('toggle' + this.model.item.id, this.onToggle, false, this);
};


/**
 * Toggles the completed state of this todo item.
 */
Item.prototype.toggle = function() {
    this.model.toggle();
};


/**
 * Removes this todo item.
 */
Item.prototype.destroy = function() {
    this.model.remove();
};


/**
 * Toggle event handler. Sets the `completed` class appropriately.
 */
Item.prototype.onToggle = function() {
    goog.dom.classlist.enable(this.getElement(), 'completed', this.model.item.completed);

    this.getChild('.toggle')[0].checked = this.model.item.completed;
};


/**
 * @override
 */
Item.prototype.disposeInternal = function() {
    this.model.unlisten('toggle', this.onToggle, false, this);
    this.model.dispose();
    this.model = null;
};


/**
 * @override
 */
Item.prototype.templates_base = function() {
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


Item.prototype.events = {
    'click': {
        '.toggle': Item.prototype.toggle,
        '.destroy': Item.prototype.destroy
    }
};
