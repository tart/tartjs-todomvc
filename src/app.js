goog.provide('todomvc.app');
goog.require('goog.array');
goog.require('todomvc.components.Root.RootView');



todomvc.app = function() {
    new todomvc.components.Root.RootView().render(document.body);
};

goog.exportSymbol('app', todomvc.app);
