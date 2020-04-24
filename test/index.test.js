const theFactory = require('../src/index.js');

// Change "xit" to "it" to enable a test.
describe('Factory', () => {
  describe('createClass', () => {
    it('can take an object and create a class with it, assigning primitive values to keys', () => {
      const Mammal = theFactory.createClass(
        'Mammal',
        {
          name: 'clementine',
        },
      );

      const clementine = new Mammal();
        console.log(clementine)
      expect(clementine.name).toEqual('clementine');
    });

    it('can take a second object and use the functions it provides to create values for keys', () => {
      const Mammal = theFactory.createClass(
        'Mammal',
        {
          name: '',
          age: 0,
        },
        {
          name: function(constructorArgs) {
            return constructorArgs[0];
          },
          age: function(constructorArgs) {
            return constructorArgs[1];
          },
        },
      );

      const clementine = new Mammal('clementine', 5);

      expect(clementine.name).toEqual('clementine');
      expect(clementine.age).toEqual(5);
    });

    it('can be assigned functions that properly receive their "this" context', () => {
      const originalLog = console.log;

      console.log = function(...args) {
        expect(args[0]).toEqual('Milking sounds?');
        originalLog(...args);
      };

      const Mammal = theFactory.createClass(
        'Mammal',
        {
          milk() {
            console.log('Milking sounds?');
          },
          birthday() {
            ++this.age;
          },
        },
        {
          name: function(constructorArgs) {
            return constructorArgs[0];
          },
          age: function(constructorArgs) {
            return constructorArgs[1];
          },
        },
      );

      const clementine = new Mammal('clementine', 5);
      clementine.milk();

      expect(clementine.age).toEqual(5);

      clementine.birthday();

      expect(clementine.age).toEqual(6);

      console.log = originalLog;
    });
  });

  describe('extendClass', () => {
    let Mammal;

    beforeEach(() => {
      Mammal = theFactory.createClass(
        'Mammal',
        {
          milk() {
            console.log('Milking sounds?');
          },
          birthday() {
            ++this.age;
          },
        },
        {
          name(constructorArgs) {
            return constructorArgs[0];
          },
          age(constructorArgs) {
            return constructorArgs[1];
          },
        },
      );
    });

    it('can create a class by extending another class', () => {
      const originalLog = console.log;

      console.log = function(...args) {
        expect(args[0]).toEqual(`Bark. Woof. I am Winston the Australian Shepard and I am 1 years old. I also speak english fluently.`);
        originalLog(...args);
      };

      const Dog = theFactory.extendClass(
        Mammal,
        'Dog',
        {
          bark() {
            console.log(`Bark. Woof. I am ${this.name} the ${this.breed} and I am ${this.age} years old. I also speak english fluently.`);
          },
        },
        {
          breed(constructorArgs) {
            return constructorArgs[2];
          },
        }
      );

      const winston = new Dog('Winston', 1, 'Australian Shepard');

      winston.bark();

      console.log = originalLog;

      winston.milk();

      winston.birthday();

      expect(winston.age).toEqual(2);
    });
  });

  describe('Bonus', () => {
    let Mammal, Dog, clementine, winston;

    beforeEach(() => {
      Mammal = theFactory.createClass(
        'Mammal',
        {
          milk() {
            console.log('Milking sounds?');
          },
          birthday() {
            ++this.age;
          },
        },
        {
          name(constructorArgs) {
            return constructorArgs[0];
          },
          age(constructorArgs) {
            return constructorArgs[1];
          },
        },
      );

      const puppyNames = [
        'Bowser',
        'Cisco',
        'Lando',
        'Fred',
        'Barney',
        'Bam Bam',
        'Meatwad',
      ];

      const MAX_LITTER_SIZE = 5;

      Dog = theFactory.extendClass(
        Mammal,
        'Dog',
        {
          bark() {
            console.log(`Bark. Woof. I am ${this.name} the ${this.breed} and I am ${this.age} years old. I also speak english fluently.`);
          },
        },
        {
          breed(constructorArgs) {
            return constructorArgs[2];
          },
        },
        // TODO: Make this work if you are doing bonus.
        {
          haveLitter(breed) {
            const copyOfNames = puppyNames.slice();
            const litterSize = Math.ceil(Math.random() * MAX_LITTER_SIZE);

            const bornPuppies = [];

            for (let i = 0; i < litterSize; ++i) {
              const randNameIdx = Math.floor(Math.random() * (copyOfNames.length - 1));
              const [randName] = copyOfNames.splice(randNameIdx, 1);

              bornPuppies.push(new Dog(randName, 0, breed));
            }

            return bornPuppies;
          },
        },
      );

      clementine = new Mammal('Clementine', 0);
      winston = new Dog('Winston', 1, 'Australian Shepard');
    });

    it('has the proper name when inspecting a classes constructor', () => {
      expect(clementine.constructor.name).toEqual('Mammal');
      expect(winston.constructor.name).toEqual('Dog');
    });

    it('can accept an additional argument specifying static methods', () => {
      const litter = Dog.haveLitter('Australian Shepard');

      expect(litter.length).toBeGreaterThan(0);

      litter.forEach((puppy) => {
        expect(puppy instanceof Dog).toBeTruthy();
      });
    });
  });
});
