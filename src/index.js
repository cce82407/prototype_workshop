// Prototypes
// As a friendly reminder, here is an example of prototypal inheritance. You can read more about it here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
// Uncomment my logs to see it in action!

function Mammal(name, age = 0) {
  if (!name || typeof name !== 'string') {
    throw new Error('Mammals need a name!');
  }

  this.name = name;
  this.age = age;
}

Mammal.prototype.milk = function() {
  console.log('Milking sounds?');
}

Mammal.prototype.birthday = function() {
  ++this.age;
  console.log(`Its my birthday! 🎉🎉🎉 I am now ${this.age} years old.`);
}

const bob = new Mammal('Bob');

// console.log('Bob the Mammal Logs: ');
// bob.milk();

function Dog(name, age, breed = 'Australian Shepard') {
  Mammal.call(this, name, age);
  this.breed = breed;
}

Dog.prototype = Object.create(Mammal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`Bark. Woof. I am ${this.name} the ${this.breed} and I am ${this.age} years old. I also speak english fluently.`);
}

const winston = new Dog('Winston');

// console.log('Winston the Dog Logs: ');
// winston.birthday();
// winston.bark();
// winston.milk();

// console.log(`Validate I know what I'm doing: `);
// console.log('Is bob an instance of Mammal?', bob instanceof Mammal);
// console.log('Is winston an instance of Dog?', winston instanceof Dog);

// This seems pretty annoying right? What if we built this functionality ourselves? That's what this workshop is all about.

// TODO: You'll have to create these two functions. Look in test/index.test.js to inspect the tests!
class Factory {
  createClass(className, classObj, classSetters, classStaticObj) {
    const NewClass = class {
      constructor(...args) {
        // TO BE CLEAR: The code below can be DRYed up since its reused everywhere. But to do so, makes it somewhat strange code to read (passing "this" contexts around). So I've opted for readability sake to not do so for you guys.
        Object.entries(classObj).forEach(([key, val]) => {
          this[key] = val;

          if (typeof this[key] === 'function') {
            this[key].bind(this);
          }
        });

        if (classSetters && typeof classSetters === 'object') {
          Object.entries(classSetters).forEach(([key, val]) => {
            this[key] = val(args);

            if (typeof this[key] === 'function') {
              this[key].bind(this);
            }
          });
        }
      }
    }

    if (classStaticObj && typeof classStaticObj === 'object') {
      Object.entries(classStaticObj).forEach(([key, val]) => {
        NewClass[key] = val;
      });
    }

    Object.defineProperty(
      NewClass,
      'name',
      { value: className },
    );

    return NewClass;
  }

  extendClass(ClassToExtend, className, classObj, classSetters, classStaticObj) {
    const NewClass = class extends ClassToExtend {
      constructor(...args) {
        super(...args);
        Object.entries(classObj).forEach(([key, val]) => {
          this[key] = val;

          if (typeof this[key] === 'function') {
            this[key].bind(this);
          }
        });

        if (classSetters && typeof classSetters === 'object') {
          Object.entries(classSetters).forEach(([key, val]) => {
            this[key] = val(args);

            if (typeof this[key] === 'function') {
              this[key].bind(this);
            }
          });
        }
      }
    }

    if (classStaticObj && typeof classStaticObj === 'object') {
      Object.entries(classStaticObj).forEach(([key, val]) => {
        NewClass[key] = val;
      });
    }

    Object.defineProperty(
      NewClass,
      'name',
      { value: className },
    );

    return NewClass;
  }
}

const theFactory = new Factory();
console.log(theFactory)
module.exports = theFactory;