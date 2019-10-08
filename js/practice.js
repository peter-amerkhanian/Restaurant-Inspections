var Person = /** @class */ (function () {
    function Person(firstName, lastName, dob) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = new Date(dob);
    }
    Person.prototype.getFullName = function () {
        return this.firstName + " " + this.lastName;
    };
    return Person;
}());
var person1 = new Person('John', 'Amer', '4-3-1980');
var person2 = new Person('Mary', 'John', '9-2-1990');
console.log(person2.getFullName());
