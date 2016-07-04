module.exports = function(callback, context) {
  var cancelableFunction = function () {
    if (!callback || typeof callback !== 'function') return;
    callback.apply(context, arguments);

    // Make it executable just one
    cancelableFunction.cancel();
  };

  cancelableFunction.cancel = function () {
    callback = null;
    context = null;
  };

  return cancelableFunction;
};