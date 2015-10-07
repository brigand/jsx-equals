A unit testing tool for loosely comparing react element trees.

Works well with the react test-utils addon's shallowRenderer. See examples/Box.test.js for a real example.
It's designed to make testing of simple components very easy and not get in your way. This is not
really suitable to larger complex views.


## Install

```sh
npm install --save-dev jsx-equals
```

## Usage

Pass it two arguments, the source and the pattern. To allow loose matching it is not associative.

You will generally hard code the right hand side, while the left hand side is generated e.g. by
shallowRenderer.

```js
jsxEquals(source, pattern);
```

Some variations:

```js
var jsxEquals = require('jsx-equals') // or use es6 import

// passes because b is unspecified
jsxEquals(
  <div a={1} b={2} />,
  <div a={1} />
);


// special shorthand for comparing without importing
jsxEquals(
  <Foo />
  <c-Foo a={1} />
);

// mark elements you don't care about with jsxEquals.ANY
jsxEquals(
  <div>
    <p />
    <span />
    <p />
  </div>,
  <div>
    <jsxEquals.ANY />
    <span />
    <jsxEquals.ANY />
  </div>
);
```



