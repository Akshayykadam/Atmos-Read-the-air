if (!Array.prototype.toReversed) {
    Array.prototype.toReversed = function () {
        return this.slice().reverse();
    };
}
console.log('Polyfill loaded: Array.prototype.toReversed');
