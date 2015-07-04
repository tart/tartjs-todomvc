goog.module('todomvc.ui.todo.ItemView');

var classlist = goog.require('goog.dom.classlist');
var DlgComponent = goog.require('tart.ui.DlgComponent');
var ItemViewModel = goog.require('todomvc.ui.todo.ItemViewModel');



/**
 *
 * @constructor
 * @extends {tart.ui.DlgComponent}
 */
function ItemView(item) {
    this.model = new ItemViewModel(item);
    ItemView.base(this, 'constructor');
}
goog.inherits(ItemView, DlgComponent);


/**
 * @override
 */
ItemView.prototype.bindModelEvents = function() {
    this.model.listen('toggle' + this.model.item.id, this.onToggle, false, this);
};


/**
 * Toggles the completed state of this todo item.
 */
ItemView.prototype.toggle = function() {
    this.model.toggle();
};


/**
 * Removes this todo item.
 */
ItemView.prototype.destroy = function() {
    this.model.remove();
};


/**
 * Toggle event handler. Sets the `completed` class appropriately.
 */
ItemView.prototype.onToggle = function() {
    goog.dom.classlist.enable(this.getElement(), 'completed', this.model.item.completed);

    this.getChild('.toggle')[0].checked = this.model.item.completed;
};


/**
 * @override
 */
ItemView.prototype.disposeInternal = function() {
    this.model.unlisten('toggle', this.onToggle, false, this);
    this.model.dispose();
    this.model = null;
};


/**
 * @override
 */
ItemView.prototype.templates_base = function() {
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


ItemView.prototype.events = {
    'click': {
        '.toggle': ItemView.prototype.toggle,
        '.destroy': ItemView.prototype.destroy
    }
};


exports = ItemView;

