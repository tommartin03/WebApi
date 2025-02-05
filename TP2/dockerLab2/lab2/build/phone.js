"use strict";
class Phone {
    constructor(number, type = "unknown") {
        this.number = number;
        this.type = type;
    }
    toString() {
        return `${this.type}: ${this.number}`;
    }
}
