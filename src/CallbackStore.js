var CallbackStore = (function () {

  var callbackStore = {};

  var makeCancelable = function (callback, key, context) {
    var cancelableFunction = function () {
      if (!key || !callback || typeof callback !== 'function') return;
      callback.apply(context, arguments);

      // Make it executable just one
      cancelCallback(key);
    };

    cancelableFunction.cancel = function () {
      delete callbackStore[key];
      callback = null;
      context = null;
      key = null;
    };

    callbackStore[key] = cancelableFunction;

    return cancelableFunction;
  };

  var cancelCallback = function (key) {
    if (callbackStore[key]) callbackStore[key].cancel();
  };

  var cancelAllCallbacks = function () {
    Object.keys(callbackStore).forEach(function (key) {
      callbackStore[key].cancel();
    });
  };

  return {
    make: makeCancelable,
    cancel: cancelCallback,
    cancelAll: cancelAllCallbacks,
  };

})();

module.exports = CallbackStore;