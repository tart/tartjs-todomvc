goog.module('todomvc.ui.RootView');

var KeyHandler = goog.require('goog.events.KeyHandler');
var MessageFormat = goog.require('goog.i18n.MessageFormat');
var DlgComponent = goog.require('tart.ui.DlgComponent');
var RootViewModel = goog.require('todomvc.ui.RootViewModel');
var ListView = goog.require('todomvc.ui.todo.ListView');



/**
 *
 * @constructor
 * @extends {DlgComponent}
 */
function RootView() {
    this.model = new RootViewModel();
    RootView.base(this, 'constructor');

    this.listView = new ListView();
    this.itemsFormatter = new MessageFormat(
        '{NUM_ITEMS, selectordinal, ' +
        'one {item left} ' +
        'other {items left}}');
}
goog.inherits(RootView, DlgComponent);


/**
 * @override
 */
RootView.prototype.bindModelEvents = function() {
    this.model.listen('update', this.onUpdate, false, this);
};


RootView.prototype.toggleAll = function() {
    this.model.toggleAll();
};


RootView.prototype.clearCompleted = function() {
    this.model.clearCompleted();
};


/**
 *
 * @param {goog.events.BrowserEvent} e
 */
RootView.prototype.createTodo = function(e) {
    if (e.keyCode != goog.events.KeyCodes.ENTER) return;

    var input = this.getChild('.new-todo')[0];

    var title = input.value.trim();

    if (!title) return;

    this.model.addTodo(title);

    input.value = '';
};


RootView.prototype.render = function(opt_base) {
    RootView.base(this, 'render', opt_base);

    this.keyHandler = new KeyHandler(this.getChild('.new-todo')[0]);
    this.keyHandler.listen(KeyHandler.EventType.KEY, this.createTodo, false, this);
};


RootView.prototype.onUpdate = function() {
    var hideClearCompletedButton = this.model.uncompletedCount == this.model.items.length;

    this.getChild('strong')[0].textContent = this.model.uncompletedCount;
    this.getChild('.toggle-all')[0].checked = this.model.isCompleted;
    this.getChild('.todo-count')[0].innerHTML = this.templates_items_counter();

    goog.dom.classlist.enable(this.getChild('.footer')[0], 'hidden', this.model.items.length == 0);
    goog.dom.classlist.enable(this.getChild('.main')[0], 'hidden', this.model.items.length == 0);
    goog.dom.classlist.enable(this.getChild('.clear-completed')[0], 'hidden', hideClearCompletedButton);
};


/**
 * @override
 */
RootView.prototype.templates_base = function() {
    return '<view id="' + this.getId() + '">' +
        this.templates_section() +
        this.templates_footer() +
        '</view>';
};


/**
 * @return {string} Main section template.
 */
RootView.prototype.templates_section = function() {
    var checked = this.model.isCompleted ? 'checked' : '';


    return '<section class="todoapp">' +
        this.templates_header() +
        '<!-- This section should be hidden by default and shown when there are todos -->' +
        '<section class="main">' +
        '<input class="toggle-all" type="checkbox"' + checked + '>' +
        '<label for="toggle-all">Mark all as complete</label>' +
        this.listView.getPlaceholder() +
        '</section>' +
        this.templates_todo_footer() +
        '</section>';
};


/**
 * @return {string} Header template.
 */
RootView.prototype.templates_header = function() {
    return '<header class="header">' +
        '<h1>todos</h1>' +
        '<input class="new-todo" placeholder="What needs to be done?" autofocus>' +
        '</header>';
};


RootView.prototype.templates_items_counter = function() {
    var message = this.itemsFormatter.format({'NUM_ITEMS': this.model.uncompletedCount});

    return '<strong>' + this.model.uncompletedCount + '</strong> ' + message;
};


RootView.prototype.templates_todo_footer = function() {
    var hidden = this.model.items.length == 0 ? ' hidden' : '';

    return '<footer class="footer ' + hidden + '">' +
        '<span class="todo-count">' + this.templates_items_counter() + '</span>' +
            //'<ul class="filters">' +
            //'<li>' +
            //'<a class="selected" href="#/">All</a>' +
            //'</li>' +
            //'<li>' +
            //'<a href="#/active">Active</a>' +
            //'</li>' +
            //'<li>' +
            //'<a href="#/completed">Completed</a>' +
            //'</li>' +
            //'</ul>' +
        '<button class="clear-completed">Clear completed</button>' +
        '</footer>';
};


/**
 * @return {string} Footer template.
 */
RootView.prototype.templates_footer = function() {
    return '<footer class="info">' +
        '<p>Double-click to edit a todo</p>' +
        '<p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>' +
        '<p>Created by <a href="http://todomvc.com">you</a></p>' +
        '<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>' +
        '</footer>';
};


RootView.prototype.events = {
    'click': {
        '.toggle-all': RootView.prototype.toggleAll,
        '.clear-completed': RootView.prototype.clearCompleted
    }
};


exports = RootView;

