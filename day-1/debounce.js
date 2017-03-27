debounce = (func, wait) => {
    var timeout;
    return function() {
        var args = arguments;
        var later = () => {
            timeout = null;
            func.apply(this, args);
        }
        clearTimeout(timeout);
        timeout = setTimeout(later, wait)
    }
}