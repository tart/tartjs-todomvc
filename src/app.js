goog.provide('todomvc.app');
goog.require('goog.array');
goog.require('todomvc.RootView');



todomvc.app = function() {
    new todomvc.RootView().render(document.body);
};

goog.exportSymbol('app', todomvc.app);
