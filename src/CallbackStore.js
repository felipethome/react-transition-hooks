function CallbackStore() {
  this._callbackStore = {};
}

CallbackStore.prototype.make = function (callback, key, context) {
  var instance = this;

  var cancelableFunction = function () {
    if (!key || !callback || typeof callback !== 'function') return;
    callback.apply(context, arguments);

    // Make it executable just one
    instance.cancel(key);
  };

  cancelableFunction.cancel = function () {
    delete instance._callbackStore[key];
    callback = null;
    context = null;
    key = null;
  };

  instance._callbackStore[key] = cancelableFunction;

  return cancelableFunction;
};

CallbackStore.prototype.cancel = function (key) {
  if (this._callbackStore[key]) this._callbackStore[key].cancel();
};

CallbackStore.prototype.cancelAll = function () {
  Object.keys(this._callbackStore).forEach(function (key) {
    this._callbackStore[key].cancel();
  }, this);
};

module.exports = CallbackStore;