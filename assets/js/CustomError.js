/**
 * Create new CustomError Object
 *
 * @constructor
 * @this {CustomError}
 */
CustomError = function() {}


/**
 * Display an error message
 *
 * @this {CustomError}
 * @param {Object} error - Error
 * @param {string} msg - Message to display
 */
CustomError.displayError = function (error, msg) {
    console.log(error);
    alert(msg);
}
