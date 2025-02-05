"use strict";
class Person {
    constructor(id, firstname, lastname, age, isAlive = false, phoneNumbers = []) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.isAlive = isAlive;
        this.phoneNumbers = phoneNumbers;
    }
    toString() {
        const phones = this.phoneNumbers.map(phone => phone.toString()).join(", ");
        return `${this.firstname} ${this.lastname}, age: ${this.age}, Alive: ${this.isAlive}, Phones: ${phones}`;
    }
}
