(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var common = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory(exports);
	}(commonjsGlobal, (function (exports) {
	  /**
	   * Common helpers which do not require polyfill.
	   *
	   * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
	   * so that the polyfill can be properly tree-shaken and does not burden
	   * the components that do not need that helper
	   *
	   * @module common/index
	   */

	  /**
	   * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
	   * This seems to fail in IE8, requires more investigation.
	   * See: https://github.com/imagitama/nodelist-foreach-polyfill
	   *
	   * @param {NodeListOf<Element>} nodes - NodeList from querySelectorAll()
	   * @param {nodeListIterator} callback - Callback function to run for each node
	   * @returns {void}
	   */
	  function nodeListForEach (nodes, callback) {
	    if (window.NodeList.prototype.forEach) {
	      return nodes.forEach(callback)
	    }
	    for (var i = 0; i < nodes.length; i++) {
	      callback.call(window, nodes[i], i, nodes);
	    }
	  }

	  /**
	   * Used to generate a unique string, allows multiple instances of the component
	   * without them conflicting with each other.
	   * https://stackoverflow.com/a/8809472
	   *
	   * @returns {string} Unique ID
	   */
	  function generateUniqueID () {
	    var d = new Date().getTime();
	    if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
	      d += window.performance.now(); // use high-precision timer if available
	    }
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = (d + Math.random() * 16) % 16 | 0;
	      d = Math.floor(d / 16);
	      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
	    })
	  }

	  /**
	   * Config flattening function
	   *
	   * Takes any number of objects, flattens them into namespaced key-value pairs,
	   * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
	   * greatest priority on the LAST item passed in.
	   *
	   * @returns {Object<string, unknown>} A flattened object of key-value pairs.
	   */
	  function mergeConfigs (/* configObject1, configObject2, ...configObjects */) {
	    /**
	     * Function to take nested objects and flatten them to a dot-separated keyed
	     * object. Doing this means we don't need to do any deep/recursive merging of
	     * each of our objects, nor transform our dataset from a flat list into a
	     * nested object.
	     *
	     * @param {Object<string, unknown>} configObject - Deeply nested object
	     * @returns {Object<string, unknown>} Flattened object with dot-separated keys
	     */
	    var flattenObject = function (configObject) {
	      // Prepare an empty return object
	      var flattenedObject = {};

	      /**
	       * Our flattening function, this is called recursively for each level of
	       * depth in the object. At each level we prepend the previous level names to
	       * the key using `prefix`.
	       *
	       * @param {Partial<Object<string, unknown>>} obj - Object to flatten
	       * @param {string} [prefix] - Optional dot-separated prefix
	       */
	      var flattenLoop = function (obj, prefix) {
	        // Loop through keys...
	        for (var key in obj) {
	          // Check to see if this is a prototypical key/value,
	          // if it is, skip it.
	          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
	            continue
	          }
	          var value = obj[key];
	          var prefixedKey = prefix ? prefix + '.' + key : key;
	          if (typeof value === 'object') {
	            // If the value is a nested object, recurse over that too
	            flattenLoop(value, prefixedKey);
	          } else {
	            // Otherwise, add this value to our return object
	            flattenedObject[prefixedKey] = value;
	          }
	        }
	      };

	      // Kick off the recursive loop
	      flattenLoop(configObject);
	      return flattenedObject
	    };

	    // Start with an empty object as our base
	    var formattedConfigObject = {};

	    // Loop through each of the remaining passed objects and push their keys
	    // one-by-one into configObject. Any duplicate keys will override the existing
	    // key with the new value.
	    for (var i = 0; i < arguments.length; i++) {
	      var obj = flattenObject(arguments[i]);
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) {
	          formattedConfigObject[key] = obj[key];
	        }
	      }
	    }

	    return formattedConfigObject
	  }

	  /**
	   * Extracts keys starting with a particular namespace from a flattened config
	   * object, removing the namespace in the process.
	   *
	   * @param {Object<string, unknown>} configObject - The object to extract key-value pairs from.
	   * @param {string} namespace - The namespace to filter keys with.
	   * @returns {Object<string, unknown>} Flattened object with dot-separated key namespace removed
	   * @throws {Error} Config object required
	   * @throws {Error} Namespace string required
	   */
	  function extractConfigByNamespace (configObject, namespace) {
	    // Check we have what we need
	    if (!configObject || typeof configObject !== 'object') {
	      throw new Error('Provide a `configObject` of type "object".')
	    }
	    if (!namespace || typeof namespace !== 'string') {
	      throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.')
	    }
	    var newObject = {};
	    for (var key in configObject) {
	      // Split the key into parts, using . as our namespace separator
	      var keyParts = key.split('.');
	      // Check if the first namespace matches the configured namespace
	      if (Object.prototype.hasOwnProperty.call(configObject, key) && keyParts[0] === namespace) {
	        // Remove the first item (the namespace) from the parts array,
	        // but only if there is more than one part (we don't want blank keys!)
	        if (keyParts.length > 1) {
	          keyParts.shift();
	        }
	        // Join the remaining parts back together
	        var newKey = keyParts.join('.');
	        // Add them to our new object
	        newObject[newKey] = configObject[key];
	      }
	    }
	    return newObject
	  }

	  /**
	   * @callback nodeListIterator
	   * @param {Element} value - The current node being iterated on
	   * @param {number} index - The current index in the iteration
	   * @param {NodeListOf<Element>} nodes - NodeList from querySelectorAll()
	   * @returns {void}
	   */

	  // Implementation of common function is gathered in the `common` folder

	  exports.nodeListForEach = nodeListForEach;
	  exports.generateUniqueID = generateUniqueID;
	  exports.mergeConfigs = mergeConfigs;
	  exports.extractConfigByNamespace = extractConfigByNamespace;

	})));

	});

	var all = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory();
	}(commonjsGlobal, (function () {
	  function ownKeys(object, enumerableOnly) {
	    var keys = Object.keys(object);

	    if (Object.getOwnPropertySymbols) {
	      var symbols = Object.getOwnPropertySymbols(object);
	      enumerableOnly && (symbols = symbols.filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	      })), keys.push.apply(keys, symbols);
	    }

	    return keys;
	  }

	  function _objectSpread2(target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = null != arguments[i] ? arguments[i] : {};
	      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }

	    return target;
	  }

	  function _typeof(obj) {
	    "@babel/helpers - typeof";

	    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	      return typeof obj;
	    } : function (obj) {
	      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    }, _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    Object.defineProperty(Constructor, "prototype", {
	      writable: false
	    });
	    return Constructor;
	  }

	  function _defineProperty(obj, key, value) {
	    if (key in obj) {
	      Object.defineProperty(obj, key, {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    } else {
	      obj[key] = value;
	    }

	    return obj;
	  }

	  var commonjsGlobal$$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	  function createCommonjsModule$$1(fn, module) {
	  	return module = { exports: {} }, fn(module, module.exports), module.exports;
	  }

	  var defineProperty = createCommonjsModule$$1(function (module, exports) {
	  (function (global, factory) {
	    factory();
	  })(commonjsGlobal$$1, function () {

	    (function (undefined) {
	      // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
	      var detect = // In IE8, defineProperty could only act on DOM elements, so full support
	      // for the feature requires the ability to set a property on an arbitrary object
	      'defineProperty' in Object && function () {
	        try {
	          var a = {};
	          Object.defineProperty(a, 'test', {
	            value: 42
	          });
	          return true;
	        } catch (e) {
	          return false;
	        }
	      }();

	      if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always

	      (function (nativeDefineProperty) {
	        var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	        var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	        var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	        Object.defineProperty = function defineProperty(object, property, descriptor) {
	          // Where native support exists, assume it
	          if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
	            return nativeDefineProperty(object, property, descriptor);
	          }

	          if (object === null || !(object instanceof Object || typeof object === 'object')) {
	            throw new TypeError('Object.defineProperty called on non-object');
	          }

	          if (!(descriptor instanceof Object)) {
	            throw new TypeError('Property description must be an object');
	          }

	          var propertyString = String(property);
	          var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
	          var getterType = 'get' in descriptor && typeof descriptor.get;
	          var setterType = 'set' in descriptor && typeof descriptor.set; // handle descriptor.get

	          if (getterType) {
	            if (getterType !== 'function') {
	              throw new TypeError('Getter must be a function');
	            }

	            if (!supportsAccessors) {
	              throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
	            }

	            if (hasValueOrWritable) {
	              throw new TypeError(ERR_VALUE_ACCESSORS);
	            }

	            Object.__defineGetter__.call(object, propertyString, descriptor.get);
	          } else {
	            object[propertyString] = descriptor.value;
	          } // handle descriptor.set


	          if (setterType) {
	            if (setterType !== 'function') {
	              throw new TypeError('Setter must be a function');
	            }

	            if (!supportsAccessors) {
	              throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
	            }

	            if (hasValueOrWritable) {
	              throw new TypeError(ERR_VALUE_ACCESSORS);
	            }

	            Object.__defineSetter__.call(object, propertyString, descriptor.set);
	          } // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above


	          if ('value' in descriptor) {
	            object[propertyString] = descriptor.value;
	          }

	          return object;
	        };
	      })(Object.defineProperty);
	    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal$$1 && commonjsGlobal$$1 || {});
	  });
	  });

	  var bind = createCommonjsModule$$1(function (module, exports) {
	  (function (global, factory) {
	    factory();
	  })(commonjsGlobal$$1, function () {

	    (function (undefined) {
	      // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
	      var detect = // In IE8, defineProperty could only act on DOM elements, so full support
	      // for the feature requires the ability to set a property on an arbitrary object
	      'defineProperty' in Object && function () {
	        try {
	          var a = {};
	          Object.defineProperty(a, 'test', {
	            value: 42
	          });
	          return true;
	        } catch (e) {
	          return false;
	        }
	      }();

	      if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always

	      (function (nativeDefineProperty) {
	        var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	        var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	        var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	        Object.defineProperty = function defineProperty(object, property, descriptor) {
	          // Where native support exists, assume it
	          if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
	            return nativeDefineProperty(object, property, descriptor);
	          }

	          if (object === null || !(object instanceof Object || typeof object === 'object')) {
	            throw new TypeError('Object.defineProperty called on non-object');
	          }

	          if (!(descriptor instanceof Object)) {
	            throw new TypeError('Property description must be an object');
	          }

	          var propertyString = String(property);
	          var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
	          var getterType = 'get' in descriptor && typeof descriptor.get;
	          var setterType = 'set' in descriptor && typeof descriptor.set; // handle descriptor.get

	          if (getterType) {
	            if (getterType !== 'function') {
	              throw new TypeError('Getter must be a function');
	            }

	            if (!supportsAccessors) {
	              throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
	            }

	            if (hasValueOrWritable) {
	              throw new TypeError(ERR_VALUE_ACCESSORS);
	            }

	            Object.__defineGetter__.call(object, propertyString, descriptor.get);
	          } else {
	            object[propertyString] = descriptor.value;
	          } // handle descriptor.set


	          if (setterType) {
	            if (setterType !== 'function') {
	              throw new TypeError('Setter must be a function');
	            }

	            if (!supportsAccessors) {
	              throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
	            }

	            if (hasValueOrWritable) {
	              throw new TypeError(ERR_VALUE_ACCESSORS);
	            }

	            Object.__defineSetter__.call(object, propertyString, descriptor.set);
	          } // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above


	          if ('value' in descriptor) {
	            object[propertyString] = descriptor.value;
	          }

	          return object;
	        };
	      })(Object.defineProperty);
	    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal$$1 && commonjsGlobal$$1 || {});
	    (function (undefined) {
	      // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
	      var detect = ('bind' in Function.prototype);
	      if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always

	      Object.defineProperty(Function.prototype, 'bind', {
	        value: function bind(that) {
	          // .length is 1
	          // add necessary es5-shim utilities
	          var $Array = Array;
	          var $Object = Object;
	          var ObjectPrototype = $Object.prototype;
	          var ArrayPrototype = $Array.prototype;

	          var Empty = function Empty() {};

	          var to_string = ObjectPrototype.toString;
	          var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	          var isCallable;
	          /* inlined from https://npmjs.com/is-callable */

	          var fnToStr = Function.prototype.toString,
	              tryFunctionObject = function tryFunctionObject(value) {
	            try {
	              fnToStr.call(value);
	              return true;
	            } catch (e) {
	              return false;
	            }
	          },
	              fnClass = '[object Function]',
	              genClass = '[object GeneratorFunction]';

	          isCallable = function isCallable(value) {
	            if (typeof value !== 'function') {
	              return false;
	            }

	            if (hasToStringTag) {
	              return tryFunctionObject(value);
	            }

	            var strClass = to_string.call(value);
	            return strClass === fnClass || strClass === genClass;
	          };

	          var array_slice = ArrayPrototype.slice;
	          var array_concat = ArrayPrototype.concat;
	          var array_push = ArrayPrototype.push;
	          var max = Math.max; // /add necessary es5-shim utilities
	          // 1. Let Target be the this value.

	          var target = this; // 2. If IsCallable(Target) is false, throw a TypeError exception.

	          if (!isCallable(target)) {
	            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	          } // 3. Let A be a new (possibly empty) internal list of all of the
	          //   argument values provided after thisArg (arg1, arg2 etc), in order.
	          // XXX slicedArgs will stand in for "A" if used


	          var args = array_slice.call(arguments, 1); // for normal call
	          // 4. Let F be a new native ECMAScript object.
	          // 11. Set the [[Prototype]] internal property of F to the standard
	          //   built-in Function prototype object as specified in 15.3.3.1.
	          // 12. Set the [[Call]] internal property of F as described in
	          //   15.3.4.5.1.
	          // 13. Set the [[Construct]] internal property of F as described in
	          //   15.3.4.5.2.
	          // 14. Set the [[HasInstance]] internal property of F as described in
	          //   15.3.4.5.3.

	          var bound;

	          var binder = function () {
	            if (this instanceof bound) {
	              // 15.3.4.5.2 [[Construct]]
	              // When the [[Construct]] internal method of a function object,
	              // F that was created using the bind function is called with a
	              // list of arguments ExtraArgs, the following steps are taken:
	              // 1. Let target be the value of F's [[TargetFunction]]
	              //   internal property.
	              // 2. If target has no [[Construct]] internal method, a
	              //   TypeError exception is thrown.
	              // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	              //   property.
	              // 4. Let args be a new list containing the same values as the
	              //   list boundArgs in the same order followed by the same
	              //   values as the list ExtraArgs in the same order.
	              // 5. Return the result of calling the [[Construct]] internal
	              //   method of target providing args as the arguments.
	              var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));

	              if ($Object(result) === result) {
	                return result;
	              }

	              return this;
	            } else {
	              // 15.3.4.5.1 [[Call]]
	              // When the [[Call]] internal method of a function object, F,
	              // which was created using the bind function is called with a
	              // this value and a list of arguments ExtraArgs, the following
	              // steps are taken:
	              // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	              //   property.
	              // 2. Let boundThis be the value of F's [[BoundThis]] internal
	              //   property.
	              // 3. Let target be the value of F's [[TargetFunction]] internal
	              //   property.
	              // 4. Let args be a new list containing the same values as the
	              //   list boundArgs in the same order followed by the same
	              //   values as the list ExtraArgs in the same order.
	              // 5. Return the result of calling the [[Call]] internal method
	              //   of target providing boundThis as the this value and
	              //   providing args as the arguments.
	              // equiv: target.call(this, ...boundArgs, ...args)
	              return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
	            }
	          }; // 15. If the [[Class]] internal property of Target is "Function", then
	          //     a. Let L be the length property of Target minus the length of A.
	          //     b. Set the length own property of F to either 0 or L, whichever is
	          //       larger.
	          // 16. Else set the length own property of F to 0.


	          var boundLength = max(0, target.length - args.length); // 17. Set the attributes of the length own property of F to the values
	          //   specified in 15.3.5.1.

	          var boundArgs = [];

	          for (var i = 0; i < boundLength; i++) {
	            array_push.call(boundArgs, '$' + i);
	          } // XXX Build a dynamic function with desired amount of arguments is the only
	          // way to set the length property of a function.
	          // In environments where Content Security Policies enabled (Chrome extensions,
	          // for ex.) all use of eval or Function costructor throws an exception.
	          // However in all of these environments Function.prototype.bind exists
	          // and so this code will never be executed.


	          bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

	          if (target.prototype) {
	            Empty.prototype = target.prototype;
	            bound.prototype = new Empty(); // Clean up dangling references.

	            Empty.prototype = null;
	          } // TODO
	          // 18. Set the [[Extensible]] internal property of F to true.
	          // TODO
	          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	          // 20. Call the [[DefineOwnProperty]] internal method of F with
	          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	          //   false.
	          // 21. Call the [[DefineOwnProperty]] internal method of F with
	          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	          //   and false.
	          // TODO
	          // NOTE Function objects created using Function.prototype.bind do not
	          // have a prototype property or the [[Code]], [[FormalParameters]], and
	          // [[Scope]] internal properties.
	          // XXX can't delete prototype in pure-js.
	          // 22. Return F.


	          return bound;
	        }
	      });
	    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal$$1 && commonjsGlobal$$1 || {});
	  });
	  });

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Object/getOwnPropertyDescriptor/detect.js
	    var detect = 'getOwnPropertyDescriptor' in Object && typeof Object.getOwnPropertyDescriptor === 'function' && function () {
	      try {
	        var object = {};
	        object.test = 0;
	        return Object.getOwnPropertyDescriptor(object, "test").value === 0;
	      } catch (exception) {
	        return false;
	      }
	    }();

	    if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.getOwnPropertyDescriptor&flags=always

	    (function () {
	      var call = Function.prototype.call;
	      var prototypeOfObject = Object.prototype;
	      var owns = call.bind(prototypeOfObject.hasOwnProperty);
	      var lookupGetter;
	      var lookupSetter;
	      var supportsAccessors;

	      if (supportsAccessors = owns(prototypeOfObject, "__defineGetter__")) {
	        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
	        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
	      }

	      function doesGetOwnPropertyDescriptorWork(object) {
	        try {
	          object.sentinel = 0;
	          return Object.getOwnPropertyDescriptor(object, "sentinel").value === 0;
	        } catch (exception) {// returns falsy
	        }
	      } // check whether getOwnPropertyDescriptor works if it's given. Otherwise,
	      // shim partially.


	      if (Object.defineProperty) {
	        var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
	        var getOwnPropertyDescriptorWorksOnDom = typeof document == "undefined" || doesGetOwnPropertyDescriptorWork(document.createElement("div"));

	        if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
	          var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
	        }
	      }

	      if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
	        var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

	        Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
	          if (_typeof(object) != "object" && typeof object != "function" || object === null) {
	            throw new TypeError(ERR_NON_OBJECT + object);
	          } // make a valiant attempt to use the real getOwnPropertyDescriptor
	          // for I8's DOM elements.


	          if (getOwnPropertyDescriptorFallback) {
	            try {
	              return getOwnPropertyDescriptorFallback.call(Object, object, property);
	            } catch (exception) {// try the shim if the real one doesn't work
	            }
	          } // If object does not owns property return undefined immediately.


	          if (!owns(object, property)) {
	            return;
	          } // If object has a property then it's for sure both `enumerable` and
	          // `configurable`.


	          var descriptor = {
	            enumerable: true,
	            configurable: true
	          }; // If JS engine supports accessor properties then property may be a
	          // getter or setter.

	          if (supportsAccessors) {
	            // Unfortunately `__lookupGetter__` will return a getter even
	            // if object has own non getter property along with a same named
	            // inherited getter. To avoid misbehavior we temporary remove
	            // `__proto__` so that `__lookupGetter__` will return getter only
	            // if it's owned by an object.
	            var prototype = object.__proto__;
	            object.__proto__ = prototypeOfObject;
	            var getter = lookupGetter(object, property);
	            var setter = lookupSetter(object, property); // Once we have getter and setter we can put values back.

	            object.__proto__ = prototype;

	            if (getter || setter) {
	              if (getter) {
	                descriptor.get = getter;
	              }

	              if (setter) {
	                descriptor.set = setter;
	              } // If it was accessor property we're done and return here
	              // in order to avoid adding `value` to the descriptor.


	              return descriptor;
	            }
	          } // If we got this far we know that object has an own property that is
	          // not an accessor so we set it as a value and return descriptor.


	          descriptor.value = object[property];
	          descriptor.writable = true;
	          return descriptor;
	        };
	      }
	    })();
	  }).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  var Document$1 = createCommonjsModule$$1(function (module, exports) {
	  (function (global, factory) {
	    factory();
	  })(commonjsGlobal$$1, function () {

	    (function (undefined) {
	      // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
	      var detect = ("Document" in this);
	      if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always

	      if (typeof WorkerGlobalScope === "undefined" && typeof importScripts !== "function") {
	        if (this.HTMLDocument) {
	          // IE8
	          // HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
	          this.Document = this.HTMLDocument;
	        } else {
	          // Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
	          this.Document = this.HTMLDocument = document.constructor = new Function('return function Document() {}')();
	          this.Document.prototype = document;
	        }
	      }
	    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal$$1 && commonjsGlobal$$1 || {});
	  });
	  });

	  var Element_1 = createCommonjsModule$$1(function (module, exports) {
	  (function (global, factory) {
	    factory();
	  })(commonjsGlobal$$1, function () {

	    (function (undefined) {
	      // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
	      var detect = ("Document" in this);
	      if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always

	      if (typeof WorkerGlobalScope === "undefined" && typeof importScripts !== "function") {
	        if (this.HTMLDocument) {
	          // IE8
	          // HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
	          this.Document = this.HTMLDocument;
	        } else {
	          // Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
	          this.Document = this.HTMLDocument = document.constructor = new Function('return function Document() {}')();
	          this.Document.prototype = document;
	        }
	      }
	    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal$$1 && commonjsGlobal$$1 || {});
	    (function (undefined) {
	      // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
	      var detect = 'Element' in this && 'HTMLElement' in this;
	      if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always

	      (function () {
	        // IE8
	        if (window.Element && !window.HTMLElement) {
	          window.HTMLElement = window.Element;
	          return;
	        } // create Element constructor


	        window.Element = window.HTMLElement = new Function('return function Element() {}')(); // generate sandboxed iframe

	        var vbody = document.appendChild(document.createElement('body'));
	        var frame = vbody.appendChild(document.createElement('iframe')); // use sandboxed iframe to replicate Element functionality

	        var frameDocument = frame.contentWindow.document;
	        var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
	        var cache = {}; // polyfill Element.prototype on an element

	        var shiv = function (element, deep) {
	          var childNodes = element.childNodes || [],
	              index = -1,
	              key,
	              value,
	              childNode;

	          if (element.nodeType === 1 && element.constructor !== Element) {
	            element.constructor = Element;

	            for (key in cache) {
	              value = cache[key];
	              element[key] = value;
	            }
	          }

	          while (childNode = deep && childNodes[++index]) {
	            shiv(childNode, deep);
	          }

	          return element;
	        };

	        var elements = document.getElementsByTagName('*');
	        var nativeCreateElement = document.createElement;
	        var interval;
	        var loopLimit = 100;
	        prototype.attachEvent('onpropertychange', function (event) {
	          var propertyName = event.propertyName,
	              nonValue = !cache.hasOwnProperty(propertyName),
	              newValue = prototype[propertyName],
	              oldValue = cache[propertyName],
	              index = -1,
	              element;

	          while (element = elements[++index]) {
	            if (element.nodeType === 1) {
	              if (nonValue || element[propertyName] === oldValue) {
	                element[propertyName] = newValue;
	              }
	            }
	          }

	          cache[propertyName] = newValue;
	        });
	        prototype.constructor = Element;

	        if (!prototype.hasAttribute) {
	          // <Element>.hasAttribute
	          prototype.hasAttribute = function hasAttribute(name) {
	            return this.getAttribute(name) !== null;
	          };
	        } // Apply Element prototype to the pre-existing DOM as soon as the body element appears.


	        function bodyCheck() {
	          if (!loopLimit--) clearTimeout(interval);

	          if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
	            shiv(document, true);
	            if (interval && document.body.prototype) clearTimeout(interval);
	            return !!document.body.prototype;
	          }

	          return false;
	        }

	        if (!bodyCheck()) {
	          document.onreadystatechange = bodyCheck;
	          interval = setInterval(bodyCheck, 25);
	        } // Apply to any new elements created after load


	        document.createElement = function createElement(nodeName) {
	          var element = nativeCreateElement(String(nodeName).toLowerCase());
	          return shiv(element);
	        }; // remove sandboxed iframe


	        document.removeChild(vbody);
	      })();
	    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal$$1 && commonjsGlobal$$1 || {});
	  });
	  });

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/document/querySelector/detect.js
	    var detect = 'document' in this && 'querySelector' in this.document;
	    if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always

	    (function () {
	      var head = document.getElementsByTagName('head')[0];

	      function getElementsByQuery(node, selector, one) {
	        var generator = document.createElement('div'),
	            id = 'qsa' + String(Math.random()).slice(3),
	            style,
	            elements;
	        generator.innerHTML = 'x<style>' + selector + '{qsa:' + id + ';}';
	        style = head.appendChild(generator.lastChild);
	        elements = getElements(node, selector, one, id);
	        head.removeChild(style);
	        return one ? elements[0] : elements;
	      }

	      function getElements(node, selector, one, id) {
	        var validNode = /1|9/.test(node.nodeType),
	            childNodes = node.childNodes,
	            elements = [],
	            index = -1,
	            childNode;

	        if (validNode && node.currentStyle && node.currentStyle.qsa === id) {
	          if (elements.push(node) && one) {
	            return elements;
	          }
	        }

	        while (childNode = childNodes[++index]) {
	          elements = elements.concat(getElements(childNode, selector, one, id));

	          if (one && elements.length) {
	            return elements;
	          }
	        }

	        return elements;
	      }

	      Document.prototype.querySelector = Element.prototype.querySelector = function querySelectorAll(selector) {
	        return getElementsByQuery(this, selector, true);
	      };

	      Document.prototype.querySelectorAll = Element.prototype.querySelectorAll = function querySelectorAll(selector) {
	        return getElementsByQuery(this, selector, false);
	      };
	    })();
	  }).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Element/prototype/dataset/detect.js
	    (function () {
	      if (!document.documentElement.dataset) {
	        return false;
	      }

	      var el = document.createElement('div');
	      el.setAttribute("data-a-b", "c");
	      return el.dataset && el.dataset.aB == "c";
	    })(); // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.dataset&flags=always


	    Object.defineProperty(Element.prototype, 'dataset', {
	      get: function get() {
	        var element = this;
	        var attributes = this.attributes;
	        var map = {};

	        for (var i = 0; i < attributes.length; i++) {
	          var attribute = attributes[i];

	          if (attribute && attribute.name && /^data-\w[\w\-]*$/.test(attribute.name)) {
	            var name = attribute.name;
	            var value = attribute.value;
	            var propName = name.substr(5).replace(/-./g, function (prop) {
	              return prop.charAt(1).toUpperCase();
	            });
	            Object.defineProperty(map, propName, {
	              enumerable: this.enumerable,
	              get: function () {
	                return this.value;
	              }.bind({
	                value: value || ''
	              }),
	              set: function setter(name, value) {
	                if (typeof value !== 'undefined') {
	                  this.setAttribute(name, value);
	                } else {
	                  this.removeAttribute(name);
	                }
	              }.bind(element, name)
	            });
	          }
	        }

	        return map;
	      }
	    });
	  }).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  // eslint-disable-next-line  import/prefer-default-export
	  function debounce(func, wait, immediate) {
	    var _this = this;

	    var timeout;
	    return function () {
	      for (var _len = arguments.length, theParams = new Array(_len), _key = 0; _key < _len; _key++) {
	        theParams[_key] = arguments[_key];
	      }

	      var context = _this;

	      var later = function later() {
	        timeout = null;
	        if (!immediate) func.apply(context, theParams);
	      };

	      var callNow = immediate && !timeout;
	      clearTimeout(timeout);
	      timeout = setTimeout(later, wait);
	      if (callNow) func.apply(context, theParams);
	    };
	  }

	  // TODO
	  // Retrieve breakpoints from Sass vars?
	  var breakpoints = {
	    xs: 0,
	    mobile: 320,
	    tablet: 641,
	    desktop: 769
	  };
	  function getCurrentBreakpoint(windowWidth) {
	    var reducer = function reducer(acc, curr) {
	      var windowInsideBreakpoint = (windowWidth || window.innerWidth) >= breakpoints[curr];
	      return windowInsideBreakpoint ? curr : acc;
	    };

	    return Object.keys(breakpoints).reduce(reducer);
	  }

	  var isSmall = function isSmall(element) {
	    return element.innerWidth <= 768;
	  };

	  function AccountMenu($module) {
	    this.$module = document.querySelector($module);
	    this.$moduleBottomMargin = this.$module.style.marginBottom;
	    this.$mainNav = this.$module.querySelector('.hmrc-account-menu__main');
	    this.$showNavLinkMobile = this.$module.querySelector('.hmrc-account-menu__link--menu');
	    this.$currentBreakpoint = getCurrentBreakpoint();
	  }

	  AccountMenu.prototype.init = function init() {
	    this.setup();
	    this.$showNavLinkMobile.addEventListener('click', this.eventHandlers.showNavLinkMobileClick.bind(this));
	    window.addEventListener('resize', debounce(this.reinstantiate.bind(this)));
	  };

	  AccountMenu.prototype.reinstantiate = function reinstantiate(resizeEvent) {
	    var newBreakpoint = getCurrentBreakpoint(resizeEvent.target.innerWidth);
	    var hasCrossedBreakpoint = this.$currentBreakpoint !== newBreakpoint;

	    if (hasCrossedBreakpoint) {
	      this.$currentBreakpoint = newBreakpoint;
	      this.setup();
	    }
	  };

	  AccountMenu.prototype.eventHandlers = {
	    showNavLinkMobileClick: function showNavLinkMobileClick(event) {
	      event.preventDefault();

	      if (isSmall(window)) {
	        if (this.$mainNav.classList.contains('main-nav-is-open')) {
	          this.hideMainNavMobile(event.currentTarget);
	        } else {
	          this.showMainNavMobile();
	        }
	      }
	    }
	  };

	  AccountMenu.prototype.setup = function setup() {
	    if (isSmall(window)) {
	      this.$module.classList.add('is-smaller');
	      this.$showNavLinkMobile.setAttribute('aria-hidden', 'false');
	      this.$showNavLinkMobile.removeAttribute('tabindex');
	      this.$showNavLinkMobile.classList.remove('js-hidden');
	      this.hideMainNavMobile(this.$showNavLinkMobile);
	    } else {
	      this.$module.classList.remove('is-smaller');
	      this.$mainNav.classList.remove('main-nav-is-open', 'js-hidden');
	      this.$showNavLinkMobile.setAttribute('aria-hidden', 'true');
	      this.$showNavLinkMobile.setAttribute('tabindex', '-1');
	      this.$showNavLinkMobile.classList.add('js-hidden');
	    }
	  };

	  AccountMenu.prototype.showMainNavMobile = function showMainNavMobile() {
	    // TODO: shall we add main-nav-is-open to `nav`????
	    this.$mainNav.classList.remove('js-hidden');
	    this.$mainNav.classList.add('main-nav-is-open');
	    this.$mainNav.setAttribute('aria-expanded', 'true');
	    this.$showNavLinkMobile.setAttribute('aria-expanded', 'true');
	    this.$showNavLinkMobile.classList.add('hmrc-account-home--account--is-open');
	  };

	  AccountMenu.prototype.hideMainNavMobile = function hideMainNavMobile(element) {
	    this.$mainNav.classList.remove('main-nav-is-open');
	    this.$mainNav.setAttribute('aria-expanded', 'false');

	    if (element.classList.contains('hmrc-account-menu__link--menu')) {
	      this.$mainNav.classList.add('js-hidden');
	      this.$showNavLinkMobile.setAttribute('aria-expanded', 'false');
	      this.$showNavLinkMobile.classList.remove('hmrc-account-home--account--is-open');
	    }
	  };

	  function BackLinkHelper($module, window, document) {
	    this.$module = $module;
	    this.window = window;
	    this.document = document;
	  }

	  BackLinkHelper.prototype.init = function init() {
	    var _this = this;

	    // do nothing if History API is absent
	    if (this.window.history) {
	      // store referrer value to cater for IE
	      var docReferrer = this.document.referrer; // prevent resubmit warning

	      if (this.window.history.replaceState && typeof this.window.history.replaceState === 'function') {
	        this.window.history.replaceState(null, null, this.window.location.href);
	      } // handle 'Back' click, dependent upon presence of referrer & no host change


	      this.$module.addEventListener('click', function (event) {
	        event.preventDefault();

	        if (_this.window.history.back && typeof _this.window.history.back === 'function') {
	          if (docReferrer !== '' && docReferrer.indexOf(_this.window.location.host) !== -1) {
	            _this.window.history.back();
	          }
	        }
	      });
	    }
	  };

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/987630a085e29226da16b5dc542042c687560191/polyfills/Array/prototype/forEach/detect.js
	    var detect = ('forEach' in Array.prototype);
	    if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.forEach&flags=always

	    (function () {
	      Array.prototype.forEach = function forEach(callback) {
	        if (this === undefined || this === null) {
	          throw new TypeError(this + " is not an object");
	        }

	        if (typeof callback !== "function") {
	          throw new TypeError(callback + " is not a function");
	        }

	        var object = Object(this),
	            scope = arguments[1],
	            arraylike = object instanceof String ? object.split("") : object,
	            length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
	            index = -1;

	        while (++index < length) {
	          if (index in arraylike) {
	            callback.call(scope, arraylike[index], index, object);
	          }
	        }
	      };
	    })();
	  }).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/987630a085e29226da16b5dc542042c687560191/polyfills/Object/keys/detect.js
	    var detect = 'keys' in Object && function () {
	      // Safari 5.0 bug where Object.keys doesn't work with arguments
	      return Object.keys(arguments).length === 2;
	    }(1, 2) && function () {
	      try {
	        return true;
	      } catch (e) {
	        return false;
	      }
	    }();

	    if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.assign&flags=always

	    Object.keys = function () {

	      var has = Object.prototype.hasOwnProperty;
	      var toStr = Object.prototype.toString;
	      var isEnumerable = Object.prototype.propertyIsEnumerable;
	      var hasDontEnumBug = !isEnumerable.call({
	        toString: null
	      }, "toString");
	      var hasProtoEnumBug = isEnumerable.call(function () {}, "prototype");
	      var dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];

	      var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
	        var ctor = o.constructor;
	        return ctor && ctor.prototype === o;
	      };

	      var excludedKeys = {
	        $console: true,
	        $external: true,
	        $frame: true,
	        $frameElement: true,
	        $frames: true,
	        $innerHeight: true,
	        $innerWidth: true,
	        $outerHeight: true,
	        $outerWidth: true,
	        $pageXOffset: true,
	        $pageYOffset: true,
	        $parent: true,
	        $scrollLeft: true,
	        $scrollTop: true,
	        $scrollX: true,
	        $scrollY: true,
	        $self: true,
	        $webkitIndexedDB: true,
	        $webkitStorageInfo: true,
	        $window: true
	      };

	      var hasAutomationEqualityBug = function () {
	        /* global window */
	        if (typeof window === "undefined") {
	          return false;
	        }

	        for (var k in window) {
	          try {
	            if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && _typeof(window[k]) === 'object') {
	              try {
	                equalsConstructorPrototype(window[k]);
	              } catch (e) {
	                return true;
	              }
	            }
	          } catch (e) {
	            return true;
	          }
	        }

	        return false;
	      }();

	      var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
	        /* global window */
	        if (typeof window === "undefined" || !hasAutomationEqualityBug) {
	          return equalsConstructorPrototype(o);
	        }

	        try {
	          return equalsConstructorPrototype(o);
	        } catch (e) {
	          return false;
	        }
	      };

	      function isArgumentsObject(value) {
	        var str = toStr.call(value);
	        var isArgs = str === "[object Arguments]";

	        if (!isArgs) {
	          isArgs = str !== "[object Array]" && value !== null && _typeof(value) === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
	        }

	        return isArgs;
	      }

	      return function keys(object) {
	        var isFunction = toStr.call(object) === "[object Function]";
	        var isArguments = isArgumentsObject(object);
	        var isString = toStr.call(object) === "[object String]";
	        var theKeys = [];

	        if (object === undefined || object === null) {
	          throw new TypeError("Cannot convert undefined or null to object");
	        }

	        var skipProto = hasProtoEnumBug && isFunction;

	        if (isString && object.length > 0 && !has.call(object, 0)) {
	          for (var i = 0; i < object.length; ++i) {
	            theKeys.push(String(i));
	          }
	        }

	        if (isArguments && object.length > 0) {
	          for (var j = 0; j < object.length; ++j) {
	            theKeys.push(String(j));
	          }
	        } else {
	          for (var name in object) {
	            if (!(skipProto && name === "prototype") && has.call(object, name)) {
	              theKeys.push(String(name));
	            }
	          }
	        }

	        if (hasDontEnumBug) {
	          var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

	          for (var k = 0; k < dontEnums.length; ++k) {
	            if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
	              theKeys.push(dontEnums[k]);
	            }
	          }
	        }

	        return theKeys;
	      };
	    }();
	  }).call("object" === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || "object" === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || "object" === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/987630a085e29226da16b5dc542042c687560191/polyfills/Object/assign/detect.js
	    var detect = ('assign' in Object);
	    if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.assign&flags=always

	    (function () {
	      // 7.1.13 ToObject ( argument )
	      function toObject(argument) {
	        if (argument === null || argument === undefined) {
	          throw new TypeError('Cannot call method on ' + argument);
	        }

	        return Object(argument);
	      }

	      Object.defineProperty(Object, 'assign', {
	        enumerable: false,
	        configurable: true,
	        writable: true,
	        value: function assign(target, source) {
	          // eslint-disable-line no-unused-vars
	          // 1. Let to be ? ToObject(target).
	          var to = toObject(target); // 2. If only one argument was passed, return to.

	          if (arguments.length === 1) {
	            return to;
	          } // 3. Let sources be the List of argument values starting with the second argument


	          var sources = Array.prototype.slice.call(arguments, 1); // 4. For each element nextSource of sources, in ascending index order, do

	          var index1;
	          var index2;
	          var keys;
	          var from;

	          for (index1 = 0; index1 < sources.length; index1++) {
	            var nextSource = sources[index1]; // 4a. If nextSource is undefined or null, let keys be a new empty List.

	            if (nextSource === undefined || nextSource === null) {
	              keys = []; // 4b. Else,
	            } else {
	              // 4bi. Let from be ! ToObject(nextSource).
	              from = toObject(nextSource); // 4bii. Let keys be ? from.[[OwnPropertyKeys]]().

	              /*
	                This step in our polyfill is not complying with the specification.
	                [[OwnPropertyKeys]] is meant to return ALL keys, including non-enumerable and symbols.
	                TODO: When we have Reflect.ownKeys, use that instead as it is the userland equivalent of [[OwnPropertyKeys]].
	              */

	              keys = Object.keys(from);
	            } // 4c. For each element nextKey of keys in List order, do


	            for (index2 = 0; index2 < keys.length; index2++) {
	              var nextKey = keys[index2]; // 4ci. Let desc be ? from.[[GetOwnProperty]](nextKey).

	              var desc = Object.getOwnPropertyDescriptor(from, nextKey); // 4cii. If desc is not undefined and desc.[[Enumerable]] is true, then

	              if (desc !== undefined && desc.enumerable) {
	                // 4cii1. Let propValue be ? Get(from, nextKey).
	                var propValue = from[nextKey]; // 4cii2. Perform ? Set(to, nextKey, propValue, true).

	                to[nextKey] = propValue;
	              }
	            }
	          } // 5. Return to.


	          return to;
	        }
	      });
	    })();
	  }).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  (function (undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-library/blob/987630a085e29226da16b5dc542042c687560191/polyfills/Date/now/detect.js
	    var detect = 'Date' in this && 'now' in this.Date && 'getTime' in this.Date.prototype;
	    if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.forEach&flags=always

	    Date.now = function now() {
	      return new Date().getTime();
	    };
	  }).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof commonjsGlobal === "undefined" ? "undefined" : _typeof(commonjsGlobal)) && commonjsGlobal || {});

	  /**
	   * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
	   * This seems to fail in IE8, requires more investigation.
	   * See: https://github.com/imagitama/nodelist-foreach-polyfill
	   */
	  // eslint-disable-next-line consistent-return
	  function nodeListForEach(nodes, callback) {
	    if (window.NodeList.prototype.forEach) {
	      return nodes.forEach(callback);
	    }

	    for (var i = 0; i < nodes.length; i += 1) {
	      callback.call(window, nodes[i], i, nodes);
	    }
	  } // eslint-disable-next-line import/prefer-default-export

	  /* global ActiveXObject */
	  var _console = console,
	      warn = _console.warn;
	  var utils = {
	    generateDomElementFromString: function generateDomElementFromString(str) {
	      var abc = document.createElement('div');
	      abc.innerHTML = str;
	      return abc.firstChild;
	    },
	    generateDomElementFromStringAndAppendText: function generateDomElementFromStringAndAppendText(str, text) {
	      var $tmp = utils.generateDomElementFromString(str);
	      $tmp.innerText = text;
	      return $tmp;
	    },
	    hasClass: function hasClass(selector, className) {
	      return document.querySelector(selector).classList.contains(className);
	    },
	    addClass: function addClass(selector, className) {
	      var elements = document.querySelectorAll(selector);
	      nodeListForEach(elements, function (i) {
	        i.classList.add(className);
	      });
	    },
	    removeClass: function removeClass(selector, className) {
	      var elements = document.querySelectorAll(selector);
	      nodeListForEach(elements, function (i) {
	        i.classList.remove(className);
	      });
	    },
	    removeElement: function removeElement($elem) {
	      var parent = $elem.parentNode;

	      if (parent) {
	        parent.removeChild($elem);
	      } else {
	        warn("couldn't find parent for elem", $elem);
	      }
	    },
	    ajaxGet: function ajaxGet(url, success) {
	      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	      xhr.open('GET', url);

	      xhr.onreadystatechange = function () {
	        if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
	      };

	      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	      xhr.send();
	      return xhr;
	    }
	  };

	  function displayDialog($elementToDisplay) {
	    var $dialog = utils.generateDomElementFromString('<div id="hmrc-timeout-dialog" tabindex="-1" role="dialog" aria-modal="true" class="hmrc-timeout-dialog">');
	    var $overlay = utils.generateDomElementFromString('<div id="hmrc-timeout-overlay" class="hmrc-timeout-overlay">');
	    var $preparedElementToDisplay = typeof $elementToDisplay === 'string' ? utils.generateDomElementFromString($elementToDisplay) : $elementToDisplay;
	    var resetElementsFunctionList = [];
	    var closeCallbacks = [];
	    $dialog.appendChild($preparedElementToDisplay);

	    if (!utils.hasClass('html', 'noScroll')) {
	      utils.addClass('html', 'noScroll');
	      resetElementsFunctionList.push(function () {
	        utils.removeClass('html', 'noScroll');
	      });
	    }

	    document.body.appendChild($dialog);
	    document.body.appendChild($overlay);
	    resetElementsFunctionList.push(function () {
	      utils.removeElement($dialog);
	      utils.removeElement($overlay);
	    });

	    var setupFocusHandlerAndFocusDialog = function setupFocusHandlerAndFocusDialog() {
	      function keepFocus(event) {
	        var modalFocus = document.getElementById('hmrc-timeout-dialog');

	        if (modalFocus) {
	          if (event.target !== modalFocus && !modalFocus.contains(event.target)) {
	            event.stopPropagation();
	            modalFocus.focus();
	          }
	        }
	      }

	      var elemToFocusOnReset = document.activeElement;
	      $dialog.focus();
	      document.addEventListener('focus', keepFocus, true);
	      resetElementsFunctionList.push(function () {
	        document.removeEventListener('focus', keepFocus);
	        elemToFocusOnReset.focus();
	      });
	    }; // disable the non-dialog page to prevent confusion for VoiceOver users


	    var selectors = ['#skiplink-container', 'body > header', '#global-cookie-message', 'main[role=main]', 'body > footer', 'body > .govuk-skip-link', '.cbanner-govuk-cookie-banner', 'body > .govuk-width-container'];
	    var elements = document.querySelectorAll(selectors.join(', '));

	    var close = function close() {
	      while (resetElementsFunctionList.length > 0) {
	        var fn = resetElementsFunctionList.shift();
	        fn();
	      }
	    };

	    var closeAndInform = function closeAndInform() {
	      closeCallbacks.forEach(function (fn) {
	        fn();
	      });
	      close();
	    };

	    var setupKeydownHandler = function setupKeydownHandler() {
	      function keydownListener(e) {
	        if (e.keyCode === 27) {
	          closeAndInform();
	        }
	      }

	      document.addEventListener('keydown', keydownListener);
	      resetElementsFunctionList.push(function () {
	        document.removeEventListener('keydown', keydownListener);
	      });
	    };

	    var preventMobileScrollWhileAllowingPinchZoom = function preventMobileScrollWhileAllowingPinchZoom() {
	      var handleTouch = function handleTouch(e) {
	        var touches = e.touches || e.changedTouches || [];

	        if (touches.length === 1) {
	          e.preventDefault();
	        }
	      };

	      document.addEventListener('touchmove', handleTouch, true);
	      resetElementsFunctionList.push(function () {
	        document.removeEventListener('touchmove', handleTouch, true);
	      });
	    };

	    nodeListForEach(elements, function ($elem) {
	      var value = $elem.getAttribute('aria-hidden');
	      $elem.setAttribute('aria-hidden', 'true');
	      resetElementsFunctionList.push(function () {
	        if (value) {
	          $elem.setAttribute('aria-hidden', value);
	        } else {
	          $elem.removeAttribute('aria-hidden');
	        }
	      });
	    }); //

	    setupFocusHandlerAndFocusDialog();
	    setupKeydownHandler();
	    preventMobileScrollWhileAllowingPinchZoom();
	    return {
	      closeDialog: function closeDialog() {
	        close();
	      },
	      setAriaLabelledBy: function setAriaLabelledBy(value) {
	        if (value) {
	          $dialog.setAttribute('aria-labelledby', value);
	        } else {
	          $dialog.removeAttribute('aria-labelledby');
	        }
	      },
	      addCloseHandler: function addCloseHandler(closeHandler) {
	        closeCallbacks.push(closeHandler);
	      }
	    };
	  }

	  var dialog = {
	    displayDialog: displayDialog
	  };

	  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
	  Number.isNaN = Number.isNaN || function isNaN(input) {
	    return typeof input === 'number' && input !== input;
	  };

	  function ValidateInput() {}

	  ValidateInput["int"] = function (stringToValidate) {
	    var parsedInt = parseInt(stringToValidate, 10);
	    return Number.isNaN(parsedInt) ? undefined : parsedInt;
	  };

	  ValidateInput.string = function (stringToValidate) {
	    return typeof stringToValidate === 'string' ? stringToValidate : undefined;
	  };

	  ValidateInput["boolean"] = function (stringToValidate) {
	    return String(stringToValidate).toLowerCase() === 'true';
	  };

	  function RedirectHelper() {}

	  RedirectHelper.redirectToUrl = function (url) {
	    // This exists to make redirects more testable
	    window.location.href = url;
	  };

	  function TimeoutDialog($module, $sessionActivityService) {
	    var options = {};
	    var settings = {};
	    var cleanupFunctions = [];
	    var currentTimer;
	    var sessionActivityService = $sessionActivityService;

	    function init() {
	      var validate = ValidateInput;

	      function lookupData(key) {
	        return ($module.attributes.getNamedItem(key) || {}).value;
	      }

	      var localisedDefaults = validate.string(lookupData('data-language')) === 'cy' ? {
	        title: 'Rydych ar fin cael eich allgofnodi',
	        message: 'Er eich diogelwch, byddwn yn eich allgofnodi cyn pen',
	        keepAliveButtonText: 'Parhau i fod wedi’ch mewngofnodi',
	        signOutButtonText: 'Allgofnodi',
	        properties: {
	          minutes: 'funud',
	          minute: 'funud',
	          seconds: 'eiliad',
	          second: 'eiliad'
	        }
	      } : {
	        title: 'You’re about to be signed out',
	        message: 'For your security, we will sign you out in',
	        keepAliveButtonText: 'Stay signed in',
	        signOutButtonText: 'Sign out',
	        properties: {
	          minutes: 'minutes',
	          minute: 'minute',
	          seconds: 'seconds',
	          second: 'second'
	        }
	      };
	      options = {
	        timeout: validate["int"](lookupData('data-timeout')),
	        countdown: validate["int"](lookupData('data-countdown')),
	        keepAliveUrl: validate.string(lookupData('data-keep-alive-url')),
	        signOutUrl: validate.string(lookupData('data-sign-out-url')),
	        timeoutUrl: validate.string(lookupData('data-timeout-url')),
	        title: validate.string(lookupData('data-title')),
	        message: validate.string(lookupData('data-message')),
	        messageSuffix: validate.string(lookupData('data-message-suffix')),
	        keepAliveButtonText: validate.string(lookupData('data-keep-alive-button-text')),
	        signOutButtonText: validate.string(lookupData('data-sign-out-button-text')),
	        synchroniseTabs: validate["boolean"](lookupData('data-synchronise-tabs') || false)
	      }; // Default timeoutUrl to signOutUrl if not set

	      options.timeoutUrl = options.timeoutUrl || options.signOutUrl;
	      validateInput(options);
	      settings = mergeOptionsWithDefaults(options, localisedDefaults);
	      setupDialogTimer();
	      listenForSessionActivityAndResetDialogTimer();
	    }

	    var broadcastSessionActivity = function broadcastSessionActivity() {
	      sessionActivityService.logActivity();
	    };

	    var listenForSessionActivityAndResetDialogTimer = function listenForSessionActivityAndResetDialogTimer() {
	      if (settings.synchroniseTabs) {
	        sessionActivityService.onActivity(function (event) {
	          var timeOfActivity = event.timestamp;
	          cleanup();
	          setupDialogTimer(timeOfActivity);
	        });
	      }
	    };

	    var validateInput = function validateInput(config) {
	      var requiredConfig = ['timeout', 'countdown', 'keepAliveUrl', 'signOutUrl'];
	      var missingRequiredConfig = [];
	      requiredConfig.forEach(function (item) {
	        if (!config[item]) {
	          missingRequiredConfig.push("data-".concat(item.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()));
	        }
	      });

	      if (missingRequiredConfig.length > 0) {
	        throw new Error("Missing config item(s): [".concat(missingRequiredConfig.join(', '), "]"));
	      }
	    };

	    var mergeOptionsWithDefaults = function mergeOptionsWithDefaults(theOptions, localisedDefaults) {
	      var clone = _objectSpread2({}, theOptions);

	      Object.keys(localisedDefaults).forEach(function (key) {
	        if (_typeof(clone[key]) === 'object') {
	          clone[key] = mergeOptionsWithDefaults(theOptions[key], localisedDefaults[key]);
	        }

	        if (clone[key] === undefined || clone[key] === '') {
	          clone[key] = localisedDefaults[key];
	        }
	      });
	      return clone;
	    };

	    var setupDialogTimer = function setupDialogTimer() {
	      var timeOfLastActivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDateNow();
	      var signoutTime = timeOfLastActivity + settings.timeout * 1000;
	      var delta = getDateNow() - timeOfLastActivity;
	      var secondsUntilTimeoutDialog = settings.timeout - settings.countdown;
	      var timeout = window.setTimeout(function () {
	        setupDialog(signoutTime);
	      }, secondsUntilTimeoutDialog * 1000 - delta);
	      cleanupFunctions.push(function () {
	        window.clearTimeout(timeout);

	        if (currentTimer) {
	          window.clearTimeout(currentTimer);
	        }
	      });
	    };

	    var wrapLink = function wrapLink($elem) {
	      var $wrapper = document.createElement('div');
	      $wrapper.classList.add('hmrc-timeout-dialog__link-wrapper');
	      $wrapper.appendChild($elem);
	      return $wrapper;
	    };

	    var setupDialog = function setupDialog(signoutTime) {
	      var $element = utils.generateDomElementFromString('<div>');

	      if (settings.title) {
	        var $tmp = utils.generateDomElementFromStringAndAppendText('<h1 id="hmrc-timeout-heading" class="govuk-heading-m push--top">', settings.title);
	        $element.appendChild($tmp);
	      }

	      var $countdownElement = utils.generateDomElementFromString('<span id="hmrc-timeout-countdown" class="hmrc-timeout-dialog__countdown">');
	      var $audibleMessage = utils.generateDomElementFromString('<p id="hmrc-timeout-message" class="govuk-visually-hidden screenreader-content" aria-live="assertive">');
	      var $visualMessge = utils.generateDomElementFromStringAndAppendText('<p class="govuk-body hmrc-timeout-dialog__message" aria-hidden="true">', settings.message);
	      $visualMessge.appendChild(document.createTextNode(' '));
	      $visualMessge.appendChild($countdownElement);
	      $visualMessge.appendChild(document.createTextNode('.'));

	      if (settings.messageSuffix) {
	        $visualMessge.appendChild(document.createTextNode(" ".concat(settings.messageSuffix)));
	      }

	      var $staySignedInButton = utils.generateDomElementFromStringAndAppendText('<button id="hmrc-timeout-keep-signin-btn" class="govuk-button">', settings.keepAliveButtonText);
	      var $signOutButton = utils.generateDomElementFromStringAndAppendText('<a id="hmrc-timeout-sign-out-link" class="govuk-link hmrc-timeout-dialog__link">', settings.signOutButtonText);
	      $staySignedInButton.addEventListener('click', keepAliveAndClose);
	      $signOutButton.addEventListener('click', signOut);
	      $signOutButton.setAttribute('href', settings.signOutUrl);
	      $element.appendChild($visualMessge);
	      $element.appendChild($audibleMessage);
	      $element.appendChild($staySignedInButton);
	      $element.appendChild(document.createTextNode(' '));
	      $element.appendChild(wrapLink($signOutButton));
	      var dialogControl = dialog.displayDialog($element);
	      cleanupFunctions.push(function () {
	        dialogControl.closeDialog();
	      });
	      dialogControl.addCloseHandler(keepAliveAndClose);
	      dialogControl.setAriaLabelledBy('hmrc-timeout-heading hmrc-timeout-message');

	      var getMillisecondsRemaining = function getMillisecondsRemaining() {
	        return signoutTime - getDateNow();
	      };

	      var getSecondsRemaining = function getSecondsRemaining() {
	        return Math.round(getMillisecondsRemaining() / 1000);
	      };

	      var getHumanText = function getHumanText(counter) {
	        var minutes;
	        var visibleMessage;

	        if (counter < 60) {
	          visibleMessage = "".concat(counter, " ").concat(settings.properties[counter !== 1 ? 'seconds' : 'second']);
	        } else {
	          minutes = Math.ceil(counter / 60);
	          visibleMessage = "".concat(minutes, " ").concat(settings.properties[minutes === 1 ? 'minute' : 'minutes']);
	        }

	        return visibleMessage;
	      };

	      var getAudibleHumanText = function getAudibleHumanText(counter) {
	        var humanText = getHumanText(roundSecondsUp(counter));
	        var messageParts = [settings.message, ' ', humanText, '.'];

	        if (settings.messageSuffix) {
	          messageParts.push(' ');
	          messageParts.push(settings.messageSuffix);
	        }

	        return messageParts.join('');
	      };

	      var roundSecondsUp = function roundSecondsUp(counter) {
	        if (counter > 60) {
	          return counter;
	        }

	        if (counter < 20) {
	          return 20;
	        }

	        return Math.ceil(counter / 20) * 20;
	      };

	      var updateTextIfChanged = function updateTextIfChanged($elem, text) {
	        if ($elem.innerText !== text) {
	          // eslint-disable-next-line no-param-reassign
	          $elem.innerText = text;
	        }
	      };

	      var updateCountdown = function updateCountdown(counter) {
	        var visibleMessage = getHumanText(counter);
	        var audibleHumanText = getAudibleHumanText(counter);
	        updateTextIfChanged($countdownElement, visibleMessage);
	        updateTextIfChanged($audibleMessage, audibleHumanText);
	      };

	      var getNextTimeout = function getNextTimeout() {
	        var remaining = getMillisecondsRemaining();
	        var roundedRemaining = Math.floor(getMillisecondsRemaining() / 1000) * 1000;

	        if (roundedRemaining <= 60000) {
	          return remaining - roundedRemaining || 1000;
	        }

	        return remaining - (roundedRemaining - (roundedRemaining % 60000 || 60000));
	      };

	      var runUpdate = function runUpdate() {
	        var counter = getSecondsRemaining();
	        updateCountdown(counter);

	        if (counter <= 0) {
	          timeout();
	        }

	        currentTimer = window.setTimeout(runUpdate, getNextTimeout());
	      };

	      runUpdate();
	    };

	    var keepAliveAndClose = function keepAliveAndClose() {
	      cleanup();
	      setupDialogTimer();
	      utils.ajaxGet(settings.keepAliveUrl, function () {});
	      broadcastSessionActivity();
	    };

	    var getDateNow = function getDateNow() {
	      return Date.now();
	    };

	    var signOut = function signOut() {
	      RedirectHelper.redirectToUrl(settings.signOutUrl);
	    };

	    var timeout = function timeout() {
	      RedirectHelper.redirectToUrl(settings.timeoutUrl);
	    };

	    var cleanup = function cleanup() {
	      while (cleanupFunctions.length > 0) {
	        var fn = cleanupFunctions.shift();
	        fn();
	      }
	    };

	    return {
	      init: init,
	      cleanup: cleanup
	    };
	  }

	  TimeoutDialog.dialog = dialog;
	  TimeoutDialog.redirectHelper = RedirectHelper;
	  TimeoutDialog.utils = utils;

	  // Based on https://github.com/alphagov/govuk_template_jinja
	  var setCookie = function setCookie(name, value) {
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	    var cookieString = "".concat(name, "=").concat(value, "; path=/");

	    if (options.days) {
	      var date = new Date();
	      date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
	      cookieString = "".concat(cookieString, "; expires=").concat(date.toGMTString());
	    }

	    if (window.location.protocol === 'https:') {
	      cookieString += '; Secure';
	    }

	    document.cookie = cookieString;
	    return cookieString;
	  };
	  var getCookie = function getCookie(name) {
	    var nameEQ = "".concat(name, "=");
	    var cookies = document.cookie.split(';');

	    for (var i = 0, len = cookies.length; i < len; i += 1) {
	      var cookie = cookies[i];

	      while (cookie.charAt(0) === ' ') {
	        cookie = cookie.substring(1, cookie.length);
	      }

	      if (cookie.indexOf(nameEQ) === 0) {
	        return decodeURIComponent(cookie.substring(nameEQ.length));
	      }
	    }

	    return null;
	  };

	  function UserResearchBanner($module) {
	    this.$module = $module;
	    this.$closeLink = this.$module.querySelector('.hmrc-user-research-banner__close');
	    this.cookieName = 'mdtpurr';
	    this.cookieExpiryDays = 28;
	  }

	  UserResearchBanner.prototype.init = function init() {
	    var cookieData = getCookie(this.cookieName);

	    if (cookieData == null) {
	      this.$module.classList.add('hmrc-user-research-banner--show');
	      this.$closeLink.addEventListener('click', this.eventHandlers.noThanksClick.bind(this));
	    }
	  };

	  UserResearchBanner.prototype.eventHandlers = {
	    noThanksClick: function noThanksClick(event) {
	      event.preventDefault();
	      setCookie(this.cookieName, 'suppress_for_all_services', {
	        days: this.cookieExpiryDays
	      });
	      this.$module.classList.remove('hmrc-user-research-banner--show');
	    }
	  };

	  var SessionActivityService = /*#__PURE__*/function () {
	    function SessionActivityService(BrowserBroadcastChannel) {
	      _classCallCheck(this, SessionActivityService);

	      this.activityChannel = BrowserBroadcastChannel && new BrowserBroadcastChannel('session-activity');
	    }

	    _createClass(SessionActivityService, [{
	      key: "logActivity",
	      value: function logActivity() {
	        if (this.activityChannel) {
	          var event = {
	            timestamp: Date.now()
	          };
	          this.activityChannel.postMessage(event);
	        }
	      }
	    }, {
	      key: "onActivity",
	      value: function onActivity(callback) {
	        if (this.activityChannel) {
	          this.activityChannel.onmessage = function (event) {
	            callback(event.data);
	          };
	        }
	      }
	    }]);

	    return SessionActivityService;
	  }();

	  function initAll() {
	    var $AccountMenuSelector = '[data-module="hmrc-account-menu"]';

	    if (document.querySelector($AccountMenuSelector)) {
	      new AccountMenu($AccountMenuSelector).init();
	    }

	    var sessionActivityService = new SessionActivityService(window.BroadcastChannel);
	    sessionActivityService.logActivity();
	    var $TimeoutDialog = document.querySelector('meta[name="hmrc-timeout-dialog"]');

	    if ($TimeoutDialog) {
	      new TimeoutDialog($TimeoutDialog, sessionActivityService).init();
	    }

	    var $UserResearchBanner = document.querySelector('[data-module="hmrc-user-research-banner"]');

	    if ($UserResearchBanner) {
	      new UserResearchBanner($UserResearchBanner).init();
	    }

	    var $BackLinks = document.querySelectorAll('[data-module="hmrc-back-link"]');
	    nodeListForEach($BackLinks, function ($BackLink) {
	      new BackLinkHelper($BackLink, window, document).init();
	    });
	  }

	  var all = {
	    initAll: initAll,
	    AccountMenu: AccountMenu,
	    TimeoutDialog: TimeoutDialog,
	    UserResearchBanner: UserResearchBanner,
	    BackLinkHelper: BackLinkHelper
	  };

	  return all;

	})));
	});

	var all$1 = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory(exports);
	}(commonjsGlobal, (function (exports) {
	  /**
	   * Common helpers which do not require polyfill.
	   *
	   * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
	   * so that the polyfill can be properly tree-shaken and does not burden
	   * the components that do not need that helper
	   *
	   * @module common/index
	   */

	  /**
	   * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
	   * This seems to fail in IE8, requires more investigation.
	   * See: https://github.com/imagitama/nodelist-foreach-polyfill
	   *
	   * @param {NodeListOf<Element>} nodes - NodeList from querySelectorAll()
	   * @param {nodeListIterator} callback - Callback function to run for each node
	   * @returns {void}
	   */
	  function nodeListForEach (nodes, callback) {
	    if (window.NodeList.prototype.forEach) {
	      return nodes.forEach(callback)
	    }
	    for (var i = 0; i < nodes.length; i++) {
	      callback.call(window, nodes[i], i, nodes);
	    }
	  }

	  /**
	   * Used to generate a unique string, allows multiple instances of the component
	   * without them conflicting with each other.
	   * https://stackoverflow.com/a/8809472
	   *
	   * @returns {string} Unique ID
	   */
	  function generateUniqueID () {
	    var d = new Date().getTime();
	    if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
	      d += window.performance.now(); // use high-precision timer if available
	    }
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = (d + Math.random() * 16) % 16 | 0;
	      d = Math.floor(d / 16);
	      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
	    })
	  }

	  /**
	   * Config flattening function
	   *
	   * Takes any number of objects, flattens them into namespaced key-value pairs,
	   * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
	   * greatest priority on the LAST item passed in.
	   *
	   * @returns {Object<string, unknown>} A flattened object of key-value pairs.
	   */
	  function mergeConfigs (/* configObject1, configObject2, ...configObjects */) {
	    /**
	     * Function to take nested objects and flatten them to a dot-separated keyed
	     * object. Doing this means we don't need to do any deep/recursive merging of
	     * each of our objects, nor transform our dataset from a flat list into a
	     * nested object.
	     *
	     * @param {Object<string, unknown>} configObject - Deeply nested object
	     * @returns {Object<string, unknown>} Flattened object with dot-separated keys
	     */
	    var flattenObject = function (configObject) {
	      // Prepare an empty return object
	      var flattenedObject = {};

	      /**
	       * Our flattening function, this is called recursively for each level of
	       * depth in the object. At each level we prepend the previous level names to
	       * the key using `prefix`.
	       *
	       * @param {Partial<Object<string, unknown>>} obj - Object to flatten
	       * @param {string} [prefix] - Optional dot-separated prefix
	       */
	      var flattenLoop = function (obj, prefix) {
	        // Loop through keys...
	        for (var key in obj) {
	          // Check to see if this is a prototypical key/value,
	          // if it is, skip it.
	          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
	            continue
	          }
	          var value = obj[key];
	          var prefixedKey = prefix ? prefix + '.' + key : key;
	          if (typeof value === 'object') {
	            // If the value is a nested object, recurse over that too
	            flattenLoop(value, prefixedKey);
	          } else {
	            // Otherwise, add this value to our return object
	            flattenedObject[prefixedKey] = value;
	          }
	        }
	      };

	      // Kick off the recursive loop
	      flattenLoop(configObject);
	      return flattenedObject
	    };

	    // Start with an empty object as our base
	    var formattedConfigObject = {};

	    // Loop through each of the remaining passed objects and push their keys
	    // one-by-one into configObject. Any duplicate keys will override the existing
	    // key with the new value.
	    for (var i = 0; i < arguments.length; i++) {
	      var obj = flattenObject(arguments[i]);
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) {
	          formattedConfigObject[key] = obj[key];
	        }
	      }
	    }

	    return formattedConfigObject
	  }

	  /**
	   * Extracts keys starting with a particular namespace from a flattened config
	   * object, removing the namespace in the process.
	   *
	   * @param {Object<string, unknown>} configObject - The object to extract key-value pairs from.
	   * @param {string} namespace - The namespace to filter keys with.
	   * @returns {Object<string, unknown>} Flattened object with dot-separated key namespace removed
	   * @throws {Error} Config object required
	   * @throws {Error} Namespace string required
	   */
	  function extractConfigByNamespace (configObject, namespace) {
	    // Check we have what we need
	    if (!configObject || typeof configObject !== 'object') {
	      throw new Error('Provide a `configObject` of type "object".')
	    }
	    if (!namespace || typeof namespace !== 'string') {
	      throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.')
	    }
	    var newObject = {};
	    for (var key in configObject) {
	      // Split the key into parts, using . as our namespace separator
	      var keyParts = key.split('.');
	      // Check if the first namespace matches the configured namespace
	      if (Object.prototype.hasOwnProperty.call(configObject, key) && keyParts[0] === namespace) {
	        // Remove the first item (the namespace) from the parts array,
	        // but only if there is more than one part (we don't want blank keys!)
	        if (keyParts.length > 1) {
	          keyParts.shift();
	        }
	        // Join the remaining parts back together
	        var newKey = keyParts.join('.');
	        // Add them to our new object
	        newObject[newKey] = configObject[key];
	      }
	    }
	    return newObject
	  }

	  /**
	   * @callback nodeListIterator
	   * @param {Element} value - The current node being iterated on
	   * @param {number} index - The current index in the iteration
	   * @param {NodeListOf<Element>} nodes - NodeList from querySelectorAll()
	   * @returns {void}
	   */

	  (function(undefined) {

	  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
	  var detect = (
	    // In IE8, defineProperty could only act on DOM elements, so full support
	    // for the feature requires the ability to set a property on an arbitrary object
	    'defineProperty' in Object && (function() {
	    	try {
	    		var a = {};
	    		Object.defineProperty(a, 'test', {value:42});
	    		return true;
	    	} catch(e) {
	    		return false
	    	}
	    }())
	  );

	  if (detect) return

	  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
	  (function (nativeDefineProperty) {

	  	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	  	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	  	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	  	Object.defineProperty = function defineProperty(object, property, descriptor) {

	  		// Where native support exists, assume it
	  		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
	  			return nativeDefineProperty(object, property, descriptor);
	  		}

	  		if (object === null || !(object instanceof Object || typeof object === 'object')) {
	  			throw new TypeError('Object.defineProperty called on non-object');
	  		}

	  		if (!(descriptor instanceof Object)) {
	  			throw new TypeError('Property description must be an object');
	  		}

	  		var propertyString = String(property);
	  		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
	  		var getterType = 'get' in descriptor && typeof descriptor.get;
	  		var setterType = 'set' in descriptor && typeof descriptor.set;

	  		// handle descriptor.get
	  		if (getterType) {
	  			if (getterType !== 'function') {
	  				throw new TypeError('Getter must be a function');
	  			}
	  			if (!supportsAccessors) {
	  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
	  			}
	  			if (hasValueOrWritable) {
	  				throw new TypeError(ERR_VALUE_ACCESSORS);
	  			}
	  			Object.__defineGetter__.call(object, propertyString, descriptor.get);
	  		} else {
	  			object[propertyString] = descriptor.value;
	  		}

	  		// handle descriptor.set
	  		if (setterType) {
	  			if (setterType !== 'function') {
	  				throw new TypeError('Setter must be a function');
	  			}
	  			if (!supportsAccessors) {
	  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
	  			}
	  			if (hasValueOrWritable) {
	  				throw new TypeError(ERR_VALUE_ACCESSORS);
	  			}
	  			Object.__defineSetter__.call(object, propertyString, descriptor.set);
	  		}

	  		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
	  		if ('value' in descriptor) {
	  			object[propertyString] = descriptor.value;
	  		}

	  		return object;
	  	};
	  }(Object.defineProperty));
	  })
	  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
	  var detect = ("Document" in this);

	  if (detect) return

	  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
	  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

	  	if (this.HTMLDocument) { // IE8

	  		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
	  		this.Document = this.HTMLDocument;

	  	} else {

	  		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
	  		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
	  		this.Document.prototype = document;
	  	}
	  }


	  })
	  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
	  var detect = ('Element' in this && 'HTMLElement' in this);

	  if (detect) return

	  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
	  (function () {

	  	// IE8
	  	if (window.Element && !window.HTMLElement) {
	  		window.HTMLElement = window.Element;
	  		return;
	  	}

	  	// create Element constructor
	  	window.Element = window.HTMLElement = new Function('return function Element() {}')();

	  	// generate sandboxed iframe
	  	var vbody = document.appendChild(document.createElement('body'));
	  	var frame = vbody.appendChild(document.createElement('iframe'));

	  	// use sandboxed iframe to replicate Element functionality
	  	var frameDocument = frame.contentWindow.document;
	  	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
	  	var cache = {};

	  	// polyfill Element.prototype on an element
	  	var shiv = function (element, deep) {
	  		var
	  		childNodes = element.childNodes || [],
	  		index = -1,
	  		key, value, childNode;

	  		if (element.nodeType === 1 && element.constructor !== Element) {
	  			element.constructor = Element;

	  			for (key in cache) {
	  				value = cache[key];
	  				element[key] = value;
	  			}
	  		}

	  		while (childNode = deep && childNodes[++index]) {
	  			shiv(childNode, deep);
	  		}

	  		return element;
	  	};

	  	var elements = document.getElementsByTagName('*');
	  	var nativeCreateElement = document.createElement;
	  	var interval;
	  	var loopLimit = 100;

	  	prototype.attachEvent('onpropertychange', function (event) {
	  		var
	  		propertyName = event.propertyName,
	  		nonValue = !cache.hasOwnProperty(propertyName),
	  		newValue = prototype[propertyName],
	  		oldValue = cache[propertyName],
	  		index = -1,
	  		element;

	  		while (element = elements[++index]) {
	  			if (element.nodeType === 1) {
	  				if (nonValue || element[propertyName] === oldValue) {
	  					element[propertyName] = newValue;
	  				}
	  			}
	  		}

	  		cache[propertyName] = newValue;
	  	});

	  	prototype.constructor = Element;

	  	if (!prototype.hasAttribute) {
	  		// <Element>.hasAttribute
	  		prototype.hasAttribute = function hasAttribute(name) {
	  			return this.getAttribute(name) !== null;
	  		};
	  	}

	  	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
	  	function bodyCheck() {
	  		if (!(loopLimit--)) clearTimeout(interval);
	  		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
	  			shiv(document, true);
	  			if (interval && document.body.prototype) clearTimeout(interval);
	  			return (!!document.body.prototype);
	  		}
	  		return false;
	  	}
	  	if (!bodyCheck()) {
	  		document.onreadystatechange = bodyCheck;
	  		interval = setInterval(bodyCheck, 25);
	  	}

	  	// Apply to any new elements created after load
	  	document.createElement = function createElement(nodeName) {
	  		var element = nativeCreateElement(String(nodeName).toLowerCase());
	  		return shiv(element);
	  	};

	  	// remove sandboxed iframe
	  	document.removeChild(vbody);
	  }());

	  })
	  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/13cf7c340974d128d557580b5e2dafcd1b1192d1/polyfills/Element/prototype/dataset/detect.js
	    var detect = (function(){
	      if (!document.documentElement.dataset) {
	        return false;
	      }
	      var el = document.createElement('div');
	      el.setAttribute("data-a-b", "c");
	      return el.dataset && el.dataset.aB == "c";
	    }());

	    if (detect) return

	    // Polyfill derived from  https://raw.githubusercontent.com/Financial-Times/polyfill-library/13cf7c340974d128d557580b5e2dafcd1b1192d1/polyfills/Element/prototype/dataset/polyfill.js
	    Object.defineProperty(Element.prototype, 'dataset', {
	      get: function() {
	        var element = this;
	        var attributes = this.attributes;
	        var map = {};
	    
	        for (var i = 0; i < attributes.length; i++) {
	          var attribute = attributes[i];
	    
	          // This regex has been edited from the original polyfill, to add
	          // support for period (.) separators in data-* attribute names. These
	          // are allowed in the HTML spec, but were not covered by the original
	          // polyfill's regex. We use periods in our i18n implementation.
	          if (attribute && attribute.name && (/^data-\w[.\w-]*$/).test(attribute.name)) {
	            var name = attribute.name;
	            var value = attribute.value;
	    
	            var propName = name.substr(5).replace(/-./g, function (prop) {
	              return prop.charAt(1).toUpperCase();
	            });
	            
	            // If this browser supports __defineGetter__ and __defineSetter__,
	            // continue using defineProperty. If not (like IE 8 and below), we use
	            // a hacky fallback which at least gives an object in the right format
	            if ('__defineGetter__' in Object.prototype && '__defineSetter__' in Object.prototype) {
	              Object.defineProperty(map, propName, {
	                enumerable: true,
	                get: function() {
	                  return this.value;
	                }.bind({value: value || ''}),
	                set: function setter(name, value) {
	                  if (typeof value !== 'undefined') {
	                    this.setAttribute(name, value);
	                  } else {
	                    this.removeAttribute(name);
	                  }
	                }.bind(element, name)
	              });
	            } else {
	              map[propName] = value;
	            }

	          }
	        }
	    
	        return map;
	      }
	    });

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	      // Detection from https://github.com/mdn/content/blob/cf607d68522cd35ee7670782d3ee3a361eaef2e4/files/en-us/web/javascript/reference/global_objects/string/trim/index.md#polyfill
	      var detect = ('trim' in String.prototype);
	      
	      if (detect) return

	      // Polyfill from https://github.com/mdn/content/blob/cf607d68522cd35ee7670782d3ee3a361eaef2e4/files/en-us/web/javascript/reference/global_objects/string/trim/index.md#polyfill
	      String.prototype.trim = function () {
	          return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	      };

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  /* eslint-disable es-x/no-string-prototype-trim -- Polyfill imported */

	  /**
	   * Normalise string
	   *
	   * 'If it looks like a duck, and it quacks like a duck…' 🦆
	   *
	   * If the passed value looks like a boolean or a number, convert it to a boolean
	   * or number.
	   *
	   * Designed to be used to convert config passed via data attributes (which are
	   * always strings) into something sensible.
	   *
	   * @param {string} value - The value to normalise
	   * @returns {string | boolean | number | undefined} Normalised data
	   */
	  function normaliseString (value) {
	    if (typeof value !== 'string') {
	      return value
	    }

	    var trimmedValue = value.trim();

	    if (trimmedValue === 'true') {
	      return true
	    }

	    if (trimmedValue === 'false') {
	      return false
	    }

	    // Empty / whitespace-only strings are considered finite so we need to check
	    // the length of the trimmed string as well
	    if (trimmedValue.length > 0 && isFinite(trimmedValue)) {
	      return Number(trimmedValue)
	    }

	    return value
	  }

	  /**
	   * Normalise dataset
	   *
	   * Loop over an object and normalise each value using normaliseData function
	   *
	   * @param {DOMStringMap} dataset - HTML element dataset
	   * @returns {Object<string, unknown>} Normalised dataset
	   */
	  function normaliseDataset (dataset) {
	    var out = {};

	    for (var key in dataset) {
	      out[key] = normaliseString(dataset[key]);
	    }

	    return out
	  }

	  /**
	   * Internal support for selecting messages to render, with placeholder
	   * interpolation and locale-aware number formatting and pluralisation
	   *
	   * @class
	   * @private
	   * @param {Object<string, unknown>} translations - Key-value pairs of the translation strings to use.
	   * @param {object} [config] - Configuration options for the function.
	   * @param {string} [config.locale] - An overriding locale for the PluralRules functionality.
	   */
	  function I18n (translations, config) {
	    // Make list of translations available throughout function
	    this.translations = translations || {};

	    // The locale to use for PluralRules and NumberFormat
	    this.locale = (config && config.locale) || document.documentElement.lang || 'en';
	  }

	  /**
	   * The most used function - takes the key for a given piece of UI text and
	   * returns the appropriate string.
	   *
	   * @param {string} lookupKey - The lookup key of the string to use.
	   * @param {Object<string, unknown>} [options] - Any options passed with the translation string, e.g: for string interpolation.
	   * @returns {string} The appropriate translation string.
	   * @throws {Error} Lookup key required
	   * @throws {Error} Options required for `${}` placeholders
	   */
	  I18n.prototype.t = function (lookupKey, options) {
	    if (!lookupKey) {
	      // Print a console error if no lookup key has been provided
	      throw new Error('i18n: lookup key missing')
	    }

	    // If the `count` option is set, determine which plural suffix is needed and
	    // change the lookupKey to match. We check to see if it's undefined instead of
	    // falsy, as this could legitimately be 0.
	    if (options && typeof options.count !== 'undefined') {
	      // Get the plural suffix
	      lookupKey = lookupKey + '.' + this.getPluralSuffix(lookupKey, options.count);
	    }

	    if (lookupKey in this.translations) {
	      // Fetch the translation string for that lookup key
	      var translationString = this.translations[lookupKey];

	      // Check for ${} placeholders in the translation string
	      if (translationString.match(/%{(.\S+)}/)) {
	        if (!options) {
	          throw new Error('i18n: cannot replace placeholders in string if no option data provided')
	        }

	        return this.replacePlaceholders(translationString, options)
	      } else {
	        return translationString
	      }
	    } else {
	      // If the key wasn't found in our translations object,
	      // return the lookup key itself as the fallback
	      return lookupKey
	    }
	  };

	  /**
	   * Takes a translation string with placeholders, and replaces the placeholders
	   * with the provided data
	   *
	   * @param {string} translationString - The translation string
	   * @param {Object<string, unknown>} options - Any options passed with the translation string, e.g: for string interpolation.
	   * @returns {string} The translation string to output, with ${} placeholders replaced
	   */
	  I18n.prototype.replacePlaceholders = function (translationString, options) {
	    var formatter;

	    if (this.hasIntlNumberFormatSupport()) {
	      formatter = new Intl.NumberFormat(this.locale);
	    }

	    return translationString.replace(/%{(.\S+)}/g, function (placeholderWithBraces, placeholderKey) {
	      if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
	        var placeholderValue = options[placeholderKey];

	        // If a user has passed `false` as the value for the placeholder
	        // treat it as though the value should not be displayed
	        if (placeholderValue === false) {
	          return ''
	        }

	        // If the placeholder's value is a number, localise the number formatting
	        if (typeof placeholderValue === 'number' && formatter) {
	          return formatter.format(placeholderValue)
	        }

	        return placeholderValue
	      } else {
	        throw new Error('i18n: no data found to replace ' + placeholderWithBraces + ' placeholder in string')
	      }
	    })
	  };

	  /**
	   * Check to see if the browser supports Intl and Intl.PluralRules.
	   *
	   * It requires all conditions to be met in order to be supported:
	   * - The browser supports the Intl class (true in IE11)
	   * - The implementation of Intl supports PluralRules (NOT true in IE11)
	   * - The browser/OS has plural rules for the current locale (browser dependent)
	   *
	   * @returns {boolean} Returns true if all conditions are met. Returns false otherwise.
	   */
	  I18n.prototype.hasIntlPluralRulesSupport = function () {
	    return Boolean(window.Intl && ('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length))
	  };

	  /**
	   * Check to see if the browser supports Intl and Intl.NumberFormat.
	   *
	   * It requires all conditions to be met in order to be supported:
	   * - The browser supports the Intl class (true in IE11)
	   * - The implementation of Intl supports NumberFormat (also true in IE11)
	   * - The browser/OS has number formatting rules for the current locale (browser dependent)
	   *
	   * @returns {boolean} Returns true if all conditions are met. Returns false otherwise.
	   */
	  I18n.prototype.hasIntlNumberFormatSupport = function () {
	    return Boolean(window.Intl && ('NumberFormat' in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length))
	  };

	  /**
	   * Get the appropriate suffix for the plural form.
	   *
	   * Uses Intl.PluralRules (or our own fallback implementation) to get the
	   * 'preferred' form to use for the given count.
	   *
	   * Checks that a translation has been provided for that plural form – if it
	   * hasn't, it'll fall back to the 'other' plural form (unless that doesn't exist
	   * either, in which case an error will be thrown)
	   *
	   * @param {string} lookupKey - The lookup key of the string to use.
	   * @param {number} count - Number used to determine which pluralisation to use.
	   * @returns {PluralRule} The suffix associated with the correct pluralisation for this locale.
	   * @throws {Error} Plural form `.other` required when preferred plural form is missing
	   */
	  I18n.prototype.getPluralSuffix = function (lookupKey, count) {
	    // Validate that the number is actually a number.
	    //
	    // Number(count) will turn anything that can't be converted to a Number type
	    // into 'NaN'. isFinite filters out NaN, as it isn't a finite number.
	    count = Number(count);
	    if (!isFinite(count)) { return 'other' }

	    var preferredForm;

	    // Check to verify that all the requirements for Intl.PluralRules are met.
	    // If so, we can use that instead of our custom implementation. Otherwise,
	    // use the hardcoded fallback.
	    if (this.hasIntlPluralRulesSupport()) {
	      preferredForm = new Intl.PluralRules(this.locale).select(count);
	    } else {
	      preferredForm = this.selectPluralFormUsingFallbackRules(count);
	    }

	    // Use the correct plural form if provided
	    if (lookupKey + '.' + preferredForm in this.translations) {
	      return preferredForm
	    // Fall back to `other` if the plural form is missing, but log a warning
	    // to the console
	    } else if (lookupKey + '.other' in this.translations) {
	      if (console && 'warn' in console) {
	        console.warn('i18n: Missing plural form ".' + preferredForm + '" for "' +
	          this.locale + '" locale. Falling back to ".other".');
	      }

	      return 'other'
	    // If the required `other` plural form is missing, all we can do is error
	    } else {
	      throw new Error(
	        'i18n: Plural form ".other" is required for "' + this.locale + '" locale'
	      )
	    }
	  };

	  /**
	   * Get the plural form using our fallback implementation
	   *
	   * This is split out into a separate function to make it easier to test the
	   * fallback behaviour in an environment where Intl.PluralRules exists.
	   *
	   * @param {number} count - Number used to determine which pluralisation to use.
	   * @returns {PluralRule} The pluralisation form for count in this locale.
	   */
	  I18n.prototype.selectPluralFormUsingFallbackRules = function (count) {
	    // Currently our custom code can only handle positive integers, so let's
	    // make sure our number is one of those.
	    count = Math.abs(Math.floor(count));

	    var ruleset = this.getPluralRulesForLocale();

	    if (ruleset) {
	      return I18n.pluralRules[ruleset](count)
	    }

	    return 'other'
	  };

	  /**
	   * Work out which pluralisation rules to use for the current locale
	   *
	   * The locale may include a regional indicator (such as en-GB), but we don't
	   * usually care about this part, as pluralisation rules are usually the same
	   * regardless of region. There are exceptions, however, (e.g. Portuguese) so
	   * this searches by both the full and shortened locale codes, just to be sure.
	   *
	   * @returns {PluralRuleName | undefined} The name of the pluralisation rule to use (a key for one
	   *   of the functions in this.pluralRules)
	   */
	  I18n.prototype.getPluralRulesForLocale = function () {
	    var locale = this.locale;
	    var localeShort = locale.split('-')[0];

	    // Look through the plural rules map to find which `pluralRule` is
	    // appropriate for our current `locale`.
	    for (var pluralRule in I18n.pluralRulesMap) {
	      if (Object.prototype.hasOwnProperty.call(I18n.pluralRulesMap, pluralRule)) {
	        var languages = I18n.pluralRulesMap[pluralRule];
	        for (var i = 0; i < languages.length; i++) {
	          if (languages[i] === locale || languages[i] === localeShort) {
	            return pluralRule
	          }
	        }
	      }
	    }
	  };

	  /**
	   * Map of plural rules to languages where those rules apply.
	   *
	   * Note: These groups are named for the most dominant or recognisable language
	   * that uses each system. The groupings do not imply that the languages are
	   * related to one another. Many languages have evolved the same systems
	   * independently of one another.
	   *
	   * Code to support more languages can be found in the i18n spike:
	   * {@link https://github.com/alphagov/govuk-frontend/blob/spike-i18n-support/src/govuk/i18n.mjs}
	   *
	   * Languages currently supported:
	   *
	   * Arabic: Arabic (ar)
	   * Chinese: Burmese (my), Chinese (zh), Indonesian (id), Japanese (ja),
	   *   Javanese (jv), Korean (ko), Malay (ms), Thai (th), Vietnamese (vi)
	   * French: Armenian (hy), Bangla (bn), French (fr), Gujarati (gu), Hindi (hi),
	   *   Persian Farsi (fa), Punjabi (pa), Zulu (zu)
	   * German: Afrikaans (af), Albanian (sq), Azerbaijani (az), Basque (eu),
	   *   Bulgarian (bg), Catalan (ca), Danish (da), Dutch (nl), English (en),
	   *   Estonian (et), Finnish (fi), Georgian (ka), German (de), Greek (el),
	   *   Hungarian (hu), Luxembourgish (lb), Norwegian (no), Somali (so),
	   *   Swahili (sw), Swedish (sv), Tamil (ta), Telugu (te), Turkish (tr),
	   *   Urdu (ur)
	   * Irish: Irish Gaelic (ga)
	   * Russian: Russian (ru), Ukrainian (uk)
	   * Scottish: Scottish Gaelic (gd)
	   * Spanish: European Portuguese (pt-PT), Italian (it), Spanish (es)
	   * Welsh: Welsh (cy)
	   *
	   * @type {Object<PluralRuleName, string[]>}
	   */
	  I18n.pluralRulesMap = {
	    arabic: ['ar'],
	    chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
	    french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
	    german: [
	      'af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka',
	      'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'
	    ],
	    irish: ['ga'],
	    russian: ['ru', 'uk'],
	    scottish: ['gd'],
	    spanish: ['pt-PT', 'it', 'es'],
	    welsh: ['cy']
	  };

	  /**
	   * Different pluralisation rule sets
	   *
	   * Returns the appropriate suffix for the plural form associated with `n`.
	   * Possible suffixes: 'zero', 'one', 'two', 'few', 'many', 'other' (the actual
	   * meaning of each differs per locale). 'other' should always exist, even in
	   * languages without plurals, such as Chinese.
	   * {@link https://cldr.unicode.org/index/cldr-spec/plural-rules}
	   *
	   * The count must be a positive integer. Negative numbers and decimals aren't accounted for
	   *
	   * @type {Object<string, function(number): PluralRule>}
	   */
	  I18n.pluralRules = {
	    /* eslint-disable jsdoc/require-jsdoc */
	    arabic: function (n) {
	      if (n === 0) { return 'zero' }
	      if (n === 1) { return 'one' }
	      if (n === 2) { return 'two' }
	      if (n % 100 >= 3 && n % 100 <= 10) { return 'few' }
	      if (n % 100 >= 11 && n % 100 <= 99) { return 'many' }
	      return 'other'
	    },
	    chinese: function () {
	      return 'other'
	    },
	    french: function (n) {
	      return n === 0 || n === 1 ? 'one' : 'other'
	    },
	    german: function (n) {
	      return n === 1 ? 'one' : 'other'
	    },
	    irish: function (n) {
	      if (n === 1) { return 'one' }
	      if (n === 2) { return 'two' }
	      if (n >= 3 && n <= 6) { return 'few' }
	      if (n >= 7 && n <= 10) { return 'many' }
	      return 'other'
	    },
	    russian: function (n) {
	      var lastTwo = n % 100;
	      var last = lastTwo % 10;
	      if (last === 1 && lastTwo !== 11) { return 'one' }
	      if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
	      if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
	      // Note: The 'other' suffix is only used by decimal numbers in Russian.
	      // We don't anticipate it being used, but it's here for consistency.
	      return 'other'
	    },
	    scottish: function (n) {
	      if (n === 1 || n === 11) { return 'one' }
	      if (n === 2 || n === 12) { return 'two' }
	      if ((n >= 3 && n <= 10) || (n >= 13 && n <= 19)) { return 'few' }
	      return 'other'
	    },
	    spanish: function (n) {
	      if (n === 1) { return 'one' }
	      if (n % 1000000 === 0 && n !== 0) { return 'many' }
	      return 'other'
	    },
	    welsh: function (n) {
	      if (n === 0) { return 'zero' }
	      if (n === 1) { return 'one' }
	      if (n === 2) { return 'two' }
	      if (n === 3) { return 'few' }
	      if (n === 6) { return 'many' }
	      return 'other'
	    }
	    /* eslint-enable jsdoc/require-jsdoc */
	  };

	  /**
	   * Supported languages for plural rules
	   *
	   * @typedef {'arabic' | 'chinese' | 'french' | 'german' | 'irish' | 'russian' | 'scottish' | 'spanish' | 'welsh'} PluralRuleName
	   */

	  /**
	   * Plural rule category mnemonic tags
	   *
	   * @typedef {'zero' | 'one' | 'two' | 'few' | 'many' | 'other'} PluralRule
	   */

	  /**
	   * Translated message by plural rule they correspond to.
	   *
	   * Allows to group pluralised messages under a single key when passing
	   * translations to a component's constructor
	   *
	   * @typedef {object} TranslationPluralForms
	   * @property {string} [other] - General plural form
	   * @property {string} [zero] - Plural form used with 0
	   * @property {string} [one] - Plural form used with 1
	   * @property {string} [two] - Plural form used with 2
	   * @property {string} [few] - Plural form used for a few
	   * @property {string} [many] - Plural form used for many
	   */

	  (function(undefined) {

	      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
	      var detect = (
	        'DOMTokenList' in this && (function (x) {
	          return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
	        })(document.createElement('x'))
	      );

	      if (detect) return

	      // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
	      (function (global) {
	        var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

	        if (
	            !nativeImpl ||
	            (
	              !!document.createElementNS &&
	              !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
	              !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
	            )
	          ) {
	          global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
	            var dpSupport = true;
	            var defineGetter = function (object, name, fn, configurable) {
	              if (Object.defineProperty)
	                Object.defineProperty(object, name, {
	                  configurable: false === dpSupport ? true : !!configurable,
	                  get: fn
	                });

	              else object.__defineGetter__(name, fn);
	            };

	            /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
	            try {
	              defineGetter({}, "support");
	            }
	            catch (e) {
	              dpSupport = false;
	            }


	            var _DOMTokenList = function (el, prop) {
	              var that = this;
	              var tokens = [];
	              var tokenMap = {};
	              var length = 0;
	              var maxLength = 0;
	              var addIndexGetter = function (i) {
	                defineGetter(that, i, function () {
	                  preop();
	                  return tokens[i];
	                }, false);

	              };
	              var reindex = function () {

	                /** Define getter functions for array-like access to the tokenList's contents. */
	                if (length >= maxLength)
	                  for (; maxLength < length; ++maxLength) {
	                    addIndexGetter(maxLength);
	                  }
	              };

	              /** Helper function called at the start of each class method. Internal use only. */
	              var preop = function () {
	                var error;
	                var i;
	                var args = arguments;
	                var rSpace = /\s+/;

	                /** Validate the token/s passed to an instance method, if any. */
	                if (args.length)
	                  for (i = 0; i < args.length; ++i)
	                    if (rSpace.test(args[i])) {
	                      error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
	                      error.code = 5;
	                      error.name = "InvalidCharacterError";
	                      throw error;
	                    }


	                /** Split the new value apart by whitespace*/
	                if (typeof el[prop] === "object") {
	                  tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
	                } else {
	                  tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
	                }

	                /** Avoid treating blank strings as single-item token lists */
	                if ("" === tokens[0]) tokens = [];

	                /** Repopulate the internal token lists */
	                tokenMap = {};
	                for (i = 0; i < tokens.length; ++i)
	                  tokenMap[tokens[i]] = true;
	                length = tokens.length;
	                reindex();
	              };

	              /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
	              preop();

	              /** Return the number of tokens in the underlying string. Read-only. */
	              defineGetter(that, "length", function () {
	                preop();
	                return length;
	              });

	              /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
	              that.toLocaleString =
	                that.toString = function () {
	                  preop();
	                  return tokens.join(" ");
	                };

	              that.item = function (idx) {
	                preop();
	                return tokens[idx];
	              };

	              that.contains = function (token) {
	                preop();
	                return !!tokenMap[token];
	              };

	              that.add = function () {
	                preop.apply(that, args = arguments);

	                for (var args, token, i = 0, l = args.length; i < l; ++i) {
	                  token = args[i];
	                  if (!tokenMap[token]) {
	                    tokens.push(token);
	                    tokenMap[token] = true;
	                  }
	                }

	                /** Update the targeted attribute of the attached element if the token list's changed. */
	                if (length !== tokens.length) {
	                  length = tokens.length >>> 0;
	                  if (typeof el[prop] === "object") {
	                    el[prop].baseVal = tokens.join(" ");
	                  } else {
	                    el[prop] = tokens.join(" ");
	                  }
	                  reindex();
	                }
	              };

	              that.remove = function () {
	                preop.apply(that, args = arguments);

	                /** Build a hash of token names to compare against when recollecting our token list. */
	                for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
	                  ignore[args[i]] = true;
	                  delete tokenMap[args[i]];
	                }

	                /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
	                for (i = 0; i < tokens.length; ++i)
	                  if (!ignore[tokens[i]]) t.push(tokens[i]);

	                tokens = t;
	                length = t.length >>> 0;

	                /** Update the targeted attribute of the attached element. */
	                if (typeof el[prop] === "object") {
	                  el[prop].baseVal = tokens.join(" ");
	                } else {
	                  el[prop] = tokens.join(" ");
	                }
	                reindex();
	              };

	              that.toggle = function (token, force) {
	                preop.apply(that, [token]);

	                /** Token state's being forced. */
	                if (undefined !== force) {
	                  if (force) {
	                    that.add(token);
	                    return true;
	                  } else {
	                    that.remove(token);
	                    return false;
	                  }
	                }

	                /** Token already exists in tokenList. Remove it, and return FALSE. */
	                if (tokenMap[token]) {
	                  that.remove(token);
	                  return false;
	                }

	                /** Otherwise, add the token and return TRUE. */
	                that.add(token);
	                return true;
	              };

	              return that;
	            };

	            return _DOMTokenList;
	          }());
	        }

	        // Add second argument to native DOMTokenList.toggle() if necessary
	        (function () {
	          var e = document.createElement('span');
	          if (!('classList' in e)) return;
	          e.classList.toggle('x', false);
	          if (!e.classList.contains('x')) return;
	          e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
	            var force = arguments[1];
	            if (force === undefined) {
	              var add = !this.contains(token);
	              this[add ? 'add' : 'remove'](token);
	              return add;
	            }
	            force = !!force;
	            this[force ? 'add' : 'remove'](token);
	            return force;
	          };
	        }());

	        // Add multiple arguments to native DOMTokenList.add() if necessary
	        (function () {
	          var e = document.createElement('span');
	          if (!('classList' in e)) return;
	          e.classList.add('a', 'b');
	          if (e.classList.contains('b')) return;
	          var native = e.classList.constructor.prototype.add;
	          e.classList.constructor.prototype.add = function () {
	            var args = arguments;
	            var l = arguments.length;
	            for (var i = 0; i < l; i++) {
	              native.call(this, args[i]);
	            }
	          };
	        }());

	        // Add multiple arguments to native DOMTokenList.remove() if necessary
	        (function () {
	          var e = document.createElement('span');
	          if (!('classList' in e)) return;
	          e.classList.add('a');
	          e.classList.add('b');
	          e.classList.remove('a', 'b');
	          if (!e.classList.contains('b')) return;
	          var native = e.classList.constructor.prototype.remove;
	          e.classList.constructor.prototype.remove = function () {
	            var args = arguments;
	            var l = arguments.length;
	            for (var i = 0; i < l; i++) {
	              native.call(this, args[i]);
	            }
	          };
	        }());

	      }(this));

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
	      var detect = (
	        'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
	          var e = document.createElement('span');
	          e.classList.add('a', 'b');
	          return e.classList.contains('b');
	        }())
	      );

	      if (detect) return

	      // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
	      (function (global) {
	        var dpSupport = true;
	        var defineGetter = function (object, name, fn, configurable) {
	          if (Object.defineProperty)
	            Object.defineProperty(object, name, {
	              configurable: false === dpSupport ? true : !!configurable,
	              get: fn
	            });

	          else object.__defineGetter__(name, fn);
	        };
	        /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
	        try {
	          defineGetter({}, "support");
	        }
	        catch (e) {
	          dpSupport = false;
	        }
	        /** Polyfills a property with a DOMTokenList */
	        var addProp = function (o, name, attr) {

	          defineGetter(o.prototype, name, function () {
	            var tokenList;

	            var THIS = this,

	            /** Prevent this from firing twice for some reason. What the hell, IE. */
	            gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
	            if(THIS[gibberishProperty]) return tokenList;
	            THIS[gibberishProperty] = true;

	            /**
	             * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
	             *
	             * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
	             * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
	             * element instead, this would conflict with element types which use indexed properties (such as forms and
	             * select lists).
	             */
	            if (false === dpSupport) {

	              var visage;
	              var mirror = addProp.mirror || document.createElement("div");
	              var reflections = mirror.childNodes;
	              var l = reflections.length;

	              for (var i = 0; i < l; ++i)
	                if (reflections[i]._R === THIS) {
	                  visage = reflections[i];
	                  break;
	                }

	              /** Couldn't find an element's reflection inside the mirror. Materialise one. */
	              visage || (visage = mirror.appendChild(document.createElement("div")));

	              tokenList = DOMTokenList.call(visage, THIS, attr);
	            } else tokenList = new DOMTokenList(THIS, attr);

	            defineGetter(THIS, name, function () {
	              return tokenList;
	            });
	            delete THIS[gibberishProperty];

	            return tokenList;
	          }, true);
	        };

	        addProp(global.Element, "classList", "className");
	        addProp(global.HTMLElement, "classList", "className");
	        addProp(global.HTMLLinkElement, "relList", "rel");
	        addProp(global.HTMLAnchorElement, "relList", "rel");
	        addProp(global.HTMLAreaElement, "relList", "rel");
	      }(this));

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/detect.js
	    var detect = (
	      'document' in this && "matches" in document.documentElement
	    );

	    if (detect) return

	    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/polyfill.js
	    Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
	      var element = this;
	      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
	      var index = 0;

	      while (elements[index] && elements[index] !== element) {
	        ++index;
	      }

	      return !!elements[index];
	    };

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/detect.js
	    var detect = (
	      'document' in this && "closest" in document.documentElement
	    );

	    if (detect) return

	    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/polyfill.js
	    Element.prototype.closest = function closest(selector) {
	      var node = this;

	      while (node) {
	        if (node.matches(selector)) return node;
	        else node = 'SVGElement' in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
	      }

	      return null;
	    };

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
	  var detect = ('Window' in this);

	  if (detect) return

	  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
	  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
	  	(function (global) {
	  		if (global.constructor) {
	  			global.Window = global.constructor;
	  		} else {
	  			(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
	  		}
	  	}(this));
	  }

	  })
	  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
	  var detect = (
	    (function(global) {

	    	if (!('Event' in global)) return false;
	    	if (typeof global.Event === 'function') return true;

	    	try {

	    		// In IE 9-11, the Event object exists but cannot be instantiated
	    		new Event('click');
	    		return true;
	    	} catch(e) {
	    		return false;
	    	}
	    }(this))
	  );

	  if (detect) return

	  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
	  (function () {
	  	var unlistenableWindowEvents = {
	  		click: 1,
	  		dblclick: 1,
	  		keyup: 1,
	  		keypress: 1,
	  		keydown: 1,
	  		mousedown: 1,
	  		mouseup: 1,
	  		mousemove: 1,
	  		mouseover: 1,
	  		mouseenter: 1,
	  		mouseleave: 1,
	  		mouseout: 1,
	  		storage: 1,
	  		storagecommit: 1,
	  		textinput: 1
	  	};

	  	// This polyfill depends on availability of `document` so will not run in a worker
	  	// However, we asssume there are no browsers with worker support that lack proper
	  	// support for `Event` within the worker
	  	if (typeof document === 'undefined' || typeof window === 'undefined') return;

	  	function indexOf(array, element) {
	  		var
	  		index = -1,
	  		length = array.length;

	  		while (++index < length) {
	  			if (index in array && array[index] === element) {
	  				return index;
	  			}
	  		}

	  		return -1;
	  	}

	  	var existingProto = (window.Event && window.Event.prototype) || null;
	  	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
	  		if (!type) {
	  			throw new Error('Not enough arguments');
	  		}

	  		var event;
	  		// Shortcut if browser supports createEvent
	  		if ('createEvent' in document) {
	  			event = document.createEvent('Event');
	  			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
	  			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

	  			event.initEvent(type, bubbles, cancelable);

	  			return event;
	  		}

	  		event = document.createEventObject();

	  		event.type = type;
	  		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
	  		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

	  		return event;
	  	};
	  	if (existingProto) {
	  		Object.defineProperty(window.Event, 'prototype', {
	  			configurable: false,
	  			enumerable: false,
	  			writable: true,
	  			value: existingProto
	  		});
	  	}

	  	if (!('createEvent' in document)) {
	  		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
	  			var
	  			element = this,
	  			type = arguments[0],
	  			listener = arguments[1];

	  			if (element === window && type in unlistenableWindowEvents) {
	  				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
	  			}

	  			if (!element._events) {
	  				element._events = {};
	  			}

	  			if (!element._events[type]) {
	  				element._events[type] = function (event) {
	  					var
	  					list = element._events[event.type].list,
	  					events = list.slice(),
	  					index = -1,
	  					length = events.length,
	  					eventElement;

	  					event.preventDefault = function preventDefault() {
	  						if (event.cancelable !== false) {
	  							event.returnValue = false;
	  						}
	  					};

	  					event.stopPropagation = function stopPropagation() {
	  						event.cancelBubble = true;
	  					};

	  					event.stopImmediatePropagation = function stopImmediatePropagation() {
	  						event.cancelBubble = true;
	  						event.cancelImmediate = true;
	  					};

	  					event.currentTarget = element;
	  					event.relatedTarget = event.fromElement || null;
	  					event.target = event.target || event.srcElement || element;
	  					event.timeStamp = new Date().getTime();

	  					if (event.clientX) {
	  						event.pageX = event.clientX + document.documentElement.scrollLeft;
	  						event.pageY = event.clientY + document.documentElement.scrollTop;
	  					}

	  					while (++index < length && !event.cancelImmediate) {
	  						if (index in events) {
	  							eventElement = events[index];

	  							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
	  								eventElement.call(element, event);
	  							}
	  						}
	  					}
	  				};

	  				element._events[type].list = [];

	  				if (element.attachEvent) {
	  					element.attachEvent('on' + type, element._events[type]);
	  				}
	  			}

	  			element._events[type].list.push(listener);
	  		};

	  		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
	  			var
	  			element = this,
	  			type = arguments[0],
	  			listener = arguments[1],
	  			index;

	  			if (element._events && element._events[type] && element._events[type].list) {
	  				index = indexOf(element._events[type].list, listener);

	  				if (index !== -1) {
	  					element._events[type].list.splice(index, 1);

	  					if (!element._events[type].list.length) {
	  						if (element.detachEvent) {
	  							element.detachEvent('on' + type, element._events[type]);
	  						}
	  						delete element._events[type];
	  					}
	  				}
	  			}
	  		};

	  		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
	  			if (!arguments.length) {
	  				throw new Error('Not enough arguments');
	  			}

	  			if (!event || typeof event.type !== 'string') {
	  				throw new Error('DOM Events Exception 0');
	  			}

	  			var element = this, type = event.type;

	  			try {
	  				if (!event.bubbles) {
	  					event.cancelBubble = true;

	  					var cancelBubbleEvent = function (event) {
	  						event.cancelBubble = true;

	  						(element || window).detachEvent('on' + type, cancelBubbleEvent);
	  					};

	  					this.attachEvent('on' + type, cancelBubbleEvent);
	  				}

	  				this.fireEvent('on' + type, event);
	  			} catch (error) {
	  				event.target = element;

	  				do {
	  					event.currentTarget = element;

	  					if ('_events' in element && typeof element._events[type] === 'function') {
	  						element._events[type].call(element, event);
	  					}

	  					if (typeof element['on' + type] === 'function') {
	  						element['on' + type].call(element, event);
	  					}

	  					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
	  				} while (element && !event.cancelBubble);
	  			}

	  			return true;
	  		};

	  		// Add the DOMContentLoaded Event
	  		document.attachEvent('onreadystatechange', function() {
	  			if (document.readyState === 'complete') {
	  				document.dispatchEvent(new Event('DOMContentLoaded', {
	  					bubbles: true
	  				}));
	  			}
	  		});
	  	}
	  }());

	  })
	  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {
	    // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
	    var detect = 'bind' in Function.prototype;

	    if (detect) return

	    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
	    Object.defineProperty(Function.prototype, 'bind', {
	        value: function bind(that) { // .length is 1
	            // add necessary es5-shim utilities
	            var $Array = Array;
	            var $Object = Object;
	            var ObjectPrototype = $Object.prototype;
	            var ArrayPrototype = $Array.prototype;
	            var Empty = function Empty() {};
	            var to_string = ObjectPrototype.toString;
	            var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	            var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
	            var array_slice = ArrayPrototype.slice;
	            var array_concat = ArrayPrototype.concat;
	            var array_push = ArrayPrototype.push;
	            var max = Math.max;
	            // /add necessary es5-shim utilities

	            // 1. Let Target be the this value.
	            var target = this;
	            // 2. If IsCallable(Target) is false, throw a TypeError exception.
	            if (!isCallable(target)) {
	                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	            }
	            // 3. Let A be a new (possibly empty) internal list of all of the
	            //   argument values provided after thisArg (arg1, arg2 etc), in order.
	            // XXX slicedArgs will stand in for "A" if used
	            var args = array_slice.call(arguments, 1); // for normal call
	            // 4. Let F be a new native ECMAScript object.
	            // 11. Set the [[Prototype]] internal property of F to the standard
	            //   built-in Function prototype object as specified in 15.3.3.1.
	            // 12. Set the [[Call]] internal property of F as described in
	            //   15.3.4.5.1.
	            // 13. Set the [[Construct]] internal property of F as described in
	            //   15.3.4.5.2.
	            // 14. Set the [[HasInstance]] internal property of F as described in
	            //   15.3.4.5.3.
	            var bound;
	            var binder = function () {

	                if (this instanceof bound) {
	                    // 15.3.4.5.2 [[Construct]]
	                    // When the [[Construct]] internal method of a function object,
	                    // F that was created using the bind function is called with a
	                    // list of arguments ExtraArgs, the following steps are taken:
	                    // 1. Let target be the value of F's [[TargetFunction]]
	                    //   internal property.
	                    // 2. If target has no [[Construct]] internal method, a
	                    //   TypeError exception is thrown.
	                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	                    //   property.
	                    // 4. Let args be a new list containing the same values as the
	                    //   list boundArgs in the same order followed by the same
	                    //   values as the list ExtraArgs in the same order.
	                    // 5. Return the result of calling the [[Construct]] internal
	                    //   method of target providing args as the arguments.

	                    var result = target.apply(
	                        this,
	                        array_concat.call(args, array_slice.call(arguments))
	                    );
	                    if ($Object(result) === result) {
	                        return result;
	                    }
	                    return this;

	                } else {
	                    // 15.3.4.5.1 [[Call]]
	                    // When the [[Call]] internal method of a function object, F,
	                    // which was created using the bind function is called with a
	                    // this value and a list of arguments ExtraArgs, the following
	                    // steps are taken:
	                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	                    //   property.
	                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
	                    //   property.
	                    // 3. Let target be the value of F's [[TargetFunction]] internal
	                    //   property.
	                    // 4. Let args be a new list containing the same values as the
	                    //   list boundArgs in the same order followed by the same
	                    //   values as the list ExtraArgs in the same order.
	                    // 5. Return the result of calling the [[Call]] internal method
	                    //   of target providing boundThis as the this value and
	                    //   providing args as the arguments.

	                    // equiv: target.call(this, ...boundArgs, ...args)
	                    return target.apply(
	                        that,
	                        array_concat.call(args, array_slice.call(arguments))
	                    );

	                }

	            };

	            // 15. If the [[Class]] internal property of Target is "Function", then
	            //     a. Let L be the length property of Target minus the length of A.
	            //     b. Set the length own property of F to either 0 or L, whichever is
	            //       larger.
	            // 16. Else set the length own property of F to 0.

	            var boundLength = max(0, target.length - args.length);

	            // 17. Set the attributes of the length own property of F to the values
	            //   specified in 15.3.5.1.
	            var boundArgs = [];
	            for (var i = 0; i < boundLength; i++) {
	                array_push.call(boundArgs, '$' + i);
	            }

	            // XXX Build a dynamic function with desired amount of arguments is the only
	            // way to set the length property of a function.
	            // In environments where Content Security Policies enabled (Chrome extensions,
	            // for ex.) all use of eval or Function costructor throws an exception.
	            // However in all of these environments Function.prototype.bind exists
	            // and so this code will never be executed.
	            bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

	            if (target.prototype) {
	                Empty.prototype = target.prototype;
	                bound.prototype = new Empty();
	                // Clean up dangling references.
	                Empty.prototype = null;
	            }

	            // TODO
	            // 18. Set the [[Extensible]] internal property of F to true.

	            // TODO
	            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	            // 20. Call the [[DefineOwnProperty]] internal method of F with
	            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	            //   false.
	            // 21. Call the [[DefineOwnProperty]] internal method of F with
	            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	            //   and false.

	            // TODO
	            // NOTE Function objects created using Function.prototype.bind do not
	            // have a prototype property or the [[Code]], [[FormalParameters]], and
	            // [[Scope]] internal properties.
	            // XXX can't delete prototype in pure-js.

	            // 22. Return F.
	            return bound;
	        }
	    });
	  })
	  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * @constant
	   * @type {AccordionTranslations}
	   * @see Default value for {@link AccordionConfig.i18n}
	   * @default
	   */
	  var ACCORDION_TRANSLATIONS = {
	    hideAllSections: 'Hide all sections',
	    hideSection: 'Hide',
	    hideSectionAriaLabel: 'Hide this section',
	    showAllSections: 'Show all sections',
	    showSection: 'Show',
	    showSectionAriaLabel: 'Show this section'
	  };

	  /**
	   * Accordion component
	   *
	   * This allows a collection of sections to be collapsed by default, showing only
	   * their headers. Sections can be expanded or collapsed individually by clicking
	   * their headers. A "Show all sections" button is also added to the top of the
	   * accordion, which switches to "Hide all sections" when all the sections are
	   * expanded.
	   *
	   * The state of each section is saved to the DOM via the `aria-expanded`
	   * attribute, which also provides accessibility.
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for accordion
	   * @param {AccordionConfig} [config] - Accordion config
	   */
	  function Accordion ($module, config) {
	    this.$module = $module;

	    var defaultConfig = {
	      i18n: ACCORDION_TRANSLATIONS
	    };

	    this.config = mergeConfigs(
	      defaultConfig,
	      config || {},
	      normaliseDataset($module.dataset)
	    );

	    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'));

	    this.controlsClass = 'govuk-accordion__controls';
	    this.showAllClass = 'govuk-accordion__show-all';
	    this.showAllTextClass = 'govuk-accordion__show-all-text';

	    this.sectionClass = 'govuk-accordion__section';
	    this.sectionExpandedClass = 'govuk-accordion__section--expanded';
	    this.sectionButtonClass = 'govuk-accordion__section-button';
	    this.sectionHeaderClass = 'govuk-accordion__section-header';
	    this.sectionHeadingClass = 'govuk-accordion__section-heading';
	    this.sectionHeadingDividerClass = 'govuk-accordion__section-heading-divider';
	    this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text';
	    this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus';

	    this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle';
	    this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus';
	    this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text';
	    this.upChevronIconClass = 'govuk-accordion-nav__chevron';
	    this.downChevronIconClass = 'govuk-accordion-nav__chevron--down';

	    this.sectionSummaryClass = 'govuk-accordion__section-summary';
	    this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus';
	    this.sectionContentClass = 'govuk-accordion__section-content';

	    this.$sections = this.$module.querySelectorAll('.' + this.sectionClass);
	    this.browserSupportsSessionStorage = helper.checkForSessionStorage();
	  }

	  /**
	   * Initialise component
	   */
	  Accordion.prototype.init = function () {
	    // Check for module
	    if (!this.$module) {
	      return
	    }

	    this.initControls();
	    this.initSectionHeaders();

	    // See if "Show all sections" button text should be updated
	    var areAllSectionsOpen = this.checkIfAllSectionsOpen();
	    this.updateShowAllButton(areAllSectionsOpen);
	  };

	  /**
	   * Initialise controls and set attributes
	   */
	  Accordion.prototype.initControls = function () {
	    // Create "Show all" button and set attributes
	    this.$showAllButton = document.createElement('button');
	    this.$showAllButton.setAttribute('type', 'button');
	    this.$showAllButton.setAttribute('class', this.showAllClass);
	    this.$showAllButton.setAttribute('aria-expanded', 'false');

	    // Create icon, add to element
	    this.$showAllIcon = document.createElement('span');
	    this.$showAllIcon.classList.add(this.upChevronIconClass);
	    this.$showAllButton.appendChild(this.$showAllIcon);

	    // Create control wrapper and add controls to it
	    var $accordionControls = document.createElement('div');
	    $accordionControls.setAttribute('class', this.controlsClass);
	    $accordionControls.appendChild(this.$showAllButton);
	    this.$module.insertBefore($accordionControls, this.$module.firstChild);

	    // Build additional wrapper for Show all toggle text and place after icon
	    this.$showAllText = document.createElement('span');
	    this.$showAllText.classList.add(this.showAllTextClass);
	    this.$showAllButton.appendChild(this.$showAllText);

	    // Handle click events on the show/hide all button
	    this.$showAllButton.addEventListener('click', this.onShowOrHideAllToggle.bind(this));

	    // Handle 'beforematch' events, if the user agent supports them
	    if ('onbeforematch' in document) {
	      document.addEventListener('beforematch', this.onBeforeMatch.bind(this));
	    }
	  };

	  /**
	   * Initialise section headers
	   */
	  Accordion.prototype.initSectionHeaders = function () {
	    // Loop through section headers
	    nodeListForEach(this.$sections, function ($section, i) {
	      // Set header attributes
	      var $header = $section.querySelector('.' + this.sectionHeaderClass);
	      this.constructHeaderMarkup($header, i);
	      this.setExpanded(this.isExpanded($section), $section);

	      // Handle events
	      $header.addEventListener('click', this.onSectionToggle.bind(this, $section));

	      // See if there is any state stored in sessionStorage and set the sections to
	      // open or closed.
	      this.setInitialState($section);
	    }.bind(this));
	  };

	  /**
	   * Construct section header
	   *
	   * @param {HTMLDivElement} $header - Section header
	   * @param {number} index - Section index
	   */
	  Accordion.prototype.constructHeaderMarkup = function ($header, index) {
	    var $span = $header.querySelector('.' + this.sectionButtonClass);
	    var $heading = $header.querySelector('.' + this.sectionHeadingClass);
	    var $summary = $header.querySelector('.' + this.sectionSummaryClass);

	    // Create a button element that will replace the '.govuk-accordion__section-button' span
	    var $button = document.createElement('button');
	    $button.setAttribute('type', 'button');
	    $button.setAttribute('aria-controls', this.$module.id + '-content-' + (index + 1));

	    // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
	    for (var i = 0; i < $span.attributes.length; i++) {
	      var attr = $span.attributes.item(i);
	      // Add all attributes but not ID as this is being added to
	      // the section heading ($headingText)
	      if (attr.nodeName !== 'id') {
	        $button.setAttribute(attr.nodeName, attr.nodeValue);
	      }
	    }

	    // Create container for heading text so it can be styled
	    var $headingText = document.createElement('span');
	    $headingText.classList.add(this.sectionHeadingTextClass);
	    // Copy the span ID to the heading text to allow it to be referenced by `aria-labelledby` on the
	    // hidden content area without "Show this section"
	    $headingText.id = $span.id;

	    // Create an inner heading text container to limit the width of the focus state
	    var $headingTextFocus = document.createElement('span');
	    $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
	    $headingText.appendChild($headingTextFocus);
	    // span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
	    $headingTextFocus.innerHTML = $span.innerHTML;

	    // Create container for show / hide icons and text.
	    var $showHideToggle = document.createElement('span');
	    $showHideToggle.classList.add(this.sectionShowHideToggleClass);
	    // Tell Google not to index the 'show' text as part of the heading
	    // For the snippet to work with JavaScript, it must be added before adding the page element to the
	    // page's DOM. See https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr
	    $showHideToggle.setAttribute('data-nosnippet', '');
	    // Create an inner container to limit the width of the focus state
	    var $showHideToggleFocus = document.createElement('span');
	    $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
	    $showHideToggle.appendChild($showHideToggleFocus);
	    // Create wrapper for the show / hide text. Append text after the show/hide icon
	    var $showHideText = document.createElement('span');
	    var $showHideIcon = document.createElement('span');
	    $showHideIcon.classList.add(this.upChevronIconClass);
	    $showHideToggleFocus.appendChild($showHideIcon);
	    $showHideText.classList.add(this.sectionShowHideTextClass);
	    $showHideToggleFocus.appendChild($showHideText);

	    // Append elements to the button:
	    // 1. Heading text
	    // 2. Punctuation
	    // 3. (Optional: Summary line followed by punctuation)
	    // 4. Show / hide toggle
	    $button.appendChild($headingText);
	    $button.appendChild(this.getButtonPunctuationEl());

	    // If summary content exists add to DOM in correct order
	    if (typeof ($summary) !== 'undefined' && $summary !== null) {
	      // Create a new `span` element and copy the summary line content from the original `div` to the
	      // new `span`
	      // This is because the summary line text is now inside a button element, which can only contain
	      // phrasing content
	      var $summarySpan = document.createElement('span');
	      // Create an inner summary container to limit the width of the summary focus state
	      var $summarySpanFocus = document.createElement('span');
	      $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
	      $summarySpan.appendChild($summarySpanFocus);

	      // Get original attributes, and pass them to the replacement
	      for (var j = 0, l = $summary.attributes.length; j < l; ++j) {
	        var nodeName = $summary.attributes.item(j).nodeName;
	        var nodeValue = $summary.attributes.item(j).nodeValue;
	        $summarySpan.setAttribute(nodeName, nodeValue);
	      }

	      // Copy original contents of summary to the new summary span
	      $summarySpanFocus.innerHTML = $summary.innerHTML;

	      // Replace the original summary `div` with the new summary `span`
	      $summary.parentNode.replaceChild($summarySpan, $summary);

	      $button.appendChild($summarySpan);
	      $button.appendChild(this.getButtonPunctuationEl());
	    }

	    $button.appendChild($showHideToggle);

	    $heading.removeChild($span);
	    $heading.appendChild($button);
	  };

	  /**
	   * When a section is opened by the user agent via the 'beforematch' event
	   *
	   * @param {Event} event - Generic event
	   */
	  Accordion.prototype.onBeforeMatch = function (event) {
	    var $section = event.target.closest('.' + this.sectionClass);
	    if ($section) {
	      this.setExpanded(true, $section);
	    }
	  };

	  /**
	   * When section toggled, set and store state
	   *
	   * @param {HTMLElement} $section - Section element
	   */
	  Accordion.prototype.onSectionToggle = function ($section) {
	    var expanded = this.isExpanded($section);
	    this.setExpanded(!expanded, $section);

	    // Store the state in sessionStorage when a change is triggered
	    this.storeState($section);
	  };

	  /**
	   * When Open/Close All toggled, set and store state
	   */
	  Accordion.prototype.onShowOrHideAllToggle = function () {
	    var $module = this;
	    var $sections = this.$sections;
	    var nowExpanded = !this.checkIfAllSectionsOpen();

	    nodeListForEach($sections, function ($section) {
	      $module.setExpanded(nowExpanded, $section);
	      // Store the state in sessionStorage when a change is triggered
	      $module.storeState($section);
	    });

	    $module.updateShowAllButton(nowExpanded);
	  };

	  /**
	   * Set section attributes when opened/closed
	   *
	   * @param {boolean} expanded - Section expanded
	   * @param {HTMLElement} $section - Section element
	   */
	  Accordion.prototype.setExpanded = function (expanded, $section) {
	    var $showHideIcon = $section.querySelector('.' + this.upChevronIconClass);
	    var $showHideText = $section.querySelector('.' + this.sectionShowHideTextClass);
	    var $button = $section.querySelector('.' + this.sectionButtonClass);
	    var $content = $section.querySelector('.' + this.sectionContentClass);

	    var newButtonText = expanded
	      ? this.i18n.t('hideSection')
	      : this.i18n.t('showSection');

	    $showHideText.innerText = newButtonText;
	    $button.setAttribute('aria-expanded', expanded);

	    // Update aria-label combining
	    var ariaLabelParts = [];

	    var $headingText = $section.querySelector('.' + this.sectionHeadingTextClass);
	    if ($headingText) {
	      ariaLabelParts.push($headingText.innerText.trim());
	    }

	    var $summary = $section.querySelector('.' + this.sectionSummaryClass);
	    if ($summary) {
	      ariaLabelParts.push($summary.innerText.trim());
	    }

	    var ariaLabelMessage = expanded
	      ? this.i18n.t('hideSectionAriaLabel')
	      : this.i18n.t('showSectionAriaLabel');
	    ariaLabelParts.push(ariaLabelMessage);

	    /*
	     * Join with a comma to add pause for assistive technology.
	     * Example: [heading]Section A ,[pause] Show this section.
	     * https://accessibility.blog.gov.uk/2017/12/18/what-working-on-gov-uk-navigation-taught-us-about-accessibility/
	     */
	    $button.setAttribute('aria-label', ariaLabelParts.join(' , '));

	    // Swap icon, change class
	    if (expanded) {
	      $content.removeAttribute('hidden');
	      $section.classList.add(this.sectionExpandedClass);
	      $showHideIcon.classList.remove(this.downChevronIconClass);
	    } else {
	      $content.setAttribute('hidden', 'until-found');
	      $section.classList.remove(this.sectionExpandedClass);
	      $showHideIcon.classList.add(this.downChevronIconClass);
	    }

	    // See if "Show all sections" button text should be updated
	    var areAllSectionsOpen = this.checkIfAllSectionsOpen();
	    this.updateShowAllButton(areAllSectionsOpen);
	  };

	  /**
	   * Get state of section
	   *
	   * @param {HTMLElement} $section - Section element
	   * @returns {boolean} True if expanded
	   */
	  Accordion.prototype.isExpanded = function ($section) {
	    return $section.classList.contains(this.sectionExpandedClass)
	  };

	  /**
	   * Check if all sections are open
	   *
	   * @returns {boolean} True if all sections are open
	   */
	  Accordion.prototype.checkIfAllSectionsOpen = function () {
	    // Get a count of all the Accordion sections
	    var sectionsCount = this.$sections.length;
	    // Get a count of all Accordion sections that are expanded
	    var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
	    var areAllSectionsOpen = sectionsCount === expandedSectionCount;

	    return areAllSectionsOpen
	  };

	  /**
	   * Update "Show all sections" button
	   *
	   * @param {boolean} expanded - Section expanded
	   */
	  Accordion.prototype.updateShowAllButton = function (expanded) {
	    var newButtonText = expanded
	      ? this.i18n.t('hideAllSections')
	      : this.i18n.t('showAllSections');

	    this.$showAllButton.setAttribute('aria-expanded', expanded);
	    this.$showAllText.innerText = newButtonText;

	    // Swap icon, toggle class
	    if (expanded) {
	      this.$showAllIcon.classList.remove(this.downChevronIconClass);
	    } else {
	      this.$showAllIcon.classList.add(this.downChevronIconClass);
	    }
	  };

	  var helper = {
	    /**
	     * Check for `window.sessionStorage`, and that it actually works.
	     *
	     * @returns {boolean} True if session storage is available
	     */
	    checkForSessionStorage: function () {
	      var testString = 'this is the test string';
	      var result;
	      try {
	        window.sessionStorage.setItem(testString, testString);
	        result = window.sessionStorage.getItem(testString) === testString.toString();
	        window.sessionStorage.removeItem(testString);
	        return result
	      } catch (exception) {
	        return false
	      }
	    }
	  };

	  /**
	   * Set the state of the accordions in sessionStorage
	   *
	   * @param {HTMLElement} $section - Section element
	   */
	  Accordion.prototype.storeState = function ($section) {
	    if (this.browserSupportsSessionStorage) {
	      // We need a unique way of identifying each content in the Accordion. Since
	      // an `#id` should be unique and an `id` is required for `aria-` attributes
	      // `id` can be safely used.
	      var $button = $section.querySelector('.' + this.sectionButtonClass);

	      if ($button) {
	        var contentId = $button.getAttribute('aria-controls');
	        var contentState = $button.getAttribute('aria-expanded');

	        // Only set the state when both `contentId` and `contentState` are taken from the DOM.
	        if (contentId && contentState) {
	          window.sessionStorage.setItem(contentId, contentState);
	        }
	      }
	    }
	  };

	  /**
	   * Read the state of the accordions from sessionStorage
	   *
	   * @param {HTMLElement} $section - Section element
	   */
	  Accordion.prototype.setInitialState = function ($section) {
	    if (this.browserSupportsSessionStorage) {
	      var $button = $section.querySelector('.' + this.sectionButtonClass);

	      if ($button) {
	        var contentId = $button.getAttribute('aria-controls');
	        var contentState = contentId ? window.sessionStorage.getItem(contentId) : null;

	        if (contentState !== null) {
	          this.setExpanded(contentState === 'true', $section);
	        }
	      }
	    }
	  };

	  /**
	   * Create an element to improve semantics of the section button with punctuation
	   *
	   * Adding punctuation to the button can also improve its general semantics by dividing its contents
	   * into thematic chunks.
	   * See https://github.com/alphagov/govuk-frontend/issues/2327#issuecomment-922957442
	   *
	   * @returns {HTMLElement} DOM element
	   */
	  Accordion.prototype.getButtonPunctuationEl = function () {
	    var $punctuationEl = document.createElement('span');
	    $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
	    $punctuationEl.innerHTML = ', ';
	    return $punctuationEl
	  };

	  /**
	   * Accordion config
	   *
	   * @typedef {object} AccordionConfig
	   * @property {AccordionTranslations} [i18n = ACCORDION_TRANSLATIONS] - See constant {@link ACCORDION_TRANSLATIONS}
	   */

	  /**
	   * Accordion translations
	   *
	   * @typedef {object} AccordionTranslations
	   *
	   * Messages used by the component for the labels of its buttons. This includes
	   * the visible text shown on screen, and text to help assistive technology users
	   * for the buttons toggling each section.
	   * @property {string} [hideAllSections] - The text content for the 'Hide all
	   * sections' button, used when at least one section is expanded.
	   * @property {string} [hideSection] - The text content for the 'Hide'
	   * button, used when a section is expanded.
	   * @property {string} [hideSectionAriaLabel] - The text content appended to the
	   * 'Hide' button's accessible name when a section is expanded.
	   * @property {string} [showAllSections] - The text content for the 'Show all
	   * sections' button, used when all sections are collapsed.
	   * @property {string} [showSection] - The text content for the 'Show'
	   * button, used when a section is collapsed.
	   * @property {string} [showSectionAriaLabel] - The text content appended to the
	   * 'Show' button's accessible name when a section is expanded.
	   */

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  var KEY_SPACE = 32;
	  var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

	  /**
	   * JavaScript enhancements for the Button component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for button
	   * @param {ButtonConfig} [config] - Button config
	   */
	  function Button ($module, config) {
	    if (!$module) {
	      return this
	    }

	    this.$module = $module;
	    this.debounceFormSubmitTimer = null;

	    var defaultConfig = {
	      preventDoubleClick: false
	    };
	    this.config = mergeConfigs(
	      defaultConfig,
	      config || {},
	      normaliseDataset($module.dataset)
	    );
	  }

	  /**
	   * Initialise component
	   */
	  Button.prototype.init = function () {
	    if (!this.$module) {
	      return
	    }

	    this.$module.addEventListener('keydown', this.handleKeyDown);
	    this.$module.addEventListener('click', this.debounce.bind(this));
	  };

	  /**
	   * Trigger a click event when the space key is pressed
	   *
	   * Some screen readers tell users they can activate things with the 'button'
	   * role, so we need to match the functionality of native HTML buttons
	   *
	   * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
	   *
	   * @param {KeyboardEvent} event - Keydown event
	   */
	  Button.prototype.handleKeyDown = function (event) {
	    var $target = event.target;

	    if ($target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE) {
	      event.preventDefault(); // prevent the page from scrolling
	      $target.click();
	    }
	  };

	  /**
	   * Debounce double-clicks
	   *
	   * If the click quickly succeeds a previous click then nothing will happen. This
	   * stops people accidentally causing multiple form submissions by double
	   * clicking buttons.
	   *
	   * @param {MouseEvent} event - Mouse click event
	   * @returns {undefined | false} Returns undefined, or false when debounced
	   */
	  Button.prototype.debounce = function (event) {
	    // Check the button that was clicked has preventDoubleClick enabled
	    if (!this.config.preventDoubleClick) {
	      return
	    }

	    // If the timer is still running, prevent the click from submitting the form
	    if (this.debounceFormSubmitTimer) {
	      event.preventDefault();
	      return false
	    }

	    this.debounceFormSubmitTimer = setTimeout(function () {
	      this.debounceFormSubmitTimer = null;
	    }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
	  };

	  /**
	   * Button config
	   *
	   * @typedef {object} ButtonConfig
	   * @property {boolean} [preventDoubleClick = false] -
	   *  Prevent accidental double clicks on submit buttons from submitting forms
	   *  multiple times.
	   */

	  /**
	   * Returns the value of the given attribute closest to the given element (including itself)
	   *
	   * @param {HTMLElement} $element - The element to start walking the DOM tree up
	   * @param {string} attributeName - The name of the attribute
	   * @returns {string | undefined} Attribute value
	   */
	  function closestAttributeValue ($element, attributeName) {
	    var closestElementWithAttribute = $element.closest('[' + attributeName + ']');
	    if (closestElementWithAttribute) {
	      return closestElementWithAttribute.getAttribute(attributeName)
	    }
	  }

	  (function(undefined) {

	      // Detection from https://github.com/Financial-Times/polyfill-library/blob/v3.111.0/polyfills/Date/now/detect.js
	      var detect = ('Date' in self && 'now' in self.Date && 'getTime' in self.Date.prototype);

	      if (detect) return

	      // Polyfill from https://polyfill.io/v3/polyfill.js?version=3.111.0&features=Date.now&flags=always
	      Date.now = function () {
	          return new Date().getTime();
	      };

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  /* eslint-disable es-x/no-date-now -- Polyfill imported */

	  /**
	   * @constant
	   * @type {CharacterCountTranslations}
	   * @see Default value for {@link CharacterCountConfig.i18n}
	   * @default
	   */
	  var CHARACTER_COUNT_TRANSLATIONS = {
	    // Characters
	    charactersUnderLimit: {
	      one: 'You have %{count} character remaining',
	      other: 'You have %{count} characters remaining'
	    },
	    charactersAtLimit: 'You have 0 characters remaining',
	    charactersOverLimit: {
	      one: 'You have %{count} character too many',
	      other: 'You have %{count} characters too many'
	    },
	    // Words
	    wordsUnderLimit: {
	      one: 'You have %{count} word remaining',
	      other: 'You have %{count} words remaining'
	    },
	    wordsAtLimit: 'You have 0 words remaining',
	    wordsOverLimit: {
	      one: 'You have %{count} word too many',
	      other: 'You have %{count} words too many'
	    },
	    textareaDescription: {
	      other: ''
	    }
	  };

	  /**
	   * JavaScript enhancements for the CharacterCount component
	   *
	   * Tracks the number of characters or words in the `.govuk-js-character-count`
	   * `<textarea>` inside the element. Displays a message with the remaining number
	   * of characters/words available, or the number of characters/words in excess.
	   *
	   * You can configure the message to only appear after a certain percentage
	   * of the available characters/words has been entered.
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for character count
	   * @param {CharacterCountConfig} [config] - Character count config
	   */
	  function CharacterCount ($module, config) {
	    if (!$module) {
	      return this
	    }

	    var defaultConfig = {
	      threshold: 0,
	      i18n: CHARACTER_COUNT_TRANSLATIONS
	    };

	    // Read config set using dataset ('data-' values)
	    var datasetConfig = normaliseDataset($module.dataset);

	    // To ensure data-attributes take complete precedence, even if they change the
	    // type of count, we need to reset the `maxlength` and `maxwords` from the
	    // JavaScript config.
	    //
	    // We can't mutate `config`, though, as it may be shared across multiple
	    // components inside `initAll`.
	    var configOverrides = {};
	    if ('maxwords' in datasetConfig || 'maxlength' in datasetConfig) {
	      configOverrides = {
	        maxlength: false,
	        maxwords: false
	      };
	    }

	    this.config = mergeConfigs(
	      defaultConfig,
	      config || {},
	      configOverrides,
	      datasetConfig
	    );

	    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'), {
	      // Read the fallback if necessary rather than have it set in the defaults
	      locale: closestAttributeValue($module, 'lang')
	    });

	    // Determine the limit attribute (characters or words)
	    if (this.config.maxwords) {
	      this.maxLength = this.config.maxwords;
	    } else if (this.config.maxlength) {
	      this.maxLength = this.config.maxlength;
	    } else {
	      return
	    }

	    this.$module = $module;
	    this.$textarea = $module.querySelector('.govuk-js-character-count');
	    this.$visibleCountMessage = null;
	    this.$screenReaderCountMessage = null;
	    this.lastInputTimestamp = null;
	  }

	  /**
	   * Initialise component
	   */
	  CharacterCount.prototype.init = function () {
	    // Check that required elements are present
	    if (!this.$textarea) {
	      return
	    }

	    var $textarea = this.$textarea;
	    var $textareaDescription = document.getElementById($textarea.id + '-info');

	    // Inject a decription for the textarea if none is present already
	    // for when the component was rendered with no maxlength, maxwords
	    // nor custom textareaDescriptionText
	    if ($textareaDescription.innerText.match(/^\s*$/)) {
	      $textareaDescription.innerText = this.i18n.t('textareaDescription', { count: this.maxLength });
	    }

	    // Move the textarea description to be immediately after the textarea
	    // Kept for backwards compatibility
	    $textarea.insertAdjacentElement('afterend', $textareaDescription);

	    // Create the *screen reader* specific live-updating counter
	    // This doesn't need any styling classes, as it is never visible
	    var $screenReaderCountMessage = document.createElement('div');
	    $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden';
	    $screenReaderCountMessage.setAttribute('aria-live', 'polite');
	    this.$screenReaderCountMessage = $screenReaderCountMessage;
	    $textareaDescription.insertAdjacentElement('afterend', $screenReaderCountMessage);

	    // Create our live-updating counter element, copying the classes from the
	    // textarea description for backwards compatibility as these may have been
	    // configured
	    var $visibleCountMessage = document.createElement('div');
	    $visibleCountMessage.className = $textareaDescription.className;
	    $visibleCountMessage.classList.add('govuk-character-count__status');
	    $visibleCountMessage.setAttribute('aria-hidden', 'true');
	    this.$visibleCountMessage = $visibleCountMessage;
	    $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage);

	    // Hide the textarea description
	    $textareaDescription.classList.add('govuk-visually-hidden');

	    // Remove hard limit if set
	    $textarea.removeAttribute('maxlength');

	    this.bindChangeEvents();

	    // When the page is restored after navigating 'back' in some browsers the
	    // state of the character count is not restored until *after* the
	    // DOMContentLoaded event is fired, so we need to manually update it after the
	    // pageshow event in browsers that support it.
	    if ('onpageshow' in window) {
	      window.addEventListener('pageshow', this.updateCountMessage.bind(this));
	    } else {
	      window.addEventListener('DOMContentLoaded', this.updateCountMessage.bind(this));
	    }
	    this.updateCountMessage();
	  };

	  /**
	   * Bind change events
	   *
	   * Set up event listeners on the $textarea so that the count messages update
	   * when the user types.
	   */
	  CharacterCount.prototype.bindChangeEvents = function () {
	    var $textarea = this.$textarea;
	    $textarea.addEventListener('keyup', this.handleKeyUp.bind(this));

	    // Bind focus/blur events to start/stop polling
	    $textarea.addEventListener('focus', this.handleFocus.bind(this));
	    $textarea.addEventListener('blur', this.handleBlur.bind(this));
	  };

	  /**
	   * Handle key up event
	   *
	   * Update the visible character counter and keep track of when the last update
	   * happened for each keypress
	   */
	  CharacterCount.prototype.handleKeyUp = function () {
	    this.updateVisibleCountMessage();
	    this.lastInputTimestamp = Date.now();
	  };

	  /**
	   * Handle focus event
	   *
	   * Speech recognition software such as Dragon NaturallySpeaking will modify the
	   * fields by directly changing its `value`. These changes don't trigger events
	   * in JavaScript, so we need to poll to handle when and if they occur.
	   *
	   * Once the keyup event hasn't been detected for at least 1000 ms (1s), check if
	   * the textarea value has changed and update the count message if it has.
	   *
	   * This is so that the update triggered by the manual comparison doesn't
	   * conflict with debounced KeyboardEvent updates.
	   */
	  CharacterCount.prototype.handleFocus = function () {
	    this.valueChecker = setInterval(function () {
	      if (!this.lastInputTimestamp || (Date.now() - 500) >= this.lastInputTimestamp) {
	        this.updateIfValueChanged();
	      }
	    }.bind(this), 1000);
	  };

	  /**
	   * Handle blur event
	   *
	   * Stop checking the textarea value once the textarea no longer has focus
	   */
	  CharacterCount.prototype.handleBlur = function () {
	    // Cancel value checking on blur
	    clearInterval(this.valueChecker);
	  };

	  /**
	   * Update count message if textarea value has changed
	   */
	  CharacterCount.prototype.updateIfValueChanged = function () {
	    if (!this.$textarea.oldValue) this.$textarea.oldValue = '';
	    if (this.$textarea.value !== this.$textarea.oldValue) {
	      this.$textarea.oldValue = this.$textarea.value;
	      this.updateCountMessage();
	    }
	  };

	  /**
	   * Update count message
	   *
	   * Helper function to update both the visible and screen reader-specific
	   * counters simultaneously (e.g. on init)
	   */
	  CharacterCount.prototype.updateCountMessage = function () {
	    this.updateVisibleCountMessage();
	    this.updateScreenReaderCountMessage();
	  };

	  /**
	   * Update visible count message
	   */
	  CharacterCount.prototype.updateVisibleCountMessage = function () {
	    var $textarea = this.$textarea;
	    var $visibleCountMessage = this.$visibleCountMessage;
	    var remainingNumber = this.maxLength - this.count($textarea.value);

	    // If input is over the threshold, remove the disabled class which renders the
	    // counter invisible.
	    if (this.isOverThreshold()) {
	      $visibleCountMessage.classList.remove('govuk-character-count__message--disabled');
	    } else {
	      $visibleCountMessage.classList.add('govuk-character-count__message--disabled');
	    }

	    // Update styles
	    if (remainingNumber < 0) {
	      $textarea.classList.add('govuk-textarea--error');
	      $visibleCountMessage.classList.remove('govuk-hint');
	      $visibleCountMessage.classList.add('govuk-error-message');
	    } else {
	      $textarea.classList.remove('govuk-textarea--error');
	      $visibleCountMessage.classList.remove('govuk-error-message');
	      $visibleCountMessage.classList.add('govuk-hint');
	    }

	    // Update message
	    $visibleCountMessage.innerText = this.getCountMessage();
	  };

	  /**
	   * Update screen reader count message
	   */
	  CharacterCount.prototype.updateScreenReaderCountMessage = function () {
	    var $screenReaderCountMessage = this.$screenReaderCountMessage;

	    // If over the threshold, remove the aria-hidden attribute, allowing screen
	    // readers to announce the content of the element.
	    if (this.isOverThreshold()) {
	      $screenReaderCountMessage.removeAttribute('aria-hidden');
	    } else {
	      $screenReaderCountMessage.setAttribute('aria-hidden', true);
	    }

	    // Update message
	    $screenReaderCountMessage.innerText = this.getCountMessage();
	  };

	  /**
	   * Count the number of characters (or words, if `config.maxwords` is set)
	   * in the given text
	   *
	   * @param {string} text - The text to count the characters of
	   * @returns {number} the number of characters (or words) in the text
	   */
	  CharacterCount.prototype.count = function (text) {
	    if (this.config.maxwords) {
	      var tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars
	      return tokens.length
	    } else {
	      return text.length
	    }
	  };

	  /**
	   * Get count message
	   *
	   * @returns {string} Status message
	   */
	  CharacterCount.prototype.getCountMessage = function () {
	    var remainingNumber = this.maxLength - this.count(this.$textarea.value);

	    var countType = this.config.maxwords ? 'words' : 'characters';
	    return this.formatCountMessage(remainingNumber, countType)
	  };

	  /**
	   * Formats the message shown to users according to what's counted
	   * and how many remain
	   *
	   * @param {number} remainingNumber - The number of words/characaters remaining
	   * @param {string} countType - "words" or "characters"
	   * @returns {string} Status message
	   */
	  CharacterCount.prototype.formatCountMessage = function (remainingNumber, countType) {
	    if (remainingNumber === 0) {
	      return this.i18n.t(countType + 'AtLimit')
	    }

	    var translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit';

	    return this.i18n.t(countType + translationKeySuffix, { count: Math.abs(remainingNumber) })
	  };

	  /**
	   * Check if count is over threshold
	   *
	   * Checks whether the value is over the configured threshold for the input.
	   * If there is no configured threshold, it is set to 0 and this function will
	   * always return true.
	   *
	   * @returns {boolean} true if the current count is over the config.threshold
	   *   (or no threshold is set)
	   */
	  CharacterCount.prototype.isOverThreshold = function () {
	    // No threshold means we're always above threshold so save some computation
	    if (!this.config.threshold) {
	      return true
	    }

	    var $textarea = this.$textarea;

	    // Determine the remaining number of characters/words
	    var currentLength = this.count($textarea.value);
	    var maxLength = this.maxLength;

	    var thresholdValue = maxLength * this.config.threshold / 100;

	    return (thresholdValue <= currentLength)
	  };

	  /**
	   * Character count config
	   *
	   * @typedef {CharacterCountConfigWithMaxLength | CharacterCountConfigWithMaxWords} CharacterCountConfig
	   */

	  /**
	   * Character count config (with maximum number of characters)
	   *
	   * @typedef {object} CharacterCountConfigWithMaxLength
	   * @property {number} [maxlength] - The maximum number of characters.
	   *  If maxwords is provided, the maxlength option will be ignored.
	   * @property {number} [threshold = 0] - The percentage value of the limit at
	   *  which point the count message is displayed. If this attribute is set, the
	   *  count message will be hidden by default.
	   * @property {CharacterCountTranslations} [i18n = CHARACTER_COUNT_TRANSLATIONS] - See constant {@link CHARACTER_COUNT_TRANSLATIONS}
	   */

	  /**
	   * Character count config (with maximum number of words)
	   *
	   * @typedef {object} CharacterCountConfigWithMaxWords
	   * @property {number} [maxwords] - The maximum number of words. If maxwords is
	   *  provided, the maxlength option will be ignored.
	   * @property {number} [threshold = 0] - The percentage value of the limit at
	   *  which point the count message is displayed. If this attribute is set, the
	   *  count message will be hidden by default.
	   * @property {CharacterCountTranslations} [i18n = CHARACTER_COUNT_TRANSLATIONS] - See constant {@link CHARACTER_COUNT_TRANSLATIONS}
	   */

	  /**
	   * Character count translations
	   *
	   * @typedef {object} CharacterCountTranslations
	   *
	   * Messages shown to users as they type. It provides feedback on how many words
	   * or characters they have remaining or if they are over the limit. This also
	   * includes a message used as an accessible description for the textarea.
	   * @property {TranslationPluralForms} [charactersUnderLimit] - Message displayed
	   *   when the number of characters is under the configured maximum, `maxlength`.
	   *   This message is displayed visually and through assistive technologies. The
	   *   component will replace the `%{count}` placeholder with the number of
	   *   remaining characters. This is a [pluralised list of
	   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
	   * @property {string} [charactersAtLimit] - Message displayed when the number of
	   *   characters reaches the configured maximum, `maxlength`. This message is
	   *   displayed visually and through assistive technologies.
	   * @property {TranslationPluralForms} [charactersOverLimit] - Message displayed
	   *   when the number of characters is over the configured maximum, `maxlength`.
	   *   This message is displayed visually and through assistive technologies. The
	   *   component will replace the `%{count}` placeholder with the number of
	   *   remaining characters. This is a [pluralised list of
	   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
	   * @property {TranslationPluralForms} [wordsUnderLimit] - Message displayed when
	   *   the number of words is under the configured maximum, `maxlength`. This
	   *   message is displayed visually and through assistive technologies. The
	   *   component will replace the `%{count}` placeholder with the number of
	   *   remaining words. This is a [pluralised list of
	   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
	   * @property {string} [wordsAtLimit] - Message displayed when the number of
	   *   words reaches the configured maximum, `maxlength`. This message is
	   *   displayed visually and through assistive technologies.
	   * @property {TranslationPluralForms} [wordsOverLimit] - Message displayed when
	   *   the number of words is over the configured maximum, `maxlength`. This
	   *   message is displayed visually and through assistive technologies. The
	   *   component will replace the `%{count}` placeholder with the number of
	   *   remaining words. This is a [pluralised list of
	   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
	   * @property {TranslationPluralForms} [textareaDescription] - Message made
	   *   available to assistive technologies, if none is already present in the
	   *   HTML, to describe that the component accepts only a limited amount of
	   *   content. It is visible on the page when JavaScript is unavailable. The
	   *   component will replace the `%{count}` placeholder with the value of the
	   *   `maxlength` or `maxwords` parameter.
	   */

	  /**
	   * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
	   */

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * Checkboxes component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for checkboxes
	   */
	  function Checkboxes ($module) {
	    this.$module = $module;
	    this.$inputs = $module.querySelectorAll('input[type="checkbox"]');
	  }

	  /**
	   * Initialise component
	   *
	   * Checkboxes can be associated with a 'conditionally revealed' content block –
	   * for example, a checkbox for 'Phone' could reveal an additional form field for
	   * the user to enter their phone number.
	   *
	   * These associations are made using a `data-aria-controls` attribute, which is
	   * promoted to an aria-controls attribute during initialisation.
	   *
	   * We also need to restore the state of any conditional reveals on the page (for
	   * example if the user has navigated back), and set up event handlers to keep
	   * the reveal in sync with the checkbox state.
	   */
	  Checkboxes.prototype.init = function () {
	    var $module = this.$module;
	    var $inputs = this.$inputs;

	    nodeListForEach($inputs, function ($input) {
	      var targetId = $input.getAttribute('data-aria-controls');

	      // Skip checkboxes without data-aria-controls attributes, or where the
	      // target element does not exist.
	      if (!targetId || !document.getElementById(targetId)) {
	        return
	      }

	      // Promote the data-aria-controls attribute to a aria-controls attribute
	      // so that the relationship is exposed in the AOM
	      $input.setAttribute('aria-controls', targetId);
	      $input.removeAttribute('data-aria-controls');
	    });

	    // When the page is restored after navigating 'back' in some browsers the
	    // state of form controls is not restored until *after* the DOMContentLoaded
	    // event is fired, so we need to sync after the pageshow event in browsers
	    // that support it.
	    if ('onpageshow' in window) {
	      window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this));
	    } else {
	      window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this));
	    }

	    // Although we've set up handlers to sync state on the pageshow or
	    // DOMContentLoaded event, init could be called after those events have fired,
	    // for example if they are added to the page dynamically, so sync now too.
	    this.syncAllConditionalReveals();

	    // Handle events
	    $module.addEventListener('click', this.handleClick.bind(this));
	  };

	  /**
	   * Sync the conditional reveal states for all checkboxes in this $module.
	   */
	  Checkboxes.prototype.syncAllConditionalReveals = function () {
	    nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
	  };

	  /**
	   * Sync conditional reveal with the input state
	   *
	   * Synchronise the visibility of the conditional reveal, and its accessible
	   * state, with the input's checked state.
	   *
	   * @param {HTMLInputElement} $input - Checkbox input
	   */
	  Checkboxes.prototype.syncConditionalRevealWithInputState = function ($input) {
	    var $target = document.getElementById($input.getAttribute('aria-controls'));

	    if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
	      var inputIsChecked = $input.checked;

	      $input.setAttribute('aria-expanded', inputIsChecked);
	      $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
	    }
	  };

	  /**
	   * Uncheck other checkboxes
	   *
	   * Find any other checkbox inputs with the same name value, and uncheck them.
	   * This is useful for when a “None of these" checkbox is checked.
	   *
	   * @param {HTMLElement} $input - Checkbox input
	   */
	  Checkboxes.prototype.unCheckAllInputsExcept = function ($input) {
	    var allInputsWithSameName = document.querySelectorAll('input[type="checkbox"][name="' + $input.name + '"]');

	    nodeListForEach(allInputsWithSameName, function ($inputWithSameName) {
	      var hasSameFormOwner = ($input.form === $inputWithSameName.form);
	      if (hasSameFormOwner && $inputWithSameName !== $input) {
	        $inputWithSameName.checked = false;
	        this.syncConditionalRevealWithInputState($inputWithSameName);
	      }
	    }.bind(this));
	  };

	  /**
	   * Uncheck exclusive checkboxes
	   *
	   * Find any checkbox inputs with the same name value and the 'exclusive' behaviour,
	   * and uncheck them. This helps prevent someone checking both a regular checkbox and a
	   * "None of these" checkbox in the same fieldset.
	   *
	   * @param {HTMLInputElement} $input - Checkbox input
	   */
	  Checkboxes.prototype.unCheckExclusiveInputs = function ($input) {
	    var allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(
	      'input[data-behaviour="exclusive"][type="checkbox"][name="' + $input.name + '"]'
	    );

	    nodeListForEach(allInputsWithSameNameAndExclusiveBehaviour, function ($exclusiveInput) {
	      var hasSameFormOwner = ($input.form === $exclusiveInput.form);
	      if (hasSameFormOwner) {
	        $exclusiveInput.checked = false;
	        this.syncConditionalRevealWithInputState($exclusiveInput);
	      }
	    }.bind(this));
	  };

	  /**
	   * Click event handler
	   *
	   * Handle a click within the $module – if the click occurred on a checkbox, sync
	   * the state of any associated conditional reveal with the checkbox state.
	   *
	   * @param {MouseEvent} event - Click event
	   */
	  Checkboxes.prototype.handleClick = function (event) {
	    var $clickedInput = event.target;

	    // Ignore clicks on things that aren't checkbox inputs
	    if ($clickedInput.type !== 'checkbox') {
	      return
	    }

	    // If the checkbox conditionally-reveals some content, sync the state
	    var hasAriaControls = $clickedInput.getAttribute('aria-controls');
	    if (hasAriaControls) {
	      this.syncConditionalRevealWithInputState($clickedInput);
	    }

	    // No further behaviour needed for unchecking
	    if (!$clickedInput.checked) {
	      return
	    }

	    // Handle 'exclusive' checkbox behaviour (ie "None of these")
	    var hasBehaviourExclusive = ($clickedInput.getAttribute('data-behaviour') === 'exclusive');
	    if (hasBehaviourExclusive) {
	      this.unCheckAllInputsExcept($clickedInput);
	    } else {
	      this.unCheckExclusiveInputs($clickedInput);
	    }
	  };

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  var KEY_ENTER = 13;
	  var KEY_SPACE$1 = 32;

	  /**
	   * Details component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for details
	   */
	  function Details ($module) {
	    this.$module = $module;
	  }

	  /**
	   * Initialise component
	   */
	  Details.prototype.init = function () {
	    if (!this.$module) {
	      return
	    }

	    // If there is native details support, we want to avoid running code to polyfill native behaviour.
	    var hasNativeDetails = typeof this.$module.open === 'boolean';

	    if (hasNativeDetails) {
	      return
	    }

	    this.polyfillDetails();
	  };

	  /**
	   * Polyfill component in older browsers
	   */
	  Details.prototype.polyfillDetails = function () {
	    var $module = this.$module;

	    // Save shortcuts to the inner summary and content elements
	    var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
	    var $content = this.$content = $module.getElementsByTagName('div').item(0);

	    // If <details> doesn't have a <summary> and a <div> representing the content
	    // it means the required HTML structure is not met so the script will stop
	    if (!$summary || !$content) {
	      return
	    }

	    // If the content doesn't have an ID, assign it one now
	    // which we'll need for the summary's aria-controls assignment
	    if (!$content.id) {
	      $content.id = 'details-content-' + generateUniqueID();
	    }

	    // Add ARIA role="group" to details
	    $module.setAttribute('role', 'group');

	    // Add role=button to summary
	    $summary.setAttribute('role', 'button');

	    // Add aria-controls
	    $summary.setAttribute('aria-controls', $content.id);

	    // Set tabIndex so the summary is keyboard accessible for non-native elements
	    //
	    // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
	    // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.
	    $summary.tabIndex = 0;

	    // Detect initial open state
	    if (this.$module.hasAttribute('open')) {
	      $summary.setAttribute('aria-expanded', 'true');
	    } else {
	      $summary.setAttribute('aria-expanded', 'false');
	      $content.style.display = 'none';
	    }

	    // Bind an event to handle summary elements
	    this.polyfillHandleInputs(this.polyfillSetAttributes.bind(this));
	  };

	  /**
	   * Define a statechange function that updates aria-expanded and style.display
	   *
	   * @returns {boolean} Returns true
	   */
	  Details.prototype.polyfillSetAttributes = function () {
	    if (this.$module.hasAttribute('open')) {
	      this.$module.removeAttribute('open');
	      this.$summary.setAttribute('aria-expanded', 'false');
	      this.$content.style.display = 'none';
	    } else {
	      this.$module.setAttribute('open', 'open');
	      this.$summary.setAttribute('aria-expanded', 'true');
	      this.$content.style.display = '';
	    }

	    return true
	  };

	  /**
	   * Handle cross-modal click events
	   *
	   * @param {polyfillHandleInputsCallback} callback - function
	   */
	  Details.prototype.polyfillHandleInputs = function (callback) {
	    this.$summary.addEventListener('keypress', function (event) {
	      var $target = event.target;
	      // When the key gets pressed - check if it is enter or space
	      if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE$1) {
	        if ($target.nodeName.toLowerCase() === 'summary') {
	          // Prevent space from scrolling the page
	          // and enter from submitting a form
	          event.preventDefault();
	          // Click to let the click event do all the necessary action
	          if ($target.click) {
	            $target.click();
	          } else {
	            // except Safari 5.1 and under don't support .click() here
	            callback(event);
	          }
	        }
	      }
	    });

	    // Prevent keyup to prevent clicking twice in Firefox when using space key
	    this.$summary.addEventListener('keyup', function (event) {
	      var $target = event.target;
	      if (event.keyCode === KEY_SPACE$1) {
	        if ($target.nodeName.toLowerCase() === 'summary') {
	          event.preventDefault();
	        }
	      }
	    });

	    this.$summary.addEventListener('click', callback);
	  };

	  /**
	   * @callback polyfillHandleInputsCallback
	   * @param {UIEvent} event - Keyboard or mouse event
	   * @returns {void}
	   */

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * JavaScript enhancements for the ErrorSummary
	   *
	   * Takes focus on initialisation for accessible announcement, unless disabled in configuration.
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for error summary
	   * @param {ErrorSummaryConfig} [config] - Error summary config
	   */
	  function ErrorSummary ($module, config) {
	    // Some consuming code may not be passing a module,
	    // for example if they initialise the component
	    // on their own by directly passing the result
	    // of `document.querySelector`.
	    // To avoid breaking further JavaScript initialisation
	    // we need to safeguard against this so things keep
	    // working the same now we read the elements data attributes
	    if (!$module) {
	      // Little safety in case code gets ported as-is
	      // into and ES6 class constructor, where the return value matters
	      return this
	    }

	    this.$module = $module;

	    var defaultConfig = {
	      disableAutoFocus: false
	    };
	    this.config = mergeConfigs(
	      defaultConfig,
	      config || {},
	      normaliseDataset($module.dataset)
	    );
	  }

	  /**
	   * Initialise component
	   */
	  ErrorSummary.prototype.init = function () {
	    var $module = this.$module;
	    if (!$module) {
	      return
	    }

	    this.setFocus();
	    $module.addEventListener('click', this.handleClick.bind(this));
	  };

	  /**
	   * Focus the error summary
	   */
	  ErrorSummary.prototype.setFocus = function () {
	    var $module = this.$module;

	    if (this.config.disableAutoFocus) {
	      return
	    }

	    // Set tabindex to -1 to make the element programmatically focusable, but
	    // remove it on blur as the error summary doesn't need to be focused again.
	    $module.setAttribute('tabindex', '-1');

	    $module.addEventListener('blur', function () {
	      $module.removeAttribute('tabindex');
	    });

	    $module.focus();
	  };

	  /**
	   * Click event handler
	   *
	   * @param {MouseEvent} event - Click event
	   */
	  ErrorSummary.prototype.handleClick = function (event) {
	    var $target = event.target;
	    if (this.focusTarget($target)) {
	      event.preventDefault();
	    }
	  };

	  /**
	   * Focus the target element
	   *
	   * By default, the browser will scroll the target into view. Because our labels
	   * or legends appear above the input, this means the user will be presented with
	   * an input without any context, as the label or legend will be off the top of
	   * the screen.
	   *
	   * Manually handling the click event, scrolling the question into view and then
	   * focussing the element solves this.
	   *
	   * This also results in the label and/or legend being announced correctly in
	   * NVDA (as tested in 2018.3.2) - without this only the field type is announced
	   * (e.g. "Edit, has autocomplete").
	   *
	   * @param {EventTarget} $target - Event target
	   * @returns {boolean} True if the target was able to be focussed
	   */
	  ErrorSummary.prototype.focusTarget = function ($target) {
	    // If the element that was clicked was not a link, return early
	    if ($target.tagName !== 'A' || $target.href === false) {
	      return false
	    }

	    var inputId = this.getFragmentFromUrl($target.href);
	    var $input = document.getElementById(inputId);
	    if (!$input) {
	      return false
	    }

	    var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
	    if (!$legendOrLabel) {
	      return false
	    }

	    // Scroll the legend or label into view *before* calling focus on the input to
	    // avoid extra scrolling in browsers that don't support `preventScroll` (which
	    // at time of writing is most of them...)
	    $legendOrLabel.scrollIntoView();
	    $input.focus({ preventScroll: true });

	    return true
	  };

	  /**
	   * Get fragment from URL
	   *
	   * Extract the fragment (everything after the hash) from a URL, but not including
	   * the hash.
	   *
	   * @param {string} url - URL
	   * @returns {string} Fragment from URL, without the hash
	   */
	  ErrorSummary.prototype.getFragmentFromUrl = function (url) {
	    if (url.indexOf('#') === -1) {
	      return false
	    }

	    return url.split('#').pop()
	  };

	  /**
	   * Get associated legend or label
	   *
	   * Returns the first element that exists from this list:
	   *
	   * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
	   *   as the top of it is no more than half a viewport height away from the
	   *   bottom of the input
	   * - The first `<label>` that is associated with the input using for="inputId"
	   * - The closest parent `<label>`
	   *
	   * @param {HTMLElement} $input - The input
	   * @returns {HTMLElement} Associated legend or label, or null if no associated
	   *                        legend or label can be found
	   */
	  ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
	    var $fieldset = $input.closest('fieldset');

	    if ($fieldset) {
	      var $legends = $fieldset.getElementsByTagName('legend');

	      if ($legends.length) {
	        var $candidateLegend = $legends[0];

	        // If the input type is radio or checkbox, always use the legend if there
	        // is one.
	        if ($input.type === 'checkbox' || $input.type === 'radio') {
	          return $candidateLegend
	        }

	        // For other input types, only scroll to the fieldset’s legend (instead of
	        // the label associated with the input) if the input would end up in the
	        // top half of the screen.
	        //
	        // This should avoid situations where the input either ends up off the
	        // screen, or obscured by a software keyboard.
	        var legendTop = $candidateLegend.getBoundingClientRect().top;
	        var inputRect = $input.getBoundingClientRect();

	        // If the browser doesn't support Element.getBoundingClientRect().height
	        // or window.innerHeight (like IE8), bail and just link to the label.
	        if (inputRect.height && window.innerHeight) {
	          var inputBottom = inputRect.top + inputRect.height;

	          if (inputBottom - legendTop < window.innerHeight / 2) {
	            return $candidateLegend
	          }
	        }
	      }
	    }

	    return document.querySelector("label[for='" + $input.getAttribute('id') + "']") ||
	      $input.closest('label')
	  };

	  /**
	   * Error summary config
	   *
	   * @typedef {object} ErrorSummaryConfig
	   * @property {boolean} [disableAutoFocus = false] -
	   *  If set to `true` the error summary will not be focussed when the page loads.
	   */

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * Header component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for header
	   */
	  function Header ($module) {
	    this.$module = $module;
	    this.$menuButton = $module && $module.querySelector('.govuk-js-header-toggle');
	    this.$menu = this.$menuButton && $module.querySelector(
	      '#' + this.$menuButton.getAttribute('aria-controls')
	    );

	    // Save the opened/closed state for the nav in memory so that we can
	    // accurately maintain state when the screen is changed from small to
	    // big and back to small
	    this.menuIsOpen = false;

	    // A global const for storing a matchMedia instance which we'll use to
	    // detect when a screen size change happens. We set this later during the
	    // init function and rely on it being null if the feature isn't available
	    // to initially apply hidden attributes
	    this.mql = null;
	  }

	  /**
	   * Initialise component
	   *
	   * Check for the presence of the header, menu and menu button – if any are
	   * missing then there's nothing to do so return early.
	   * Feature sniff for and apply a matchMedia for desktop which will
	   * trigger a state sync if the browser viewport moves between states. If
	   * matchMedia isn't available, hide the menu button and present the "no js"
	   * version of the menu to the user.
	   */
	  Header.prototype.init = function () {
	    if (!this.$module || !this.$menuButton || !this.$menu) {
	      return
	    }

	    if ('matchMedia' in window) {
	      // Set the matchMedia to the govuk-frontend desktop breakpoint
	      this.mql = window.matchMedia('(min-width: 48.0625em)');

	      if ('addEventListener' in this.mql) {
	        this.mql.addEventListener('change', this.syncState.bind(this));
	      } else {
	        // addListener is a deprecated function, however addEventListener
	        // isn't supported by IE or Safari. We therefore add this in as
	        // a fallback for those browsers
	        this.mql.addListener(this.syncState.bind(this));
	      }

	      this.syncState();
	      this.$menuButton.addEventListener('click', this.handleMenuButtonClick.bind(this));
	    } else {
	      this.$menuButton.setAttribute('hidden', '');
	    }
	  };

	  /**
	   * Sync menu state
	   *
	   * Uses the global variable menuIsOpen to correctly set the accessible and
	   * visual states of the menu and the menu button.
	   * Additionally will force the menu to be visible and the menu button to be
	   * hidden if the matchMedia is triggered to desktop.
	   */
	  Header.prototype.syncState = function () {
	    if (this.mql.matches) {
	      this.$menu.removeAttribute('hidden');
	      this.$menuButton.setAttribute('hidden', '');
	    } else {
	      this.$menuButton.removeAttribute('hidden');
	      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen);

	      if (this.menuIsOpen) {
	        this.$menu.removeAttribute('hidden');
	      } else {
	        this.$menu.setAttribute('hidden', '');
	      }
	    }
	  };

	  /**
	   * Handle menu button click
	   *
	   * When the menu button is clicked, change the visibility of the menu and then
	   * sync the accessibility state and menu button state
	   */
	  Header.prototype.handleMenuButtonClick = function () {
	    this.menuIsOpen = !this.menuIsOpen;
	    this.syncState();
	  };

	  /**
	   * Notification Banner component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for notification banner
	   * @param {NotificationBannerConfig} [config] - Notification banner config
	   */
	  function NotificationBanner ($module, config) {
	    this.$module = $module;

	    var defaultConfig = {
	      disableAutoFocus: false
	    };
	    this.config = mergeConfigs(
	      defaultConfig,
	      config || {},
	      normaliseDataset($module.dataset)
	    );
	  }

	  /**
	   * Initialise component
	   */
	  NotificationBanner.prototype.init = function () {
	    var $module = this.$module;
	    // Check for module
	    if (!$module) {
	      return
	    }

	    this.setFocus();
	  };

	  /**
	   * Focus the element
	   *
	   * If `role="alert"` is set, focus the element to help some assistive technologies
	   * prioritise announcing it.
	   *
	   * You can turn off the auto-focus functionality by setting `data-disable-auto-focus="true"` in the
	   * component HTML. You might wish to do this based on user research findings, or to avoid a clash
	   * with another element which should be focused when the page loads.
	   */
	  NotificationBanner.prototype.setFocus = function () {
	    var $module = this.$module;

	    if (this.config.disableAutoFocus) {
	      return
	    }

	    if ($module.getAttribute('role') !== 'alert') {
	      return
	    }

	    // Set tabindex to -1 to make the element focusable with JavaScript.
	    // Remove the tabindex on blur as the component doesn't need to be focusable after the page has
	    // loaded.
	    if (!$module.getAttribute('tabindex')) {
	      $module.setAttribute('tabindex', '-1');

	      $module.addEventListener('blur', function () {
	        $module.removeAttribute('tabindex');
	      });
	    }

	    $module.focus();
	  };

	  /**
	   * Notification banner config
	   *
	   * @typedef {object} NotificationBannerConfig
	   * @property {boolean} [disableAutoFocus = false] -
	   *   If set to `true` the notification banner will not be focussed when the page
	   *   loads. This only applies if the component has a `role` of `alert` – in
	   *   other cases the component will not be focused on page load, regardless of
	   *   this option.
	   */

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * Radios component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for radios
	   */
	  function Radios ($module) {
	    this.$module = $module;
	    this.$inputs = $module.querySelectorAll('input[type="radio"]');
	  }

	  /**
	   * Initialise component
	   *
	   * Radios can be associated with a 'conditionally revealed' content block – for
	   * example, a radio for 'Phone' could reveal an additional form field for the
	   * user to enter their phone number.
	   *
	   * These associations are made using a `data-aria-controls` attribute, which is
	   * promoted to an aria-controls attribute during initialisation.
	   *
	   * We also need to restore the state of any conditional reveals on the page (for
	   * example if the user has navigated back), and set up event handlers to keep
	   * the reveal in sync with the radio state.
	   */
	  Radios.prototype.init = function () {
	    var $module = this.$module;
	    var $inputs = this.$inputs;

	    nodeListForEach($inputs, function ($input) {
	      var targetId = $input.getAttribute('data-aria-controls');

	      // Skip radios without data-aria-controls attributes, or where the
	      // target element does not exist.
	      if (!targetId || !document.getElementById(targetId)) {
	        return
	      }

	      // Promote the data-aria-controls attribute to a aria-controls attribute
	      // so that the relationship is exposed in the AOM
	      $input.setAttribute('aria-controls', targetId);
	      $input.removeAttribute('data-aria-controls');
	    });

	    // When the page is restored after navigating 'back' in some browsers the
	    // state of form controls is not restored until *after* the DOMContentLoaded
	    // event is fired, so we need to sync after the pageshow event in browsers
	    // that support it.
	    if ('onpageshow' in window) {
	      window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this));
	    } else {
	      window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this));
	    }

	    // Although we've set up handlers to sync state on the pageshow or
	    // DOMContentLoaded event, init could be called after those events have fired,
	    // for example if they are added to the page dynamically, so sync now too.
	    this.syncAllConditionalReveals();

	    // Handle events
	    $module.addEventListener('click', this.handleClick.bind(this));
	  };

	  /**
	   * Sync the conditional reveal states for all radio buttons in this $module.
	   */
	  Radios.prototype.syncAllConditionalReveals = function () {
	    nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
	  };

	  /**
	   * Sync conditional reveal with the input state
	   *
	   * Synchronise the visibility of the conditional reveal, and its accessible
	   * state, with the input's checked state.
	   *
	   * @param {HTMLInputElement} $input - Radio input
	   */
	  Radios.prototype.syncConditionalRevealWithInputState = function ($input) {
	    var $target = document.getElementById($input.getAttribute('aria-controls'));

	    if ($target && $target.classList.contains('govuk-radios__conditional')) {
	      var inputIsChecked = $input.checked;

	      $input.setAttribute('aria-expanded', inputIsChecked);
	      $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
	    }
	  };

	  /**
	   * Click event handler
	   *
	   * Handle a click within the $module – if the click occurred on a radio, sync
	   * the state of the conditional reveal for all radio buttons in the same form
	   * with the same name (because checking one radio could have un-checked a radio
	   * in another $module)
	   *
	   * @param {MouseEvent} event - Click event
	   */
	  Radios.prototype.handleClick = function (event) {
	    var $clickedInput = event.target;

	    // Ignore clicks on things that aren't radio buttons
	    if ($clickedInput.type !== 'radio') {
	      return
	    }

	    // We only need to consider radios with conditional reveals, which will have
	    // aria-controls attributes.
	    var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');

	    nodeListForEach($allInputs, function ($input) {
	      var hasSameFormOwner = ($input.form === $clickedInput.form);
	      var hasSameName = ($input.name === $clickedInput.name);

	      if (hasSameName && hasSameFormOwner) {
	        this.syncConditionalRevealWithInputState($input);
	      }
	    }.bind(this));
	  };

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * Skip link component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for skip link
	   */
	  function SkipLink ($module) {
	    this.$module = $module;
	    this.$linkedElement = null;
	    this.linkedElementListener = false;
	  }

	  /**
	   * Initialise component
	   */
	  SkipLink.prototype.init = function () {
	    // Check for module
	    if (!this.$module) {
	      return
	    }

	    // Check for linked element
	    this.$linkedElement = this.getLinkedElement();
	    if (!this.$linkedElement) {
	      return
	    }

	    this.$module.addEventListener('click', this.focusLinkedElement.bind(this));
	  };

	  /**
	   * Get linked element
	   *
	   * @returns {HTMLElement} $linkedElement - DOM element linked to from the skip link
	   */
	  SkipLink.prototype.getLinkedElement = function () {
	    var linkedElementId = this.getFragmentFromUrl();

	    if (!linkedElementId) {
	      return false
	    }

	    return document.getElementById(linkedElementId)
	  };

	  /**
	   * Focus the linked element
	   *
	   * Set tabindex and helper CSS class. Set listener to remove them on blur.
	   */
	  SkipLink.prototype.focusLinkedElement = function () {
	    var $linkedElement = this.$linkedElement;

	    if (!$linkedElement.getAttribute('tabindex')) {
	      // Set the element tabindex to -1 so it can be focused with JavaScript.
	      $linkedElement.setAttribute('tabindex', '-1');
	      $linkedElement.classList.add('govuk-skip-link-focused-element');

	      // Add listener for blur on the focused element (unless the listener has previously been added)
	      if (!this.linkedElementListener) {
	        this.$linkedElement.addEventListener('blur', this.removeFocusProperties.bind(this));
	        this.linkedElementListener = true;
	      }
	    }
	    $linkedElement.focus();
	  };

	  /**
	   * Remove the tabindex that makes the linked element focusable because the element only needs to be
	   * focusable until it has received programmatic focus and a screen reader has announced it.
	   *
	   * Remove the CSS class that removes the native focus styles.
	   */
	  SkipLink.prototype.removeFocusProperties = function () {
	    this.$linkedElement.removeAttribute('tabindex');
	    this.$linkedElement.classList.remove('govuk-skip-link-focused-element');
	  };

	  /**
	   * Get fragment from URL
	   *
	   * Extract the fragment (everything after the hash symbol) from a URL, but not including
	   * the symbol.
	   *
	   * @returns {string} Fragment from URL, without the hash symbol
	   */
	  SkipLink.prototype.getFragmentFromUrl = function () {
	    // Bail if the anchor link doesn't have a hash
	    if (!this.$module.hash) {
	      return false
	    }

	    return this.$module.hash.split('#').pop()
	  };

	  (function(undefined) {

	      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/nextElementSibling/detect.js
	      var detect = (
	        'document' in this && "nextElementSibling" in document.documentElement
	      );

	      if (detect) return

	      // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/nextElementSibling/polyfill.js
	      Object.defineProperty(Element.prototype, "nextElementSibling", {
	        get: function(){
	          var el = this.nextSibling;
	          while (el && el.nodeType !== 1) { el = el.nextSibling; }
	          return el;
	        }
	      });

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  (function(undefined) {

	      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/detect.js
	      var detect = (
	        'document' in this && "previousElementSibling" in document.documentElement
	      );

	      if (detect) return

	      // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/polyfill.js
	      Object.defineProperty(Element.prototype, 'previousElementSibling', {
	        get: function(){
	          var el = this.previousSibling;
	          while (el && el.nodeType !== 1) { el = el.previousSibling; }
	          return el;
	        }
	      });

	  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	  /* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	  /**
	   * Tabs component
	   *
	   * @class
	   * @param {HTMLElement} $module - HTML element to use for tabs
	   */
	  function Tabs ($module) {
	    this.$module = $module;
	    this.$tabs = $module.querySelectorAll('.govuk-tabs__tab');

	    this.keys = { left: 37, right: 39, up: 38, down: 40 };
	    this.jsHiddenClass = 'govuk-tabs__panel--hidden';
	  }

	  /**
	   * Initialise component
	   */
	  Tabs.prototype.init = function () {
	    if (typeof window.matchMedia === 'function') {
	      this.setupResponsiveChecks();
	    } else {
	      this.setup();
	    }
	  };

	  /**
	   * Setup viewport resize check
	   */
	  Tabs.prototype.setupResponsiveChecks = function () {
	    this.mql = window.matchMedia('(min-width: 40.0625em)');
	    this.mql.addListener(this.checkMode.bind(this));
	    this.checkMode();
	  };

	  /**
	   * Setup or teardown handler for viewport resize check
	   */
	  Tabs.prototype.checkMode = function () {
	    if (this.mql.matches) {
	      this.setup();
	    } else {
	      this.teardown();
	    }
	  };

	  /**
	   * Setup tab component
	   */
	  Tabs.prototype.setup = function () {
	    var $module = this.$module;
	    var $tabs = this.$tabs;
	    var $tabList = $module.querySelector('.govuk-tabs__list');
	    var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

	    if (!$tabs || !$tabList || !$tabListItems) {
	      return
	    }

	    $tabList.setAttribute('role', 'tablist');

	    nodeListForEach($tabListItems, function ($item) {
	      $item.setAttribute('role', 'presentation');
	    });

	    nodeListForEach($tabs, function ($tab) {
	      // Set HTML attributes
	      this.setAttributes($tab);

	      // Save bounded functions to use when removing event listeners during teardown
	      $tab.boundTabClick = this.onTabClick.bind(this);
	      $tab.boundTabKeydown = this.onTabKeydown.bind(this);

	      // Handle events
	      $tab.addEventListener('click', $tab.boundTabClick, true);
	      $tab.addEventListener('keydown', $tab.boundTabKeydown, true);

	      // Remove old active panels
	      this.hideTab($tab);
	    }.bind(this));

	    // Show either the active tab according to the URL's hash or the first tab
	    var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
	    this.showTab($activeTab);

	    // Handle hashchange events
	    $module.boundOnHashChange = this.onHashChange.bind(this);
	    window.addEventListener('hashchange', $module.boundOnHashChange, true);
	  };

	  /**
	   * Teardown tab component
	   */
	  Tabs.prototype.teardown = function () {
	    var $module = this.$module;
	    var $tabs = this.$tabs;
	    var $tabList = $module.querySelector('.govuk-tabs__list');
	    var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

	    if (!$tabs || !$tabList || !$tabListItems) {
	      return
	    }

	    $tabList.removeAttribute('role');

	    nodeListForEach($tabListItems, function ($item) {
	      $item.removeAttribute('role', 'presentation');
	    });

	    nodeListForEach($tabs, function ($tab) {
	      // Remove events
	      $tab.removeEventListener('click', $tab.boundTabClick, true);
	      $tab.removeEventListener('keydown', $tab.boundTabKeydown, true);

	      // Unset HTML attributes
	      this.unsetAttributes($tab);
	    }.bind(this));

	    // Remove hashchange event handler
	    window.removeEventListener('hashchange', $module.boundOnHashChange, true);
	  };

	  /**
	   * Handle hashchange event
	   *
	   * @param {HashChangeEvent} event - Hash change event
	   * @returns {void | undefined} Returns void, or undefined when prevented
	   */
	  Tabs.prototype.onHashChange = function (event) {
	    var hash = window.location.hash;
	    var $tabWithHash = this.getTab(hash);
	    if (!$tabWithHash) {
	      return
	    }

	    // Prevent changing the hash
	    if (this.changingHash) {
	      this.changingHash = false;
	      return
	    }

	    // Show either the active tab according to the URL's hash or the first tab
	    var $previousTab = this.getCurrentTab();

	    this.hideTab($previousTab);
	    this.showTab($tabWithHash);
	    $tabWithHash.focus();
	  };

	  /**
	   * Hide panel for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.hideTab = function ($tab) {
	    this.unhighlightTab($tab);
	    this.hidePanel($tab);
	  };

	  /**
	   * Show panel for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.showTab = function ($tab) {
	    this.highlightTab($tab);
	    this.showPanel($tab);
	  };

	  /**
	   * Get tab link by hash
	   *
	   * @param {string} hash - Hash fragment including #
	   * @returns {HTMLAnchorElement | null} Tab link
	   */
	  Tabs.prototype.getTab = function (hash) {
	    return this.$module.querySelector('.govuk-tabs__tab[href="' + hash + '"]')
	  };

	  /**
	   * Set tab link and panel attributes
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.setAttributes = function ($tab) {
	    // set tab attributes
	    var panelId = this.getHref($tab).slice(1);
	    $tab.setAttribute('id', 'tab_' + panelId);
	    $tab.setAttribute('role', 'tab');
	    $tab.setAttribute('aria-controls', panelId);
	    $tab.setAttribute('aria-selected', 'false');
	    $tab.setAttribute('tabindex', '-1');

	    // set panel attributes
	    var $panel = this.getPanel($tab);
	    $panel.setAttribute('role', 'tabpanel');
	    $panel.setAttribute('aria-labelledby', $tab.id);
	    $panel.classList.add(this.jsHiddenClass);
	  };

	  /**
	   * Unset tab link and panel attributes
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.unsetAttributes = function ($tab) {
	    // unset tab attributes
	    $tab.removeAttribute('id');
	    $tab.removeAttribute('role');
	    $tab.removeAttribute('aria-controls');
	    $tab.removeAttribute('aria-selected');
	    $tab.removeAttribute('tabindex');

	    // unset panel attributes
	    var $panel = this.getPanel($tab);
	    $panel.removeAttribute('role');
	    $panel.removeAttribute('aria-labelledby');
	    $panel.classList.remove(this.jsHiddenClass);
	  };

	  /**
	   * Handle tab link clicks
	   *
	   * @param {MouseEvent} event - Mouse click event
	   * @returns {void | false} Returns void, or false within tab link
	   */
	  Tabs.prototype.onTabClick = function (event) {
	    if (!event.target.classList.contains('govuk-tabs__tab')) {
	      // Allow events on child DOM elements to bubble up to tab parent
	      return false
	    }
	    event.preventDefault();
	    var $newTab = event.target;
	    var $currentTab = this.getCurrentTab();
	    this.hideTab($currentTab);
	    this.showTab($newTab);
	    this.createHistoryEntry($newTab);
	  };

	  /**
	   * Update browser URL hash fragment for tab
	   *
	   * - Allows back/forward to navigate tabs
	   * - Avoids page jump when hash changes
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.createHistoryEntry = function ($tab) {
	    var $panel = this.getPanel($tab);

	    // Save and restore the id
	    // so the page doesn't jump when a user clicks a tab (which changes the hash)
	    var panelId = $panel.id;
	    $panel.id = '';
	    this.changingHash = true;
	    window.location.hash = this.getHref($tab).slice(1);
	    $panel.id = panelId;
	  };

	  /**
	   * Handle tab keydown event
	   *
	   * - Press right/down arrow for next tab
	   * - Press left/up arrow for previous tab
	   *
	   * @param {KeyboardEvent} event - Keydown event
	   */
	  Tabs.prototype.onTabKeydown = function (event) {
	    switch (event.keyCode) {
	      case this.keys.left:
	      case this.keys.up:
	        this.activatePreviousTab();
	        event.preventDefault();
	        break
	      case this.keys.right:
	      case this.keys.down:
	        this.activateNextTab();
	        event.preventDefault();
	        break
	    }
	  };

	  /**
	   * Activate next tab
	   */
	  Tabs.prototype.activateNextTab = function () {
	    var $currentTab = this.getCurrentTab();
	    if (!$currentTab) {
	      return
	    }

	    var $nextTabListItem = $currentTab.parentElement.nextElementSibling;
	    if (!$nextTabListItem) {
	      return
	    }

	    var $nextTab = $nextTabListItem.querySelector('.govuk-tabs__tab');
	    if ($nextTab) {
	      this.hideTab($currentTab);
	      this.showTab($nextTab);
	      $nextTab.focus();
	      this.createHistoryEntry($nextTab);
	    }
	  };

	  /**
	   * Activate previous tab
	   */
	  Tabs.prototype.activatePreviousTab = function () {
	    var $currentTab = this.getCurrentTab();
	    if (!$currentTab) {
	      return
	    }

	    var $previousTabListItem = $currentTab.parentElement.previousElementSibling;
	    if (!$previousTabListItem) {
	      return
	    }

	    var $previousTab = $previousTabListItem.querySelector('.govuk-tabs__tab');
	    if ($previousTab) {
	      this.hideTab($currentTab);
	      this.showTab($previousTab);
	      $previousTab.focus();
	      this.createHistoryEntry($previousTab);
	    }
	  };

	  /**
	   * Get tab panel for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   * @returns {HTMLDivElement} Tab panel
	   */
	  Tabs.prototype.getPanel = function ($tab) {
	    var $panel = this.$module.querySelector(this.getHref($tab));
	    return $panel
	  };

	  /**
	   * Show tab panel for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.showPanel = function ($tab) {
	    var $panel = this.getPanel($tab);
	    $panel.classList.remove(this.jsHiddenClass);
	  };

	  /**
	   * Hide tab panel for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.hidePanel = function ($tab) {
	    var $panel = this.getPanel($tab);
	    $panel.classList.add(this.jsHiddenClass);
	  };

	  /**
	   * Unset 'selected' state for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.unhighlightTab = function ($tab) {
	    $tab.setAttribute('aria-selected', 'false');
	    $tab.parentNode.classList.remove('govuk-tabs__list-item--selected');
	    $tab.setAttribute('tabindex', '-1');
	  };

	  /**
	   * Set 'selected' state for tab link
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   */
	  Tabs.prototype.highlightTab = function ($tab) {
	    $tab.setAttribute('aria-selected', 'true');
	    $tab.parentNode.classList.add('govuk-tabs__list-item--selected');
	    $tab.setAttribute('tabindex', '0');
	  };

	  /**
	   * Get current tab link
	   *
	   * @returns {HTMLAnchorElement | undefined} Tab link
	   */
	  Tabs.prototype.getCurrentTab = function () {
	    return this.$module.querySelector('.govuk-tabs__list-item--selected .govuk-tabs__tab')
	  };

	  /**
	   * Get link hash fragment for href attribute
	   *
	   * this is because IE doesn't always return the actual value but a relative full path
	   * should be a utility function most prob
	   * {@link http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/}
	   *
	   * @param {HTMLAnchorElement} $tab - Tab link
	   * @returns {string} Hash fragment including #
	   */
	  Tabs.prototype.getHref = function ($tab) {
	    var href = $tab.getAttribute('href');
	    var hash = href.slice(href.indexOf('#'), href.length);
	    return hash
	  };

	  /**
	   * Initialise all components
	   *
	   * Use the `data-module` attributes to find, instantiate and init all of the
	   * components provided as part of GOV.UK Frontend.
	   *
	   * @param {Config} [config] - Config for all components
	   */
	  function initAll (config) {
	    config = typeof config !== 'undefined' ? config : {};

	    // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
	    // Defaults to the entire document if nothing is set.
	    var $scope = typeof config.scope !== 'undefined' ? config.scope : document;

	    var $accordions = $scope.querySelectorAll('[data-module="govuk-accordion"]');
	    nodeListForEach($accordions, function ($accordion) {
	      new Accordion($accordion, config.accordion).init();
	    });

	    var $buttons = $scope.querySelectorAll('[data-module="govuk-button"]');
	    nodeListForEach($buttons, function ($button) {
	      new Button($button, config.button).init();
	    });

	    var $characterCounts = $scope.querySelectorAll('[data-module="govuk-character-count"]');
	    nodeListForEach($characterCounts, function ($characterCount) {
	      new CharacterCount($characterCount, config.characterCount).init();
	    });

	    var $checkboxes = $scope.querySelectorAll('[data-module="govuk-checkboxes"]');
	    nodeListForEach($checkboxes, function ($checkbox) {
	      new Checkboxes($checkbox).init();
	    });

	    var $details = $scope.querySelectorAll('[data-module="govuk-details"]');
	    nodeListForEach($details, function ($detail) {
	      new Details($detail).init();
	    });

	    // Find first error summary module to enhance.
	    var $errorSummary = $scope.querySelector('[data-module="govuk-error-summary"]');
	    if ($errorSummary) {
	      new ErrorSummary($errorSummary, config.errorSummary).init();
	    }

	    // Find first header module to enhance.
	    var $header = $scope.querySelector('[data-module="govuk-header"]');
	    if ($header) {
	      new Header($header).init();
	    }

	    var $notificationBanners = $scope.querySelectorAll('[data-module="govuk-notification-banner"]');
	    nodeListForEach($notificationBanners, function ($notificationBanner) {
	      new NotificationBanner($notificationBanner, config.notificationBanner).init();
	    });

	    var $radios = $scope.querySelectorAll('[data-module="govuk-radios"]');
	    nodeListForEach($radios, function ($radio) {
	      new Radios($radio).init();
	    });

	    // Find first skip link module to enhance.
	    var $skipLink = $scope.querySelector('[data-module="govuk-skip-link"]');
	    new SkipLink($skipLink).init();

	    var $tabs = $scope.querySelectorAll('[data-module="govuk-tabs"]');
	    nodeListForEach($tabs, function ($tabs) {
	      new Tabs($tabs).init();
	    });
	  }

	  /**
	   * Config for all components
	   *
	   * @typedef {object} Config
	   * @property {HTMLElement} [scope=document] - Scope to query for components
	   * @property {import('./components/accordion/accordion.mjs').AccordionConfig} [accordion] - Accordion config
	   * @property {import('./components/button/button.mjs').ButtonConfig} [button] - Button config
	   * @property {import('./components/character-count/character-count.mjs').CharacterCountConfig} [characterCount] - Character Count config
	   * @property {import('./components/error-summary/error-summary.mjs').ErrorSummaryConfig} [errorSummary] - Error Summary config
	   * @property {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} [notificationBanner] - Notification Banner config
	   */

	  exports.initAll = initAll;
	  exports.Accordion = Accordion;
	  exports.Button = Button;
	  exports.Details = Details;
	  exports.CharacterCount = CharacterCount;
	  exports.Checkboxes = Checkboxes;
	  exports.ErrorSummary = ErrorSummary;
	  exports.Header = Header;
	  exports.NotificationBanner = NotificationBanner;
	  exports.Radios = Radios;
	  exports.SkipLink = SkipLink;
	  exports.Tabs = Tabs;

	})));

	});

	var bind = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		factory();
	}(commonjsGlobal, (function () {
		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
		var detect = (
		  // In IE8, defineProperty could only act on DOM elements, so full support
		  // for the feature requires the ability to set a property on an arbitrary object
		  'defineProperty' in Object && (function() {
		  	try {
		  		var a = {};
		  		Object.defineProperty(a, 'test', {value:42});
		  		return true;
		  	} catch(e) {
		  		return false
		  	}
		  }())
		);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
		(function (nativeDefineProperty) {

			var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
			var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
			var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

			Object.defineProperty = function defineProperty(object, property, descriptor) {

				// Where native support exists, assume it
				if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
					return nativeDefineProperty(object, property, descriptor);
				}

				if (object === null || !(object instanceof Object || typeof object === 'object')) {
					throw new TypeError('Object.defineProperty called on non-object');
				}

				if (!(descriptor instanceof Object)) {
					throw new TypeError('Property description must be an object');
				}

				var propertyString = String(property);
				var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
				var getterType = 'get' in descriptor && typeof descriptor.get;
				var setterType = 'set' in descriptor && typeof descriptor.set;

				// handle descriptor.get
				if (getterType) {
					if (getterType !== 'function') {
						throw new TypeError('Getter must be a function');
					}
					if (!supportsAccessors) {
						throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
					}
					if (hasValueOrWritable) {
						throw new TypeError(ERR_VALUE_ACCESSORS);
					}
					Object.__defineGetter__.call(object, propertyString, descriptor.get);
				} else {
					object[propertyString] = descriptor.value;
				}

				// handle descriptor.set
				if (setterType) {
					if (setterType !== 'function') {
						throw new TypeError('Setter must be a function');
					}
					if (!supportsAccessors) {
						throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
					}
					if (hasValueOrWritable) {
						throw new TypeError(ERR_VALUE_ACCESSORS);
					}
					Object.__defineSetter__.call(object, propertyString, descriptor.set);
				}

				// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
				if ('value' in descriptor) {
					object[propertyString] = descriptor.value;
				}

				return object;
			};
		}(Object.defineProperty));
		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {
		  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
		  var detect = 'bind' in Function.prototype;

		  if (detect) return

		  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
		  Object.defineProperty(Function.prototype, 'bind', {
		      value: function bind(that) { // .length is 1
		          // add necessary es5-shim utilities
		          var $Array = Array;
		          var $Object = Object;
		          var ObjectPrototype = $Object.prototype;
		          var ArrayPrototype = $Array.prototype;
		          var Empty = function Empty() {};
		          var to_string = ObjectPrototype.toString;
		          var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
		          var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
		          var array_slice = ArrayPrototype.slice;
		          var array_concat = ArrayPrototype.concat;
		          var array_push = ArrayPrototype.push;
		          var max = Math.max;
		          // /add necessary es5-shim utilities

		          // 1. Let Target be the this value.
		          var target = this;
		          // 2. If IsCallable(Target) is false, throw a TypeError exception.
		          if (!isCallable(target)) {
		              throw new TypeError('Function.prototype.bind called on incompatible ' + target);
		          }
		          // 3. Let A be a new (possibly empty) internal list of all of the
		          //   argument values provided after thisArg (arg1, arg2 etc), in order.
		          // XXX slicedArgs will stand in for "A" if used
		          var args = array_slice.call(arguments, 1); // for normal call
		          // 4. Let F be a new native ECMAScript object.
		          // 11. Set the [[Prototype]] internal property of F to the standard
		          //   built-in Function prototype object as specified in 15.3.3.1.
		          // 12. Set the [[Call]] internal property of F as described in
		          //   15.3.4.5.1.
		          // 13. Set the [[Construct]] internal property of F as described in
		          //   15.3.4.5.2.
		          // 14. Set the [[HasInstance]] internal property of F as described in
		          //   15.3.4.5.3.
		          var bound;
		          var binder = function () {

		              if (this instanceof bound) {
		                  // 15.3.4.5.2 [[Construct]]
		                  // When the [[Construct]] internal method of a function object,
		                  // F that was created using the bind function is called with a
		                  // list of arguments ExtraArgs, the following steps are taken:
		                  // 1. Let target be the value of F's [[TargetFunction]]
		                  //   internal property.
		                  // 2. If target has no [[Construct]] internal method, a
		                  //   TypeError exception is thrown.
		                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
		                  //   property.
		                  // 4. Let args be a new list containing the same values as the
		                  //   list boundArgs in the same order followed by the same
		                  //   values as the list ExtraArgs in the same order.
		                  // 5. Return the result of calling the [[Construct]] internal
		                  //   method of target providing args as the arguments.

		                  var result = target.apply(
		                      this,
		                      array_concat.call(args, array_slice.call(arguments))
		                  );
		                  if ($Object(result) === result) {
		                      return result;
		                  }
		                  return this;

		              } else {
		                  // 15.3.4.5.1 [[Call]]
		                  // When the [[Call]] internal method of a function object, F,
		                  // which was created using the bind function is called with a
		                  // this value and a list of arguments ExtraArgs, the following
		                  // steps are taken:
		                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
		                  //   property.
		                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
		                  //   property.
		                  // 3. Let target be the value of F's [[TargetFunction]] internal
		                  //   property.
		                  // 4. Let args be a new list containing the same values as the
		                  //   list boundArgs in the same order followed by the same
		                  //   values as the list ExtraArgs in the same order.
		                  // 5. Return the result of calling the [[Call]] internal method
		                  //   of target providing boundThis as the this value and
		                  //   providing args as the arguments.

		                  // equiv: target.call(this, ...boundArgs, ...args)
		                  return target.apply(
		                      that,
		                      array_concat.call(args, array_slice.call(arguments))
		                  );

		              }

		          };

		          // 15. If the [[Class]] internal property of Target is "Function", then
		          //     a. Let L be the length property of Target minus the length of A.
		          //     b. Set the length own property of F to either 0 or L, whichever is
		          //       larger.
		          // 16. Else set the length own property of F to 0.

		          var boundLength = max(0, target.length - args.length);

		          // 17. Set the attributes of the length own property of F to the values
		          //   specified in 15.3.5.1.
		          var boundArgs = [];
		          for (var i = 0; i < boundLength; i++) {
		              array_push.call(boundArgs, '$' + i);
		          }

		          // XXX Build a dynamic function with desired amount of arguments is the only
		          // way to set the length property of a function.
		          // In environments where Content Security Policies enabled (Chrome extensions,
		          // for ex.) all use of eval or Function costructor throws an exception.
		          // However in all of these environments Function.prototype.bind exists
		          // and so this code will never be executed.
		          bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

		          if (target.prototype) {
		              Empty.prototype = target.prototype;
		              bound.prototype = new Empty();
		              // Clean up dangling references.
		              Empty.prototype = null;
		          }

		          // TODO
		          // 18. Set the [[Extensible]] internal property of F to true.

		          // TODO
		          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
		          // 20. Call the [[DefineOwnProperty]] internal method of F with
		          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
		          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
		          //   false.
		          // 21. Call the [[DefineOwnProperty]] internal method of F with
		          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
		          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
		          //   and false.

		          // TODO
		          // NOTE Function objects created using Function.prototype.bind do not
		          // have a prototype property or the [[Code]], [[FormalParameters]], and
		          // [[Scope]] internal properties.
		          // XXX can't delete prototype in pure-js.

		          // 22. Return F.
		          return bound;
		      }
		  });
		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	})));

	});

	var classList = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		factory();
	}(commonjsGlobal, (function () {
		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
		var detect = (
		  // In IE8, defineProperty could only act on DOM elements, so full support
		  // for the feature requires the ability to set a property on an arbitrary object
		  'defineProperty' in Object && (function() {
		  	try {
		  		var a = {};
		  		Object.defineProperty(a, 'test', {value:42});
		  		return true;
		  	} catch(e) {
		  		return false
		  	}
		  }())
		);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
		(function (nativeDefineProperty) {

			var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
			var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
			var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

			Object.defineProperty = function defineProperty(object, property, descriptor) {

				// Where native support exists, assume it
				if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
					return nativeDefineProperty(object, property, descriptor);
				}

				if (object === null || !(object instanceof Object || typeof object === 'object')) {
					throw new TypeError('Object.defineProperty called on non-object');
				}

				if (!(descriptor instanceof Object)) {
					throw new TypeError('Property description must be an object');
				}

				var propertyString = String(property);
				var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
				var getterType = 'get' in descriptor && typeof descriptor.get;
				var setterType = 'set' in descriptor && typeof descriptor.set;

				// handle descriptor.get
				if (getterType) {
					if (getterType !== 'function') {
						throw new TypeError('Getter must be a function');
					}
					if (!supportsAccessors) {
						throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
					}
					if (hasValueOrWritable) {
						throw new TypeError(ERR_VALUE_ACCESSORS);
					}
					Object.__defineGetter__.call(object, propertyString, descriptor.get);
				} else {
					object[propertyString] = descriptor.value;
				}

				// handle descriptor.set
				if (setterType) {
					if (setterType !== 'function') {
						throw new TypeError('Setter must be a function');
					}
					if (!supportsAccessors) {
						throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
					}
					if (hasValueOrWritable) {
						throw new TypeError(ERR_VALUE_ACCESSORS);
					}
					Object.__defineSetter__.call(object, propertyString, descriptor.set);
				}

				// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
				if ('value' in descriptor) {
					object[propertyString] = descriptor.value;
				}

				return object;
			};
		}(Object.defineProperty));
		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
		    var detect = (
		      'DOMTokenList' in this && (function (x) {
		        return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
		      })(document.createElement('x'))
		    );

		    if (detect) return

		    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
		    (function (global) {
		      var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

		      if (
		          !nativeImpl ||
		          (
		            !!document.createElementNS &&
		            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
		            !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
		          )
		        ) {
		        global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
		          var dpSupport = true;
		          var defineGetter = function (object, name, fn, configurable) {
		            if (Object.defineProperty)
		              Object.defineProperty(object, name, {
		                configurable: false === dpSupport ? true : !!configurable,
		                get: fn
		              });

		            else object.__defineGetter__(name, fn);
		          };

		          /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
		          try {
		            defineGetter({}, "support");
		          }
		          catch (e) {
		            dpSupport = false;
		          }


		          var _DOMTokenList = function (el, prop) {
		            var that = this;
		            var tokens = [];
		            var tokenMap = {};
		            var length = 0;
		            var maxLength = 0;
		            var addIndexGetter = function (i) {
		              defineGetter(that, i, function () {
		                preop();
		                return tokens[i];
		              }, false);

		            };
		            var reindex = function () {

		              /** Define getter functions for array-like access to the tokenList's contents. */
		              if (length >= maxLength)
		                for (; maxLength < length; ++maxLength) {
		                  addIndexGetter(maxLength);
		                }
		            };

		            /** Helper function called at the start of each class method. Internal use only. */
		            var preop = function () {
		              var error;
		              var i;
		              var args = arguments;
		              var rSpace = /\s+/;

		              /** Validate the token/s passed to an instance method, if any. */
		              if (args.length)
		                for (i = 0; i < args.length; ++i)
		                  if (rSpace.test(args[i])) {
		                    error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
		                    error.code = 5;
		                    error.name = "InvalidCharacterError";
		                    throw error;
		                  }


		              /** Split the new value apart by whitespace*/
		              if (typeof el[prop] === "object") {
		                tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
		              } else {
		                tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
		              }

		              /** Avoid treating blank strings as single-item token lists */
		              if ("" === tokens[0]) tokens = [];

		              /** Repopulate the internal token lists */
		              tokenMap = {};
		              for (i = 0; i < tokens.length; ++i)
		                tokenMap[tokens[i]] = true;
		              length = tokens.length;
		              reindex();
		            };

		            /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
		            preop();

		            /** Return the number of tokens in the underlying string. Read-only. */
		            defineGetter(that, "length", function () {
		              preop();
		              return length;
		            });

		            /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
		            that.toLocaleString =
		              that.toString = function () {
		                preop();
		                return tokens.join(" ");
		              };

		            that.item = function (idx) {
		              preop();
		              return tokens[idx];
		            };

		            that.contains = function (token) {
		              preop();
		              return !!tokenMap[token];
		            };

		            that.add = function () {
		              preop.apply(that, args = arguments);

		              for (var args, token, i = 0, l = args.length; i < l; ++i) {
		                token = args[i];
		                if (!tokenMap[token]) {
		                  tokens.push(token);
		                  tokenMap[token] = true;
		                }
		              }

		              /** Update the targeted attribute of the attached element if the token list's changed. */
		              if (length !== tokens.length) {
		                length = tokens.length >>> 0;
		                if (typeof el[prop] === "object") {
		                  el[prop].baseVal = tokens.join(" ");
		                } else {
		                  el[prop] = tokens.join(" ");
		                }
		                reindex();
		              }
		            };

		            that.remove = function () {
		              preop.apply(that, args = arguments);

		              /** Build a hash of token names to compare against when recollecting our token list. */
		              for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
		                ignore[args[i]] = true;
		                delete tokenMap[args[i]];
		              }

		              /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
		              for (i = 0; i < tokens.length; ++i)
		                if (!ignore[tokens[i]]) t.push(tokens[i]);

		              tokens = t;
		              length = t.length >>> 0;

		              /** Update the targeted attribute of the attached element. */
		              if (typeof el[prop] === "object") {
		                el[prop].baseVal = tokens.join(" ");
		              } else {
		                el[prop] = tokens.join(" ");
		              }
		              reindex();
		            };

		            that.toggle = function (token, force) {
		              preop.apply(that, [token]);

		              /** Token state's being forced. */
		              if (undefined !== force) {
		                if (force) {
		                  that.add(token);
		                  return true;
		                } else {
		                  that.remove(token);
		                  return false;
		                }
		              }

		              /** Token already exists in tokenList. Remove it, and return FALSE. */
		              if (tokenMap[token]) {
		                that.remove(token);
		                return false;
		              }

		              /** Otherwise, add the token and return TRUE. */
		              that.add(token);
		              return true;
		            };

		            return that;
		          };

		          return _DOMTokenList;
		        }());
		      }

		      // Add second argument to native DOMTokenList.toggle() if necessary
		      (function () {
		        var e = document.createElement('span');
		        if (!('classList' in e)) return;
		        e.classList.toggle('x', false);
		        if (!e.classList.contains('x')) return;
		        e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
		          var force = arguments[1];
		          if (force === undefined) {
		            var add = !this.contains(token);
		            this[add ? 'add' : 'remove'](token);
		            return add;
		          }
		          force = !!force;
		          this[force ? 'add' : 'remove'](token);
		          return force;
		        };
		      }());

		      // Add multiple arguments to native DOMTokenList.add() if necessary
		      (function () {
		        var e = document.createElement('span');
		        if (!('classList' in e)) return;
		        e.classList.add('a', 'b');
		        if (e.classList.contains('b')) return;
		        var native = e.classList.constructor.prototype.add;
		        e.classList.constructor.prototype.add = function () {
		          var args = arguments;
		          var l = arguments.length;
		          for (var i = 0; i < l; i++) {
		            native.call(this, args[i]);
		          }
		        };
		      }());

		      // Add multiple arguments to native DOMTokenList.remove() if necessary
		      (function () {
		        var e = document.createElement('span');
		        if (!('classList' in e)) return;
		        e.classList.add('a');
		        e.classList.add('b');
		        e.classList.remove('a', 'b');
		        if (!e.classList.contains('b')) return;
		        var native = e.classList.constructor.prototype.remove;
		        e.classList.constructor.prototype.remove = function () {
		          var args = arguments;
		          var l = arguments.length;
		          for (var i = 0; i < l; i++) {
		            native.call(this, args[i]);
		          }
		        };
		      }());

		    }(this));

		}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
		var detect = ("Document" in this);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
		if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

			if (this.HTMLDocument) { // IE8

				// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
				this.Document = this.HTMLDocument;

			} else {

				// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
				this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
				this.Document.prototype = document;
			}
		}


		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
		var detect = ('Element' in this && 'HTMLElement' in this);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
		(function () {

			// IE8
			if (window.Element && !window.HTMLElement) {
				window.HTMLElement = window.Element;
				return;
			}

			// create Element constructor
			window.Element = window.HTMLElement = new Function('return function Element() {}')();

			// generate sandboxed iframe
			var vbody = document.appendChild(document.createElement('body'));
			var frame = vbody.appendChild(document.createElement('iframe'));

			// use sandboxed iframe to replicate Element functionality
			var frameDocument = frame.contentWindow.document;
			var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
			var cache = {};

			// polyfill Element.prototype on an element
			var shiv = function (element, deep) {
				var
				childNodes = element.childNodes || [],
				index = -1,
				key, value, childNode;

				if (element.nodeType === 1 && element.constructor !== Element) {
					element.constructor = Element;

					for (key in cache) {
						value = cache[key];
						element[key] = value;
					}
				}

				while (childNode = deep && childNodes[++index]) {
					shiv(childNode, deep);
				}

				return element;
			};

			var elements = document.getElementsByTagName('*');
			var nativeCreateElement = document.createElement;
			var interval;
			var loopLimit = 100;

			prototype.attachEvent('onpropertychange', function (event) {
				var
				propertyName = event.propertyName,
				nonValue = !cache.hasOwnProperty(propertyName),
				newValue = prototype[propertyName],
				oldValue = cache[propertyName],
				index = -1,
				element;

				while (element = elements[++index]) {
					if (element.nodeType === 1) {
						if (nonValue || element[propertyName] === oldValue) {
							element[propertyName] = newValue;
						}
					}
				}

				cache[propertyName] = newValue;
			});

			prototype.constructor = Element;

			if (!prototype.hasAttribute) {
				// <Element>.hasAttribute
				prototype.hasAttribute = function hasAttribute(name) {
					return this.getAttribute(name) !== null;
				};
			}

			// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
			function bodyCheck() {
				if (!(loopLimit--)) clearTimeout(interval);
				if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
					shiv(document, true);
					if (interval && document.body.prototype) clearTimeout(interval);
					return (!!document.body.prototype);
				}
				return false;
			}
			if (!bodyCheck()) {
				document.onreadystatechange = bodyCheck;
				interval = setInterval(bodyCheck, 25);
			}

			// Apply to any new elements created after load
			document.createElement = function createElement(nodeName) {
				var element = nativeCreateElement(String(nodeName).toLowerCase());
				return shiv(element);
			};

			// remove sandboxed iframe
			document.removeChild(vbody);
		}());

		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
		    var detect = (
		      'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
		        var e = document.createElement('span');
		        e.classList.add('a', 'b');
		        return e.classList.contains('b');
		      }())
		    );

		    if (detect) return

		    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
		    (function (global) {
		      var dpSupport = true;
		      var defineGetter = function (object, name, fn, configurable) {
		        if (Object.defineProperty)
		          Object.defineProperty(object, name, {
		            configurable: false === dpSupport ? true : !!configurable,
		            get: fn
		          });

		        else object.__defineGetter__(name, fn);
		      };
		      /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
		      try {
		        defineGetter({}, "support");
		      }
		      catch (e) {
		        dpSupport = false;
		      }
		      /** Polyfills a property with a DOMTokenList */
		      var addProp = function (o, name, attr) {

		        defineGetter(o.prototype, name, function () {
		          var tokenList;

		          var THIS = this,

		          /** Prevent this from firing twice for some reason. What the hell, IE. */
		          gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
		          if(THIS[gibberishProperty]) return tokenList;
		          THIS[gibberishProperty] = true;

		          /**
		           * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
		           *
		           * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
		           * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
		           * element instead, this would conflict with element types which use indexed properties (such as forms and
		           * select lists).
		           */
		          if (false === dpSupport) {

		            var visage;
		            var mirror = addProp.mirror || document.createElement("div");
		            var reflections = mirror.childNodes;
		            var l = reflections.length;

		            for (var i = 0; i < l; ++i)
		              if (reflections[i]._R === THIS) {
		                visage = reflections[i];
		                break;
		              }

		            /** Couldn't find an element's reflection inside the mirror. Materialise one. */
		            visage || (visage = mirror.appendChild(document.createElement("div")));

		            tokenList = DOMTokenList.call(visage, THIS, attr);
		          } else tokenList = new DOMTokenList(THIS, attr);

		          defineGetter(THIS, name, function () {
		            return tokenList;
		          });
		          delete THIS[gibberishProperty];

		          return tokenList;
		        }, true);
		      };

		      addProp(global.Element, "classList", "className");
		      addProp(global.HTMLElement, "classList", "className");
		      addProp(global.HTMLLinkElement, "relList", "rel");
		      addProp(global.HTMLAnchorElement, "relList", "rel");
		      addProp(global.HTMLAreaElement, "relList", "rel");
		    }(this));

		}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	})));

	});

	var Event_1 = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		factory();
	}(commonjsGlobal, (function () {
		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
		var detect = ('Window' in this);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
		if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
			(function (global) {
				if (global.constructor) {
					global.Window = global.constructor;
				} else {
					(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
				}
			}(this));
		}

		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
		var detect = ("Document" in this);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
		if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

			if (this.HTMLDocument) { // IE8

				// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
				this.Document = this.HTMLDocument;

			} else {

				// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
				this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
				this.Document.prototype = document;
			}
		}


		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
		var detect = ('Element' in this && 'HTMLElement' in this);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
		(function () {

			// IE8
			if (window.Element && !window.HTMLElement) {
				window.HTMLElement = window.Element;
				return;
			}

			// create Element constructor
			window.Element = window.HTMLElement = new Function('return function Element() {}')();

			// generate sandboxed iframe
			var vbody = document.appendChild(document.createElement('body'));
			var frame = vbody.appendChild(document.createElement('iframe'));

			// use sandboxed iframe to replicate Element functionality
			var frameDocument = frame.contentWindow.document;
			var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
			var cache = {};

			// polyfill Element.prototype on an element
			var shiv = function (element, deep) {
				var
				childNodes = element.childNodes || [],
				index = -1,
				key, value, childNode;

				if (element.nodeType === 1 && element.constructor !== Element) {
					element.constructor = Element;

					for (key in cache) {
						value = cache[key];
						element[key] = value;
					}
				}

				while (childNode = deep && childNodes[++index]) {
					shiv(childNode, deep);
				}

				return element;
			};

			var elements = document.getElementsByTagName('*');
			var nativeCreateElement = document.createElement;
			var interval;
			var loopLimit = 100;

			prototype.attachEvent('onpropertychange', function (event) {
				var
				propertyName = event.propertyName,
				nonValue = !cache.hasOwnProperty(propertyName),
				newValue = prototype[propertyName],
				oldValue = cache[propertyName],
				index = -1,
				element;

				while (element = elements[++index]) {
					if (element.nodeType === 1) {
						if (nonValue || element[propertyName] === oldValue) {
							element[propertyName] = newValue;
						}
					}
				}

				cache[propertyName] = newValue;
			});

			prototype.constructor = Element;

			if (!prototype.hasAttribute) {
				// <Element>.hasAttribute
				prototype.hasAttribute = function hasAttribute(name) {
					return this.getAttribute(name) !== null;
				};
			}

			// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
			function bodyCheck() {
				if (!(loopLimit--)) clearTimeout(interval);
				if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
					shiv(document, true);
					if (interval && document.body.prototype) clearTimeout(interval);
					return (!!document.body.prototype);
				}
				return false;
			}
			if (!bodyCheck()) {
				document.onreadystatechange = bodyCheck;
				interval = setInterval(bodyCheck, 25);
			}

			// Apply to any new elements created after load
			document.createElement = function createElement(nodeName) {
				var element = nativeCreateElement(String(nodeName).toLowerCase());
				return shiv(element);
			};

			// remove sandboxed iframe
			document.removeChild(vbody);
		}());

		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
		var detect = (
		  // In IE8, defineProperty could only act on DOM elements, so full support
		  // for the feature requires the ability to set a property on an arbitrary object
		  'defineProperty' in Object && (function() {
		  	try {
		  		var a = {};
		  		Object.defineProperty(a, 'test', {value:42});
		  		return true;
		  	} catch(e) {
		  		return false
		  	}
		  }())
		);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
		(function (nativeDefineProperty) {

			var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
			var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
			var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

			Object.defineProperty = function defineProperty(object, property, descriptor) {

				// Where native support exists, assume it
				if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
					return nativeDefineProperty(object, property, descriptor);
				}

				if (object === null || !(object instanceof Object || typeof object === 'object')) {
					throw new TypeError('Object.defineProperty called on non-object');
				}

				if (!(descriptor instanceof Object)) {
					throw new TypeError('Property description must be an object');
				}

				var propertyString = String(property);
				var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
				var getterType = 'get' in descriptor && typeof descriptor.get;
				var setterType = 'set' in descriptor && typeof descriptor.set;

				// handle descriptor.get
				if (getterType) {
					if (getterType !== 'function') {
						throw new TypeError('Getter must be a function');
					}
					if (!supportsAccessors) {
						throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
					}
					if (hasValueOrWritable) {
						throw new TypeError(ERR_VALUE_ACCESSORS);
					}
					Object.__defineGetter__.call(object, propertyString, descriptor.get);
				} else {
					object[propertyString] = descriptor.value;
				}

				// handle descriptor.set
				if (setterType) {
					if (setterType !== 'function') {
						throw new TypeError('Setter must be a function');
					}
					if (!supportsAccessors) {
						throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
					}
					if (hasValueOrWritable) {
						throw new TypeError(ERR_VALUE_ACCESSORS);
					}
					Object.__defineSetter__.call(object, propertyString, descriptor.set);
				}

				// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
				if ('value' in descriptor) {
					object[propertyString] = descriptor.value;
				}

				return object;
			};
		}(Object.defineProperty));
		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

		(function(undefined) {

		// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
		var detect = (
		  (function(global) {

		  	if (!('Event' in global)) return false;
		  	if (typeof global.Event === 'function') return true;

		  	try {

		  		// In IE 9-11, the Event object exists but cannot be instantiated
		  		new Event('click');
		  		return true;
		  	} catch(e) {
		  		return false;
		  	}
		  }(this))
		);

		if (detect) return

		// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
		(function () {
			var unlistenableWindowEvents = {
				click: 1,
				dblclick: 1,
				keyup: 1,
				keypress: 1,
				keydown: 1,
				mousedown: 1,
				mouseup: 1,
				mousemove: 1,
				mouseover: 1,
				mouseenter: 1,
				mouseleave: 1,
				mouseout: 1,
				storage: 1,
				storagecommit: 1,
				textinput: 1
			};

			// This polyfill depends on availability of `document` so will not run in a worker
			// However, we asssume there are no browsers with worker support that lack proper
			// support for `Event` within the worker
			if (typeof document === 'undefined' || typeof window === 'undefined') return;

			function indexOf(array, element) {
				var
				index = -1,
				length = array.length;

				while (++index < length) {
					if (index in array && array[index] === element) {
						return index;
					}
				}

				return -1;
			}

			var existingProto = (window.Event && window.Event.prototype) || null;
			window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
				if (!type) {
					throw new Error('Not enough arguments');
				}

				var event;
				// Shortcut if browser supports createEvent
				if ('createEvent' in document) {
					event = document.createEvent('Event');
					var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
					var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

					event.initEvent(type, bubbles, cancelable);

					return event;
				}

				event = document.createEventObject();

				event.type = type;
				event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
				event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

				return event;
			};
			if (existingProto) {
				Object.defineProperty(window.Event, 'prototype', {
					configurable: false,
					enumerable: false,
					writable: true,
					value: existingProto
				});
			}

			if (!('createEvent' in document)) {
				window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
					var
					element = this,
					type = arguments[0],
					listener = arguments[1];

					if (element === window && type in unlistenableWindowEvents) {
						throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
					}

					if (!element._events) {
						element._events = {};
					}

					if (!element._events[type]) {
						element._events[type] = function (event) {
							var
							list = element._events[event.type].list,
							events = list.slice(),
							index = -1,
							length = events.length,
							eventElement;

							event.preventDefault = function preventDefault() {
								if (event.cancelable !== false) {
									event.returnValue = false;
								}
							};

							event.stopPropagation = function stopPropagation() {
								event.cancelBubble = true;
							};

							event.stopImmediatePropagation = function stopImmediatePropagation() {
								event.cancelBubble = true;
								event.cancelImmediate = true;
							};

							event.currentTarget = element;
							event.relatedTarget = event.fromElement || null;
							event.target = event.target || event.srcElement || element;
							event.timeStamp = new Date().getTime();

							if (event.clientX) {
								event.pageX = event.clientX + document.documentElement.scrollLeft;
								event.pageY = event.clientY + document.documentElement.scrollTop;
							}

							while (++index < length && !event.cancelImmediate) {
								if (index in events) {
									eventElement = events[index];

									if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
										eventElement.call(element, event);
									}
								}
							}
						};

						element._events[type].list = [];

						if (element.attachEvent) {
							element.attachEvent('on' + type, element._events[type]);
						}
					}

					element._events[type].list.push(listener);
				};

				window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
					var
					element = this,
					type = arguments[0],
					listener = arguments[1],
					index;

					if (element._events && element._events[type] && element._events[type].list) {
						index = indexOf(element._events[type].list, listener);

						if (index !== -1) {
							element._events[type].list.splice(index, 1);

							if (!element._events[type].list.length) {
								if (element.detachEvent) {
									element.detachEvent('on' + type, element._events[type]);
								}
								delete element._events[type];
							}
						}
					}
				};

				window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
					if (!arguments.length) {
						throw new Error('Not enough arguments');
					}

					if (!event || typeof event.type !== 'string') {
						throw new Error('DOM Events Exception 0');
					}

					var element = this, type = event.type;

					try {
						if (!event.bubbles) {
							event.cancelBubble = true;

							var cancelBubbleEvent = function (event) {
								event.cancelBubble = true;

								(element || window).detachEvent('on' + type, cancelBubbleEvent);
							};

							this.attachEvent('on' + type, cancelBubbleEvent);
						}

						this.fireEvent('on' + type, event);
					} catch (error) {
						event.target = element;

						do {
							event.currentTarget = element;

							if ('_events' in element && typeof element._events[type] === 'function') {
								element._events[type].call(element, event);
							}

							if (typeof element['on' + type] === 'function') {
								element['on' + type].call(element, event);
							}

							element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
						} while (element && !event.cancelBubble);
					}

					return true;
				};

				// Add the DOMContentLoaded Event
				document.attachEvent('onreadystatechange', function() {
					if (document.readyState === 'complete') {
						document.dispatchEvent(new Event('DOMContentLoaded', {
							bubbles: true
						}));
					}
				});
			}
		}());

		})
		.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof commonjsGlobal && commonjsGlobal || {});

	})));

	});

	// Taken from https://github.com/alphagov/govuk-design-system/blob/29b9cf8c30ac1514d16fc97adaf15100e5040f7d/src/javascripts/components/tabs.js

	var nodeListForEach = common.nodeListForEach;

	var tabsItemClass = 'app-tabs__item';
	var tabsItemCurrentClass = tabsItemClass + '--current';
	var tabsItemJsClass = 'js-tabs__item';
	var headingItemClass = 'app-tabs__heading';
	var headingItemCurrentClass = headingItemClass + '--current';
	var headingItemJsClass = 'js-tabs__heading';
	var tabContainerHiddenClass = 'app-tabs__container--hidden';
	var tabContainerJsClass = '.js-tabs__container';
	var tabContainerNoTabsJsClass = 'js-tabs__container--no-tabs';
	var allTabTogglers = '.' + tabsItemJsClass + ' a, ' + '.' + headingItemJsClass + ' a';
	var tabTogglersMarkedOpenClass = '.js-tabs__item--open a';

	function AppTabs ($module) {
	  this.$module = $module;
	  this.$allTabContainers = this.$module.querySelectorAll(tabContainerJsClass);
	  this.$allTabTogglers = this.$module.querySelectorAll(allTabTogglers);
	  this.$allTabTogglersMarkedOpen = this.$module.querySelectorAll(tabTogglersMarkedOpenClass);
	}

	AppTabs.prototype.init = function () {
	  if (!this.$module) {
	    return
	  }
	  // reset all tabs
	  this.resetTabs();
	  // add close to each tab
	  this.$module.addEventListener('click', this.handleClick.bind(this));

	  nodeListForEach(this.$allTabTogglersMarkedOpen, function ($tabToggler) {
	    $tabToggler.click();
	  });
	};

	// expand and collapse functionality
	AppTabs.prototype.activateAndToggle = function (event) {
	  event.preventDefault();
	  var $currentToggler = event.target;
	  var $currentTogglerSiblings = this.$module.querySelectorAll('[href="' + $currentToggler.hash + '"]');
	  var $tabContainer = this.$module.querySelector($currentToggler.hash);
	  var isTabAlreadyOpen = $currentToggler.getAttribute('aria-expanded') === 'true';

	  if (isTabAlreadyOpen) {
	    $tabContainer.classList.add(tabContainerHiddenClass);
	    $tabContainer.setAttribute('aria-hidden', 'true');
	    nodeListForEach($currentTogglerSiblings, function ($tabToggler) {
	      $tabToggler.setAttribute('aria-expanded', 'false');
	      // desktop and mobile
	      $tabToggler.parentNode.classList.remove(tabsItemCurrentClass, headingItemCurrentClass);
	    });
	  } else {
	    // Reset tabs
	    this.resetTabs();
	    // make current active
	    $tabContainer.classList.remove(tabContainerHiddenClass);
	    $tabContainer.setAttribute('aria-hidden', 'false');

	    nodeListForEach($currentTogglerSiblings, function ($tabToggler) {
	      $tabToggler.setAttribute('aria-expanded', 'true');
	      if ($tabToggler.parentNode.classList.contains(tabsItemClass)) {
	        $tabToggler.parentNode.classList.add(tabsItemCurrentClass);
	      } else if ($tabToggler.parentNode.classList.contains(headingItemClass)) {
	        $tabToggler.parentNode.classList.add(headingItemCurrentClass);
	      }
	    });
	  }
	};
	// reset aria attributes to default and close the tab content container
	AppTabs.prototype.resetTabs = function () {
	  nodeListForEach(this.$allTabContainers, function ($tabContainer) {
	    // unless the tab content has not tabs and it's been set as open
	    if (!$tabContainer.classList.contains(tabContainerNoTabsJsClass)) {
	      $tabContainer.classList.add(tabContainerHiddenClass);
	      $tabContainer.setAttribute('aria-hidden', 'true');
	    }
	  });

	  nodeListForEach(this.$allTabTogglers, function ($tabToggler) {
	    $tabToggler.setAttribute('aria-expanded', 'false');
	    // desktop and mobile
	    $tabToggler.parentNode.classList.remove(tabsItemCurrentClass, headingItemCurrentClass);
	  });
	};

	// Close current container on click
	AppTabs.prototype.clickCloseContainer = function (event) {
	  event.preventDefault();
	  this.resetTabs();
	};

	AppTabs.prototype.handleClick = function (event) {
	  // toggle and active selected tab and heading (on mobile)
	  if (event.target.parentNode.classList.contains(tabsItemJsClass) ||
	    event.target.parentNode.classList.contains(headingItemJsClass)) {
	    this.activateAndToggle(event);
	  }
	};

	const toggleActiveClass = 'active';

	function SubNavToggle ($module) {
	  this.$module = $module || document;

	  this.$nav = this.$module.querySelector('.app-pane__subnav');
	  this.$navToggler = this.$module.querySelector('.app-subnav-toggle__button');

	  this.mobileNavOpen = false;

	  this.mql = null;
	}

	SubNavToggle.prototype.setHiddenStates = function () {
	  if (this.mql === null || !this.mql.matches) {
	    if (!this.mobileNavOpen) {
	      this.$nav.setAttribute('hidden', '');
	    }

	    this.$navToggler.removeAttribute('hidden');
	  } else if (this.mql === null || this.mql.matches) {
	    this.$nav.removeAttribute('hidden');
	    this.$navToggler.setAttribute('hidden', '');
	  }
	};

	SubNavToggle.prototype.setInitialAriaStates = function () {
	  this.$navToggler.setAttribute('aria-expanded', 'false');
	};

	SubNavToggle.prototype.bindUIEvents = function () {
	  var $nav = this.$nav;
	  var $navToggler = this.$navToggler;

	  $navToggler.addEventListener('click', function (event) {
	    if (this.mobileNavOpen) {
	      $navToggler.parentNode.classList.remove(toggleActiveClass);
	      $nav.setAttribute('hidden', '');

	      $navToggler.setAttribute('aria-expanded', 'false');

	      this.mobileNavOpen = false;
	    } else {
	      $navToggler.parentNode.classList.add(toggleActiveClass);
	      $nav.removeAttribute('hidden');

	      $navToggler.setAttribute('aria-expanded', 'true');

	      this.mobileNavOpen = true;
	    }
	  }.bind(this));
	};

	SubNavToggle.prototype.init = function() {
	  if (!this.$module) {
	    return
	  }

	  if (typeof window.matchMedia === 'function') {
	    this.mql = window.matchMedia('(min-width: 48.0625em)');
	    this.mql.addEventListener('change', this.setHiddenStates.bind(this));
	  }

	  this.setHiddenStates();
	  this.setInitialAriaStates();
	  this.bindUIEvents();
	};

	var clipboard = createCommonjsModule(function (module, exports) {
	/*!
	 * clipboard.js v2.0.4
	 * https://zenorocha.github.io/clipboard.js
	 * 
	 * Licensed MIT © Zeno Rocha
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory();
	})(commonjsGlobal, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId]) {
	/******/ 			return installedModules[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// define getter function for harmony exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
	/******/ 		if(!__webpack_require__.o(exports, name)) {
	/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
	/******/ 		}
	/******/ 	};
	/******/
	/******/ 	// define __esModule on exports
	/******/ 	__webpack_require__.r = function(exports) {
	/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
	/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	/******/ 		}
	/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
	/******/ 	};
	/******/
	/******/ 	// create a fake namespace object
	/******/ 	// mode & 1: value is a module id, require it
	/******/ 	// mode & 2: merge all properties of value into the ns
	/******/ 	// mode & 4: return value when already ns object
	/******/ 	// mode & 8|1: behave like require
	/******/ 	__webpack_require__.t = function(value, mode) {
	/******/ 		if(mode & 1) value = __webpack_require__(value);
	/******/ 		if(mode & 8) return value;
	/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
	/******/ 		var ns = Object.create(null);
	/******/ 		__webpack_require__.r(ns);
	/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
	/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
	/******/ 		return ns;
	/******/ 	};
	/******/
	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__webpack_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};
	/******/
	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {


	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _clipboardAction = __webpack_require__(1);

	var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

	var _tinyEmitter = __webpack_require__(3);

	var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

	var _goodListener = __webpack_require__(4);

	var _goodListener2 = _interopRequireDefault(_goodListener);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Base class which takes one or more elements, adds event listeners to them,
	 * and instantiates a new `ClipboardAction` on each click.
	 */
	var Clipboard = function (_Emitter) {
	    _inherits(Clipboard, _Emitter);

	    /**
	     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
	     * @param {Object} options
	     */
	    function Clipboard(trigger, options) {
	        _classCallCheck(this, Clipboard);

	        var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

	        _this.resolveOptions(options);
	        _this.listenClick(trigger);
	        return _this;
	    }

	    /**
	     * Defines if attributes would be resolved using internal setter functions
	     * or custom functions that were passed in the constructor.
	     * @param {Object} options
	     */


	    _createClass(Clipboard, [{
	        key: 'resolveOptions',
	        value: function resolveOptions() {
	            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	            this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
	            this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
	            this.text = typeof options.text === 'function' ? options.text : this.defaultText;
	            this.container = _typeof(options.container) === 'object' ? options.container : document.body;
	        }

	        /**
	         * Adds a click event listener to the passed trigger.
	         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
	         */

	    }, {
	        key: 'listenClick',
	        value: function listenClick(trigger) {
	            var _this2 = this;

	            this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
	                return _this2.onClick(e);
	            });
	        }

	        /**
	         * Defines a new `ClipboardAction` on each click event.
	         * @param {Event} e
	         */

	    }, {
	        key: 'onClick',
	        value: function onClick(e) {
	            var trigger = e.delegateTarget || e.currentTarget;

	            if (this.clipboardAction) {
	                this.clipboardAction = null;
	            }

	            this.clipboardAction = new _clipboardAction2.default({
	                action: this.action(trigger),
	                target: this.target(trigger),
	                text: this.text(trigger),
	                container: this.container,
	                trigger: trigger,
	                emitter: this
	            });
	        }

	        /**
	         * Default `action` lookup function.
	         * @param {Element} trigger
	         */

	    }, {
	        key: 'defaultAction',
	        value: function defaultAction(trigger) {
	            return getAttributeValue('action', trigger);
	        }

	        /**
	         * Default `target` lookup function.
	         * @param {Element} trigger
	         */

	    }, {
	        key: 'defaultTarget',
	        value: function defaultTarget(trigger) {
	            var selector = getAttributeValue('target', trigger);

	            if (selector) {
	                return document.querySelector(selector);
	            }
	        }

	        /**
	         * Returns the support of the given action, or all actions if no action is
	         * given.
	         * @param {String} [action]
	         */

	    }, {
	        key: 'defaultText',


	        /**
	         * Default `text` lookup function.
	         * @param {Element} trigger
	         */
	        value: function defaultText(trigger) {
	            return getAttributeValue('text', trigger);
	        }

	        /**
	         * Destroy lifecycle.
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.listener.destroy();

	            if (this.clipboardAction) {
	                this.clipboardAction.destroy();
	                this.clipboardAction = null;
	            }
	        }
	    }], [{
	        key: 'isSupported',
	        value: function isSupported() {
	            var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

	            var actions = typeof action === 'string' ? [action] : action;
	            var support = !!document.queryCommandSupported;

	            actions.forEach(function (action) {
	                support = support && !!document.queryCommandSupported(action);
	            });

	            return support;
	        }
	    }]);

	    return Clipboard;
	}(_tinyEmitter2.default);

	/**
	 * Helper function to retrieve attribute value.
	 * @param {String} suffix
	 * @param {Element} element
	 */


	function getAttributeValue(suffix, element) {
	    var attribute = 'data-clipboard-' + suffix;

	    if (!element.hasAttribute(attribute)) {
	        return;
	    }

	    return element.getAttribute(attribute);
	}

	module.exports = Clipboard;

	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {


	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _select = __webpack_require__(2);

	var _select2 = _interopRequireDefault(_select);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Inner class which performs selection from either `text` or `target`
	 * properties and then executes copy or cut operations.
	 */
	var ClipboardAction = function () {
	    /**
	     * @param {Object} options
	     */
	    function ClipboardAction(options) {
	        _classCallCheck(this, ClipboardAction);

	        this.resolveOptions(options);
	        this.initSelection();
	    }

	    /**
	     * Defines base properties passed from constructor.
	     * @param {Object} options
	     */


	    _createClass(ClipboardAction, [{
	        key: 'resolveOptions',
	        value: function resolveOptions() {
	            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	            this.action = options.action;
	            this.container = options.container;
	            this.emitter = options.emitter;
	            this.target = options.target;
	            this.text = options.text;
	            this.trigger = options.trigger;

	            this.selectedText = '';
	        }

	        /**
	         * Decides which selection strategy is going to be applied based
	         * on the existence of `text` and `target` properties.
	         */

	    }, {
	        key: 'initSelection',
	        value: function initSelection() {
	            if (this.text) {
	                this.selectFake();
	            } else if (this.target) {
	                this.selectTarget();
	            }
	        }

	        /**
	         * Creates a fake textarea element, sets its value from `text` property,
	         * and makes a selection on it.
	         */

	    }, {
	        key: 'selectFake',
	        value: function selectFake() {
	            var _this = this;

	            var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

	            this.removeFake();

	            this.fakeHandlerCallback = function () {
	                return _this.removeFake();
	            };
	            this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

	            this.fakeElem = document.createElement('textarea');
	            // Prevent zooming on iOS
	            this.fakeElem.style.fontSize = '12pt';
	            // Reset box model
	            this.fakeElem.style.border = '0';
	            this.fakeElem.style.padding = '0';
	            this.fakeElem.style.margin = '0';
	            // Move element out of screen horizontally
	            this.fakeElem.style.position = 'absolute';
	            this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
	            // Move element to the same position vertically
	            var yPosition = window.pageYOffset || document.documentElement.scrollTop;
	            this.fakeElem.style.top = yPosition + 'px';

	            this.fakeElem.setAttribute('readonly', '');
	            this.fakeElem.value = this.text;

	            this.container.appendChild(this.fakeElem);

	            this.selectedText = (0, _select2.default)(this.fakeElem);
	            this.copyText();
	        }

	        /**
	         * Only removes the fake element after another click event, that way
	         * a user can hit `Ctrl+C` to copy because selection still exists.
	         */

	    }, {
	        key: 'removeFake',
	        value: function removeFake() {
	            if (this.fakeHandler) {
	                this.container.removeEventListener('click', this.fakeHandlerCallback);
	                this.fakeHandler = null;
	                this.fakeHandlerCallback = null;
	            }

	            if (this.fakeElem) {
	                this.container.removeChild(this.fakeElem);
	                this.fakeElem = null;
	            }
	        }

	        /**
	         * Selects the content from element passed on `target` property.
	         */

	    }, {
	        key: 'selectTarget',
	        value: function selectTarget() {
	            this.selectedText = (0, _select2.default)(this.target);
	            this.copyText();
	        }

	        /**
	         * Executes the copy operation based on the current selection.
	         */

	    }, {
	        key: 'copyText',
	        value: function copyText() {
	            var succeeded = void 0;

	            try {
	                succeeded = document.execCommand(this.action);
	            } catch (err) {
	                succeeded = false;
	            }

	            this.handleResult(succeeded);
	        }

	        /**
	         * Fires an event based on the copy operation result.
	         * @param {Boolean} succeeded
	         */

	    }, {
	        key: 'handleResult',
	        value: function handleResult(succeeded) {
	            this.emitter.emit(succeeded ? 'success' : 'error', {
	                action: this.action,
	                text: this.selectedText,
	                trigger: this.trigger,
	                clearSelection: this.clearSelection.bind(this)
	            });
	        }

	        /**
	         * Moves focus away from `target` and back to the trigger, removes current selection.
	         */

	    }, {
	        key: 'clearSelection',
	        value: function clearSelection() {
	            if (this.trigger) {
	                this.trigger.focus();
	            }

	            window.getSelection().removeAllRanges();
	        }

	        /**
	         * Sets the `action` to be performed which can be either 'copy' or 'cut'.
	         * @param {String} action
	         */

	    }, {
	        key: 'destroy',


	        /**
	         * Destroy lifecycle.
	         */
	        value: function destroy() {
	            this.removeFake();
	        }
	    }, {
	        key: 'action',
	        set: function set() {
	            var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

	            this._action = action;

	            if (this._action !== 'copy' && this._action !== 'cut') {
	                throw new Error('Invalid "action" value, use either "copy" or "cut"');
	            }
	        }

	        /**
	         * Gets the `action` property.
	         * @return {String}
	         */
	        ,
	        get: function get() {
	            return this._action;
	        }

	        /**
	         * Sets the `target` property using an element
	         * that will be have its content copied.
	         * @param {Element} target
	         */

	    }, {
	        key: 'target',
	        set: function set(target) {
	            if (target !== undefined) {
	                if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
	                    if (this.action === 'copy' && target.hasAttribute('disabled')) {
	                        throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
	                    }

	                    if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
	                        throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
	                    }

	                    this._target = target;
	                } else {
	                    throw new Error('Invalid "target" value, use a valid Element');
	                }
	            }
	        }

	        /**
	         * Gets the `target` property.
	         * @return {String|HTMLElement}
	         */
	        ,
	        get: function get() {
	            return this._target;
	        }
	    }]);

	    return ClipboardAction;
	}();

	module.exports = ClipboardAction;

	/***/ }),
	/* 2 */
	/***/ (function(module, exports) {

	function select(element) {
	    var selectedText;

	    if (element.nodeName === 'SELECT') {
	        element.focus();

	        selectedText = element.value;
	    }
	    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
	        var isReadOnly = element.hasAttribute('readonly');

	        if (!isReadOnly) {
	            element.setAttribute('readonly', '');
	        }

	        element.select();
	        element.setSelectionRange(0, element.value.length);

	        if (!isReadOnly) {
	            element.removeAttribute('readonly');
	        }

	        selectedText = element.value;
	    }
	    else {
	        if (element.hasAttribute('contenteditable')) {
	            element.focus();
	        }

	        var selection = window.getSelection();
	        var range = document.createRange();

	        range.selectNodeContents(element);
	        selection.removeAllRanges();
	        selection.addRange(range);

	        selectedText = selection.toString();
	    }

	    return selectedText;
	}

	module.exports = select;


	/***/ }),
	/* 3 */
	/***/ (function(module, exports) {

	function E () {
	  // Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}

	E.prototype = {
	  on: function (name, callback, ctx) {
	    var e = this.e || (this.e = {});

	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });

	    return this;
	  },

	  once: function (name, callback, ctx) {
	    var self = this;
	    function listener () {
	      self.off(name, listener);
	      callback.apply(ctx, arguments);
	    }
	    listener._ = callback;
	    return this.on(name, listener, ctx);
	  },

	  emit: function (name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;

	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }

	    return this;
	  },

	  off: function (name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];

	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
	          liveEvents.push(evts[i]);
	      }
	    }

	    // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

	    (liveEvents.length)
	      ? e[name] = liveEvents
	      : delete e[name];

	    return this;
	  }
	};

	module.exports = E;


	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {

	var is = __webpack_require__(5);
	var delegate = __webpack_require__(6);

	/**
	 * Validates all params and calls the right
	 * listener function based on its target type.
	 *
	 * @param {String|HTMLElement|HTMLCollection|NodeList} target
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listen(target, type, callback) {
	    if (!target && !type && !callback) {
	        throw new Error('Missing required arguments');
	    }

	    if (!is.string(type)) {
	        throw new TypeError('Second argument must be a String');
	    }

	    if (!is.fn(callback)) {
	        throw new TypeError('Third argument must be a Function');
	    }

	    if (is.node(target)) {
	        return listenNode(target, type, callback);
	    }
	    else if (is.nodeList(target)) {
	        return listenNodeList(target, type, callback);
	    }
	    else if (is.string(target)) {
	        return listenSelector(target, type, callback);
	    }
	    else {
	        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
	    }
	}

	/**
	 * Adds an event listener to a HTML element
	 * and returns a remove listener function.
	 *
	 * @param {HTMLElement} node
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listenNode(node, type, callback) {
	    node.addEventListener(type, callback);

	    return {
	        destroy: function() {
	            node.removeEventListener(type, callback);
	        }
	    }
	}

	/**
	 * Add an event listener to a list of HTML elements
	 * and returns a remove listener function.
	 *
	 * @param {NodeList|HTMLCollection} nodeList
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listenNodeList(nodeList, type, callback) {
	    Array.prototype.forEach.call(nodeList, function(node) {
	        node.addEventListener(type, callback);
	    });

	    return {
	        destroy: function() {
	            Array.prototype.forEach.call(nodeList, function(node) {
	                node.removeEventListener(type, callback);
	            });
	        }
	    }
	}

	/**
	 * Add an event listener to a selector
	 * and returns a remove listener function.
	 *
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listenSelector(selector, type, callback) {
	    return delegate(document.body, selector, type, callback);
	}

	module.exports = listen;


	/***/ }),
	/* 5 */
	/***/ (function(module, exports) {

	/**
	 * Check if argument is a HTML element.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.node = function(value) {
	    return value !== undefined
	        && value instanceof HTMLElement
	        && value.nodeType === 1;
	};

	/**
	 * Check if argument is a list of HTML elements.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.nodeList = function(value) {
	    var type = Object.prototype.toString.call(value);

	    return value !== undefined
	        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
	        && ('length' in value)
	        && (value.length === 0 || exports.node(value[0]));
	};

	/**
	 * Check if argument is a string.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.string = function(value) {
	    return typeof value === 'string'
	        || value instanceof String;
	};

	/**
	 * Check if argument is a function.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.fn = function(value) {
	    var type = Object.prototype.toString.call(value);

	    return type === '[object Function]';
	};


	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __webpack_require__) {

	var closest = __webpack_require__(7);

	/**
	 * Delegates event to a selector.
	 *
	 * @param {Element} element
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @param {Boolean} useCapture
	 * @return {Object}
	 */
	function _delegate(element, selector, type, callback, useCapture) {
	    var listenerFn = listener.apply(this, arguments);

	    element.addEventListener(type, listenerFn, useCapture);

	    return {
	        destroy: function() {
	            element.removeEventListener(type, listenerFn, useCapture);
	        }
	    }
	}

	/**
	 * Delegates event to a selector.
	 *
	 * @param {Element|String|Array} [elements]
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @param {Boolean} useCapture
	 * @return {Object}
	 */
	function delegate(elements, selector, type, callback, useCapture) {
	    // Handle the regular Element usage
	    if (typeof elements.addEventListener === 'function') {
	        return _delegate.apply(null, arguments);
	    }

	    // Handle Element-less usage, it defaults to global delegation
	    if (typeof type === 'function') {
	        // Use `document` as the first parameter, then apply arguments
	        // This is a short way to .unshift `arguments` without running into deoptimizations
	        return _delegate.bind(null, document).apply(null, arguments);
	    }

	    // Handle Selector-based usage
	    if (typeof elements === 'string') {
	        elements = document.querySelectorAll(elements);
	    }

	    // Handle Array-like based usage
	    return Array.prototype.map.call(elements, function (element) {
	        return _delegate(element, selector, type, callback, useCapture);
	    });
	}

	/**
	 * Finds closest match and invokes callback.
	 *
	 * @param {Element} element
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Function}
	 */
	function listener(element, selector, type, callback) {
	    return function(e) {
	        e.delegateTarget = closest(e.target, selector);

	        if (e.delegateTarget) {
	            callback.call(element, e);
	        }
	    }
	}

	module.exports = delegate;


	/***/ }),
	/* 7 */
	/***/ (function(module, exports) {

	var DOCUMENT_NODE_TYPE = 9;

	/**
	 * A polyfill for Element.matches()
	 */
	if (typeof Element !== 'undefined' && !Element.prototype.matches) {
	    var proto = Element.prototype;

	    proto.matches = proto.matchesSelector ||
	                    proto.mozMatchesSelector ||
	                    proto.msMatchesSelector ||
	                    proto.oMatchesSelector ||
	                    proto.webkitMatchesSelector;
	}

	/**
	 * Finds the closest parent that matches a selector.
	 *
	 * @param {Element} element
	 * @param {String} selector
	 * @return {Function}
	 */
	function closest (element, selector) {
	    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
	        if (typeof element.matches === 'function' &&
	            element.matches(selector)) {
	          return element;
	        }
	        element = element.parentNode;
	    }
	}

	module.exports = closest;


	/***/ })
	/******/ ]);
	});
	});

	var ClipboardJS = unwrapExports(clipboard);

	function CopyToClipboard ($module) {
	  this.$module = $module;
	}

	CopyToClipboard.prototype.init = function () {
	  if (!this.$module) {
	    return
	  }
	  var $button = document.createElement('button');
	  $button.className = 'app-copy-button js-copy-button';
	  $button.setAttribute('aria-live', 'assertive');
	  $button.textContent = 'Copy';

	  this.$module.insertBefore($button, this.$module.firstChild);
	  this.copyAction();
	};

	CopyToClipboard.prototype.copyAction = function () {
	  try {
	    new ClipboardJS('.js-copy-button', {
	      target: trigger => trigger.nextElementSibling
	    }).on('success', function (e) {
	      e.trigger.textContent = 'Copied';
	      e.clearSelection();
	      setTimeout(() => {
	        e.trigger.textContent = 'Copy';
	      }, 5000);
	    });
	  } catch (err) {
	    if (err) {
	      console.error(err.message);
	    }
	  }
	};

	var linkLocator = '.govuk-link[href^="#"]';
	var sectionButtonLocator = '.govuk-accordion__section-button';

	function Accordion ($module) {
	  this.$module = $module;
	  this.$allAnchorLinks = this.$module.querySelectorAll(linkLocator);
	  this.$allSectionButtons = this.$module.querySelectorAll(sectionButtonLocator);
	  this.$mappedSectionButtons = {};
	}

	Accordion.prototype.init = function () {
	  if (!this.$module) {
	    return
	  }
	  this.$allAnchorLinks.forEach(this.attachClick.bind(this));
	  var self = this;
	  this.$allSectionButtons.forEach(function (button) {
	    self.$mappedSectionButtons[button.textContent.trim().toLowerCase()] = button.id;
	  });
	};

	Accordion.prototype.attachClick = function (link) {
	  link.addEventListener('click', this.handleClick.bind(this));
	};

	Accordion.prototype.handleClick = function (evt) {
	  var section = evt.target.hash[1].trim().toLowerCase();
	  var button = this.$module.querySelector('#' + this.$mappedSectionButtons[section]);
	  if (button.getAttribute('aria-expanded') !== 'true') {
	    button.click();
	  }
	};

	function PrintLink ($module) {
	  this.$module = $module;
	}

	PrintLink.prototype.init = function() {
	  if (!this.$module) {
	    return
	  }
	  this.$module.addEventListener('click', function () {
	    window.print();
	  });

	};

	// Taken from https://github.com/alphagov/govuk-design-system/blob/29b9cf8c30ac1514d16fc97adaf15100e5040f7d/src/javascripts/components/tabs.js

	var nodeListForEach$1 = common.nodeListForEach;

	function LanguageSwitchExample ($module) {
	  this.$module = $module;
	  this.$switches = this.$module.querySelectorAll('.app-example__language-switch a');
	  this.$iframe = this.$module.querySelector('[data-module~="app-example-frame"]');
	  this.currentClassName = 'app-example__language-switch--current';
	  this.getLanguageClass = function (lang) {
	    return ['app-example__language-switch--', lang, '-activated'].join('')
	  };
	}

	LanguageSwitchExample.prototype.init = function () {
	  var self = this;

	  if (!this.$module) {
	    return
	  }

	  nodeListForEach$1(this.$switches, function ($this) {
	    $this.addEventListener('click', self.handleClick.bind(self));
	  });
	};

	// Close current container on click
	LanguageSwitchExample.prototype.handleClick = function (event) {
	  var self = this;
	  event.preventDefault();
	  var $target = event.target;
	  nodeListForEach$1(this.$module.querySelectorAll('.' + this.currentClassName), function ($option) {
	    $option.classList.remove(self.currentClassName);
	    $option.querySelector('a').focus();
	  });
	  this.$iframe.setAttribute('src', $target.getAttribute('href'));
	  $target.parentNode.classList.add(this.currentClassName);
	  this.$module.classList.remove(this.getLanguageClass('en'), this.getLanguageClass('cy'));
	  this.$module.classList.add(this.getLanguageClass($target.getAttribute('data-lang')));
	};

	var iframeResizer = createCommonjsModule(function (module) {
	(function(undefined) {
	  if (typeof window === 'undefined') return // don't run for server side render

	  var count = 0,
	    logEnabled = false,
	    hiddenCheckEnabled = false,
	    msgHeader = 'message',
	    msgHeaderLen = msgHeader.length,
	    msgId = '[iFrameSizer]', // Must match iframe msg ID
	    msgIdLen = msgId.length,
	    pagePosition = null,
	    requestAnimationFrame = window.requestAnimationFrame,
	    resetRequiredMethods = {
	      max: 1,
	      scroll: 1,
	      bodyScroll: 1,
	      documentElementScroll: 1
	    },
	    settings = {},
	    timer = null,
	    defaults = {
	      autoResize: true,
	      bodyBackground: null,
	      bodyMargin: null,
	      bodyMarginV1: 8,
	      bodyPadding: null,
	      checkOrigin: true,
	      inPageLinks: false,
	      enablePublicMethods: true,
	      heightCalculationMethod: 'bodyOffset',
	      id: 'iFrameResizer',
	      interval: 32,
	      log: false,
	      maxHeight: Infinity,
	      maxWidth: Infinity,
	      minHeight: 0,
	      minWidth: 0,
	      resizeFrom: 'parent',
	      scrolling: false,
	      sizeHeight: true,
	      sizeWidth: false,
	      warningTimeout: 5000,
	      tolerance: 0,
	      widthCalculationMethod: 'scroll',
	      onClose: function() {
	        return true
	      },
	      onClosed: function() {},
	      onInit: function() {},
	      onMessage: function() {
	        warn('onMessage function not defined');
	      },
	      onResized: function() {},
	      onScroll: function() {
	        return true
	      }
	    };

	  function getMutationObserver() {
	    return (
	      window.MutationObserver ||
	      window.WebKitMutationObserver ||
	      window.MozMutationObserver
	    )
	  }

	  function addEventListener(el, evt, func) {
	    el.addEventListener(evt, func, false);
	  }

	  function removeEventListener(el, evt, func) {
	    el.removeEventListener(evt, func, false);
	  }

	  function setupRequestAnimationFrame() {
	    var vendors = ['moz', 'webkit', 'o', 'ms'];
	    var x;

	    // Remove vendor prefixing if prefixed and break early if not
	    for (x = 0; x < vendors.length && !requestAnimationFrame; x += 1) {
	      requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	    }

	    if (!requestAnimationFrame) {
	      log('setup', 'RequestAnimationFrame not supported');
	    }
	  }

	  function getMyID(iframeId) {
	    var retStr = 'Host page: ' + iframeId;

	    if (window.top !== window.self) {
	      if (window.parentIFrame && window.parentIFrame.getId) {
	        retStr = window.parentIFrame.getId() + ': ' + iframeId;
	      } else {
	        retStr = 'Nested host page: ' + iframeId;
	      }
	    }

	    return retStr
	  }

	  function formatLogHeader(iframeId) {
	    return msgId + '[' + getMyID(iframeId) + ']'
	  }

	  function isLogEnabled(iframeId) {
	    return settings[iframeId] ? settings[iframeId].log : logEnabled
	  }

	  function log(iframeId, msg) {
	    output('log', iframeId, msg, isLogEnabled(iframeId));
	  }

	  function info(iframeId, msg) {
	    output('info', iframeId, msg, isLogEnabled(iframeId));
	  }

	  function warn(iframeId, msg) {
	    output('warn', iframeId, msg, true);
	  }

	  function output(type, iframeId, msg, enabled) {
	    if (true === enabled && 'object' === typeof window.console) {
	      // eslint-disable-next-line no-console
	      console[type](formatLogHeader(iframeId), msg);
	    }
	  }

	  function iFrameListener(event) {
	    function resizeIFrame() {
	      function resize() {
	        setSize(messageData);
	        setPagePosition(iframeId);
	        on('onResized', messageData);
	      }

	      ensureInRange('Height');
	      ensureInRange('Width');

	      syncResize(resize, messageData, 'init');
	    }

	    function processMsg() {
	      var data = msg.substr(msgIdLen).split(':');

	      return {
	        iframe: settings[data[0]] && settings[data[0]].iframe,
	        id: data[0],
	        height: data[1],
	        width: data[2],
	        type: data[3]
	      }
	    }

	    function ensureInRange(Dimension) {
	      var max = Number(settings[iframeId]['max' + Dimension]),
	        min = Number(settings[iframeId]['min' + Dimension]),
	        dimension = Dimension.toLowerCase(),
	        size = Number(messageData[dimension]);

	      log(iframeId, 'Checking ' + dimension + ' is in range ' + min + '-' + max);

	      if (size < min) {
	        size = min;
	        log(iframeId, 'Set ' + dimension + ' to min value');
	      }

	      if (size > max) {
	        size = max;
	        log(iframeId, 'Set ' + dimension + ' to max value');
	      }

	      messageData[dimension] = '' + size;
	    }

	    function isMessageFromIFrame() {
	      function checkAllowedOrigin() {
	        function checkList() {
	          var i = 0,
	            retCode = false;

	          log(
	            iframeId,
	            'Checking connection is from allowed list of origins: ' +
	              checkOrigin
	          );

	          for (; i < checkOrigin.length; i++) {
	            if (checkOrigin[i] === origin) {
	              retCode = true;
	              break
	            }
	          }
	          return retCode
	        }

	        function checkSingle() {
	          var remoteHost = settings[iframeId] && settings[iframeId].remoteHost;
	          log(iframeId, 'Checking connection is from: ' + remoteHost);
	          return origin === remoteHost
	        }

	        return checkOrigin.constructor === Array ? checkList() : checkSingle()
	      }

	      var origin = event.origin,
	        checkOrigin = settings[iframeId] && settings[iframeId].checkOrigin;

	      if (checkOrigin && '' + origin !== 'null' && !checkAllowedOrigin()) {
	        throw new Error(
	          'Unexpected message received from: ' +
	            origin +
	            ' for ' +
	            messageData.iframe.id +
	            '. Message was: ' +
	            event.data +
	            '. This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.'
	        )
	      }

	      return true
	    }

	    function isMessageForUs() {
	      return (
	        msgId === ('' + msg).substr(0, msgIdLen) &&
	        msg.substr(msgIdLen).split(':')[0] in settings
	      ) // ''+Protects against non-string msg
	    }

	    function isMessageFromMetaParent() {
	      // Test if this message is from a parent above us. This is an ugly test, however, updating
	      // the message format would break backwards compatibity.
	      var retCode = messageData.type in { true: 1, false: 1, undefined: 1 };

	      if (retCode) {
	        log(iframeId, 'Ignoring init message from meta parent page');
	      }

	      return retCode
	    }

	    function getMsgBody(offset) {
	      return msg.substr(msg.indexOf(':') + msgHeaderLen + offset)
	    }

	    function forwardMsgFromIFrame(msgBody) {
	      log(
	        iframeId,
	        'onMessage passed: {iframe: ' +
	          messageData.iframe.id +
	          ', message: ' +
	          msgBody +
	          '}'
	      );
	      on('onMessage', {
	        iframe: messageData.iframe,
	        message: JSON.parse(msgBody)
	      });
	      log(iframeId, '--');
	    }

	    function getPageInfo() {
	      var bodyPosition = document.body.getBoundingClientRect(),
	        iFramePosition = messageData.iframe.getBoundingClientRect();

	      return JSON.stringify({
	        iframeHeight: iFramePosition.height,
	        iframeWidth: iFramePosition.width,
	        clientHeight: Math.max(
	          document.documentElement.clientHeight,
	          window.innerHeight || 0
	        ),
	        clientWidth: Math.max(
	          document.documentElement.clientWidth,
	          window.innerWidth || 0
	        ),
	        offsetTop: parseInt(iFramePosition.top - bodyPosition.top, 10),
	        offsetLeft: parseInt(iFramePosition.left - bodyPosition.left, 10),
	        scrollTop: window.pageYOffset,
	        scrollLeft: window.pageXOffset,
	        documentHeight: document.documentElement.clientHeight,
	        documentWidth: document.documentElement.clientWidth,
	        windowHeight: window.innerHeight,
	        windowWidth: window.innerWidth
	      })
	    }

	    function sendPageInfoToIframe(iframe, iframeId) {
	      function debouncedTrigger() {
	        trigger('Send Page Info', 'pageInfo:' + getPageInfo(), iframe, iframeId);
	      }
	      debounceFrameEvents(debouncedTrigger, 32, iframeId);
	    }

	    function startPageInfoMonitor() {
	      function setListener(type, func) {
	        function sendPageInfo() {
	          if (settings[id]) {
	            sendPageInfoToIframe(settings[id].iframe, id);
	          } else {
	            stop();
	          }
	        }
	['scroll', 'resize'].forEach(function(evt) {
	          log(id, type + evt + ' listener for sendPageInfo');
	          func(window, evt, sendPageInfo);
	        });
	      }

	      function stop() {
	        setListener('Remove ', removeEventListener);
	      }

	      function start() {
	        setListener('Add ', addEventListener);
	      }

	      var id = iframeId; // Create locally scoped copy of iFrame ID

	      start();

	      if (settings[id]) {
	        settings[id].stopPageInfo = stop;
	      }
	    }

	    function stopPageInfoMonitor() {
	      if (settings[iframeId] && settings[iframeId].stopPageInfo) {
	        settings[iframeId].stopPageInfo();
	        delete settings[iframeId].stopPageInfo;
	      }
	    }

	    function checkIFrameExists() {
	      var retBool = true;

	      if (null === messageData.iframe) {
	        warn(iframeId, 'IFrame (' + messageData.id + ') not found');
	        retBool = false;
	      }
	      return retBool
	    }

	    function getElementPosition(target) {
	      var iFramePosition = target.getBoundingClientRect();

	      getPagePosition(iframeId);

	      return {
	        x: Math.floor(Number(iFramePosition.left) + Number(pagePosition.x)),
	        y: Math.floor(Number(iFramePosition.top) + Number(pagePosition.y))
	      }
	    }

	    function scrollRequestFromChild(addOffset) {
	      /* istanbul ignore next */ // Not testable in Karma
	      function reposition() {
	        pagePosition = newPosition;
	        scrollTo();
	        log(iframeId, '--');
	      }

	      function calcOffset() {
	        return {
	          x: Number(messageData.width) + offset.x,
	          y: Number(messageData.height) + offset.y
	        }
	      }

	      function scrollParent() {
	        if (window.parentIFrame) {
	          window.parentIFrame['scrollTo' + (addOffset ? 'Offset' : '')](
	            newPosition.x,
	            newPosition.y
	          );
	        } else {
	          warn(
	            iframeId,
	            'Unable to scroll to requested position, window.parentIFrame not found'
	          );
	        }
	      }

	      var offset = addOffset
	          ? getElementPosition(messageData.iframe)
	          : { x: 0, y: 0 },
	        newPosition = calcOffset();

	      log(
	        iframeId,
	        'Reposition requested from iFrame (offset x:' +
	          offset.x +
	          ' y:' +
	          offset.y +
	          ')'
	      );

	      if (window.top !== window.self) {
	        scrollParent();
	      } else {
	        reposition();
	      }
	    }

	    function scrollTo() {
	      if (false !== on('onScroll', pagePosition)) {
	        setPagePosition(iframeId);
	      } else {
	        unsetPagePosition();
	      }
	    }

	    function findTarget(location) {
	      function jumpToTarget() {
	        var jumpPosition = getElementPosition(target);

	        log(
	          iframeId,
	          'Moving to in page link (#' +
	            hash +
	            ') at x: ' +
	            jumpPosition.x +
	            ' y: ' +
	            jumpPosition.y
	        );
	        pagePosition = {
	          x: jumpPosition.x,
	          y: jumpPosition.y
	        };

	        scrollTo();
	        log(iframeId, '--');
	      }

	      function jumpToParent() {
	        if (window.parentIFrame) {
	          window.parentIFrame.moveToAnchor(hash);
	        } else {
	          log(
	            iframeId,
	            'In page link #' +
	              hash +
	              ' not found and window.parentIFrame not found'
	          );
	        }
	      }

	      var hash = location.split('#')[1] || '',
	        hashData = decodeURIComponent(hash),
	        target =
	          document.getElementById(hashData) ||
	          document.getElementsByName(hashData)[0];

	      if (target) {
	        jumpToTarget();
	      } else if (window.top !== window.self) {
	        jumpToParent();
	      } else {
	        log(iframeId, 'In page link #' + hash + ' not found');
	      }
	    }

	    function on(funcName, val) {
	      return chkEvent(iframeId, funcName, val)
	    }

	    function actionMsg() {
	      if (settings[iframeId] && settings[iframeId].firstRun) firstRun();

	      switch (messageData.type) {
	        case 'close':
	          closeIFrame(messageData.iframe);
	          break

	        case 'message':
	          forwardMsgFromIFrame(getMsgBody(6));
	          break

	        case 'autoResize':
	          settings[iframeId].autoResize = JSON.parse(getMsgBody(9));
	          break

	        case 'scrollTo':
	          scrollRequestFromChild(false);
	          break

	        case 'scrollToOffset':
	          scrollRequestFromChild(true);
	          break

	        case 'pageInfo':
	          sendPageInfoToIframe(
	            settings[iframeId] && settings[iframeId].iframe,
	            iframeId
	          );
	          startPageInfoMonitor();
	          break

	        case 'pageInfoStop':
	          stopPageInfoMonitor();
	          break

	        case 'inPageLink':
	          findTarget(getMsgBody(9));
	          break

	        case 'reset':
	          resetIFrame(messageData);
	          break

	        case 'init':
	          resizeIFrame();
	          on('onInit', messageData.iframe);
	          break

	        default:
	          resizeIFrame();
	      }
	    }

	    function hasSettings(iframeId) {
	      var retBool = true;

	      if (!settings[iframeId]) {
	        retBool = false;
	        warn(
	          messageData.type +
	            ' No settings for ' +
	            iframeId +
	            '. Message was: ' +
	            msg
	        );
	      }

	      return retBool
	    }

	    function iFrameReadyMsgReceived() {
	      // eslint-disable-next-line no-restricted-syntax, guard-for-in
	      for (var iframeId in settings) {
	        trigger(
	          'iFrame requested init',
	          createOutgoingMsg(iframeId),
	          document.getElementById(iframeId),
	          iframeId
	        );
	      }
	    }

	    function firstRun() {
	      if (settings[iframeId]) {
	        settings[iframeId].firstRun = false;
	      }
	    }

	    var msg = event.data,
	      messageData = {},
	      iframeId = null;

	    if ('[iFrameResizerChild]Ready' === msg) {
	      iFrameReadyMsgReceived();
	    } else if (isMessageForUs()) {
	      messageData = processMsg();
	      iframeId = messageData.id;
	      if (settings[iframeId]) {
	        settings[iframeId].loaded = true;
	      }

	      if (!isMessageFromMetaParent() && hasSettings(iframeId)) {
	        log(iframeId, 'Received: ' + msg);

	        if (checkIFrameExists() && isMessageFromIFrame()) {
	          actionMsg();
	        }
	      }
	    } else {
	      info(iframeId, 'Ignored: ' + msg);
	    }
	  }

	  function chkEvent(iframeId, funcName, val) {
	    var func = null,
	      retVal = null;

	    if (settings[iframeId]) {
	      func = settings[iframeId][funcName];

	      if ('function' === typeof func) {
	        retVal = func(val);
	      } else {
	        throw new TypeError(
	          funcName + ' on iFrame[' + iframeId + '] is not a function'
	        )
	      }
	    }

	    return retVal
	  }

	  function removeIframeListeners(iframe) {
	    var iframeId = iframe.id;
	    delete settings[iframeId];
	  }

	  function closeIFrame(iframe) {
	    var iframeId = iframe.id;
	    if (chkEvent(iframeId, 'onClose', iframeId) === false) {
	      log(iframeId, 'Close iframe cancelled by onClose event');
	      return
	    }
	    log(iframeId, 'Removing iFrame: ' + iframeId);

	    try {
	      // Catch race condition error with React
	      if (iframe.parentNode) {
	        iframe.parentNode.removeChild(iframe);
	      }
	    } catch (error) {
	      warn(error);
	    }

	    chkEvent(iframeId, 'onClosed', iframeId);
	    log(iframeId, '--');
	    removeIframeListeners(iframe);
	  }

	  function getPagePosition(iframeId) {
	    if (null === pagePosition) {
	      pagePosition = {
	        x:
	          window.pageXOffset !== undefined
	            ? window.pageXOffset
	            : document.documentElement.scrollLeft,
	        y:
	          window.pageYOffset !== undefined
	            ? window.pageYOffset
	            : document.documentElement.scrollTop
	      };
	      log(
	        iframeId,
	        'Get page position: ' + pagePosition.x + ',' + pagePosition.y
	      );
	    }
	  }

	  function setPagePosition(iframeId) {
	    if (null !== pagePosition) {
	      window.scrollTo(pagePosition.x, pagePosition.y);
	      log(
	        iframeId,
	        'Set page position: ' + pagePosition.x + ',' + pagePosition.y
	      );
	      unsetPagePosition();
	    }
	  }

	  function unsetPagePosition() {
	    pagePosition = null;
	  }

	  function resetIFrame(messageData) {
	    function reset() {
	      setSize(messageData);
	      trigger('reset', 'reset', messageData.iframe, messageData.id);
	    }

	    log(
	      messageData.id,
	      'Size reset requested by ' +
	        ('init' === messageData.type ? 'host page' : 'iFrame')
	    );
	    getPagePosition(messageData.id);
	    syncResize(reset, messageData, 'reset');
	  }

	  function setSize(messageData) {
	    function setDimension(dimension) {
	      if (!messageData.id) {
	        log('undefined', 'messageData id not set');
	        return
	      }
	      messageData.iframe.style[dimension] = messageData[dimension] + 'px';
	      log(
	        messageData.id,
	        'IFrame (' +
	          iframeId +
	          ') ' +
	          dimension +
	          ' set to ' +
	          messageData[dimension] +
	          'px'
	      );
	    }

	    function chkZero(dimension) {
	      // FireFox sets dimension of hidden iFrames to zero.
	      // So if we detect that set up an event to check for
	      // when iFrame becomes visible.

	      /* istanbul ignore next */ // Not testable in PhantomJS
	      if (!hiddenCheckEnabled && '0' === messageData[dimension]) {
	        hiddenCheckEnabled = true;
	        log(iframeId, 'Hidden iFrame detected, creating visibility listener');
	        fixHiddenIFrames();
	      }
	    }

	    function processDimension(dimension) {
	      setDimension(dimension);
	      chkZero(dimension);
	    }

	    var iframeId = messageData.iframe.id;

	    if (settings[iframeId]) {
	      if (settings[iframeId].sizeHeight) {
	        processDimension('height');
	      }
	      if (settings[iframeId].sizeWidth) {
	        processDimension('width');
	      }
	    }
	  }

	  function syncResize(func, messageData, doNotSync) {
	    /* istanbul ignore if */ // Not testable in PhantomJS
	    if (doNotSync !== messageData.type && requestAnimationFrame) {
	      log(messageData.id, 'Requesting animation frame');
	      requestAnimationFrame(func);
	    } else {
	      func();
	    }
	  }

	  function trigger(calleeMsg, msg, iframe, id, noResponseWarning) {
	    function postMessageToIFrame() {
	      var target = settings[id] && settings[id].targetOrigin;
	      log(
	        id,
	        '[' +
	          calleeMsg +
	          '] Sending msg to iframe[' +
	          id +
	          '] (' +
	          msg +
	          ') targetOrigin: ' +
	          target
	      );
	      iframe.contentWindow.postMessage(msgId + msg, target);
	    }

	    function iFrameNotFound() {
	      warn(id, '[' + calleeMsg + '] IFrame(' + id + ') not found');
	    }

	    function chkAndSend() {
	      if (
	        iframe &&
	        'contentWindow' in iframe &&
	        null !== iframe.contentWindow
	      ) {
	        // Null test for PhantomJS
	        postMessageToIFrame();
	      } else {
	        iFrameNotFound();
	      }
	    }

	    function warnOnNoResponse() {
	      function warning() {
	        if (settings[id] && !settings[id].loaded && !errorShown) {
	          errorShown = true;
	          warn(
	            id,
	            'IFrame has not responded within ' +
	              settings[id].warningTimeout / 1000 +
	              ' seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning.'
	          );
	        }
	      }

	      if (
	        !!noResponseWarning &&
	        settings[id] &&
	        !!settings[id].warningTimeout
	      ) {
	        settings[id].msgTimeout = setTimeout(
	          warning,
	          settings[id].warningTimeout
	        );
	      }
	    }

	    var errorShown = false;

	    id = id || iframe.id;

	    if (settings[id]) {
	      chkAndSend();
	      warnOnNoResponse();
	    }
	  }

	  function createOutgoingMsg(iframeId) {
	    return (
	      iframeId +
	      ':' +
	      settings[iframeId].bodyMarginV1 +
	      ':' +
	      settings[iframeId].sizeWidth +
	      ':' +
	      settings[iframeId].log +
	      ':' +
	      settings[iframeId].interval +
	      ':' +
	      settings[iframeId].enablePublicMethods +
	      ':' +
	      settings[iframeId].autoResize +
	      ':' +
	      settings[iframeId].bodyMargin +
	      ':' +
	      settings[iframeId].heightCalculationMethod +
	      ':' +
	      settings[iframeId].bodyBackground +
	      ':' +
	      settings[iframeId].bodyPadding +
	      ':' +
	      settings[iframeId].tolerance +
	      ':' +
	      settings[iframeId].inPageLinks +
	      ':' +
	      settings[iframeId].resizeFrom +
	      ':' +
	      settings[iframeId].widthCalculationMethod
	    )
	  }

	  function setupIFrame(iframe, options) {
	    function setLimits() {
	      function addStyle(style) {
	        if (
	          Infinity !== settings[iframeId][style] &&
	          0 !== settings[iframeId][style]
	        ) {
	          iframe.style[style] = settings[iframeId][style] + 'px';
	          log(
	            iframeId,
	            'Set ' + style + ' = ' + settings[iframeId][style] + 'px'
	          );
	        }
	      }

	      function chkMinMax(dimension) {
	        if (
	          settings[iframeId]['min' + dimension] >
	          settings[iframeId]['max' + dimension]
	        ) {
	          throw new Error(
	            'Value for min' +
	              dimension +
	              ' can not be greater than max' +
	              dimension
	          )
	        }
	      }

	      chkMinMax('Height');
	      chkMinMax('Width');

	      addStyle('maxHeight');
	      addStyle('minHeight');
	      addStyle('maxWidth');
	      addStyle('minWidth');
	    }

	    function newId() {
	      var id = (options && options.id) || defaults.id + count++;
	      if (null !== document.getElementById(id)) {
	        id += count++;
	      }
	      return id
	    }

	    function ensureHasId(iframeId) {
	      if ('' === iframeId) {
	        // eslint-disable-next-line no-multi-assign
	        iframe.id = iframeId = newId();
	        logEnabled = (options || {}).log;
	        log(
	          iframeId,
	          'Added missing iframe ID: ' + iframeId + ' (' + iframe.src + ')'
	        );
	      }

	      return iframeId
	    }

	    function setScrolling() {
	      log(
	        iframeId,
	        'IFrame scrolling ' +
	          (settings[iframeId] && settings[iframeId].scrolling
	            ? 'enabled'
	            : 'disabled') +
	          ' for ' +
	          iframeId
	      );
	      iframe.style.overflow =
	        false === (settings[iframeId] && settings[iframeId].scrolling)
	          ? 'hidden'
	          : 'auto';
	      switch (settings[iframeId] && settings[iframeId].scrolling) {
	        case 'omit':
	          break

	        case true:
	          iframe.scrolling = 'yes';
	          break

	        case false:
	          iframe.scrolling = 'no';
	          break

	        default:
	          iframe.scrolling = settings[iframeId]
	            ? settings[iframeId].scrolling
	            : 'no';
	      }
	    }

	    // The V1 iFrame script expects an int, where as in V2 expects a CSS
	    // string value such as '1px 3em', so if we have an int for V2, set V1=V2
	    // and then convert V2 to a string PX value.
	    function setupBodyMarginValues() {
	      if (
	        'number' ===
	          typeof (settings[iframeId] && settings[iframeId].bodyMargin) ||
	        '0' === (settings[iframeId] && settings[iframeId].bodyMargin)
	      ) {
	        settings[iframeId].bodyMarginV1 = settings[iframeId].bodyMargin;
	        settings[iframeId].bodyMargin =
	          '' + settings[iframeId].bodyMargin + 'px';
	      }
	    }

	    function checkReset() {
	      // Reduce scope of firstRun to function, because IE8's JS execution
	      // context stack is borked and this value gets externally
	      // changed midway through running this function!!!
	      var firstRun = settings[iframeId] && settings[iframeId].firstRun,
	        resetRequertMethod =
	          settings[iframeId] &&
	          settings[iframeId].heightCalculationMethod in resetRequiredMethods;

	      if (!firstRun && resetRequertMethod) {
	        resetIFrame({ iframe: iframe, height: 0, width: 0, type: 'init' });
	      }
	    }

	    function setupIFrameObject() {
	      if (settings[iframeId]) {
	        settings[iframeId].iframe.iFrameResizer = {
	          close: closeIFrame.bind(null, settings[iframeId].iframe),

	          removeListeners: removeIframeListeners.bind(
	            null,
	            settings[iframeId].iframe
	          ),

	          resize: trigger.bind(
	            null,
	            'Window resize',
	            'resize',
	            settings[iframeId].iframe
	          ),

	          moveToAnchor: function(anchor) {
	            trigger(
	              'Move to anchor',
	              'moveToAnchor:' + anchor,
	              settings[iframeId].iframe,
	              iframeId
	            );
	          },

	          sendMessage: function(message) {
	            message = JSON.stringify(message);
	            trigger(
	              'Send Message',
	              'message:' + message,
	              settings[iframeId].iframe,
	              iframeId
	            );
	          }
	        };
	      }
	    }

	    // We have to call trigger twice, as we can not be sure if all
	    // iframes have completed loading when this code runs. The
	    // event listener also catches the page changing in the iFrame.
	    function init(msg) {
	      function iFrameLoaded() {
	        trigger('iFrame.onload', msg, iframe, undefined, true);
	        checkReset();
	      }

	      function createDestroyObserver(MutationObserver) {
	        if (!iframe.parentNode) {
	          return
	        }

	        var destroyObserver = new MutationObserver(function(mutations) {
	          mutations.forEach(function(mutation) {
	            var removedNodes = Array.prototype.slice.call(mutation.removedNodes); // Transform NodeList into an Array
	            removedNodes.forEach(function(removedNode) {
	              if (removedNode === iframe) {
	                closeIFrame(iframe);
	              }
	            });
	          });
	        });
	        destroyObserver.observe(iframe.parentNode, {
	          childList: true
	        });
	      }

	      var MutationObserver = getMutationObserver();
	      if (MutationObserver) {
	        createDestroyObserver(MutationObserver);
	      }

	      addEventListener(iframe, 'load', iFrameLoaded);
	      trigger('init', msg, iframe, undefined, true);
	    }

	    function checkOptions(options) {
	      if ('object' !== typeof options) {
	        throw new TypeError('Options is not an object')
	      }
	    }

	    function copyOptions(options) {
	      // eslint-disable-next-line no-restricted-syntax
	      for (var option in defaults) {
	        if (Object.prototype.hasOwnProperty.call(defaults, option)) {
	          settings[iframeId][option] = Object.prototype.hasOwnProperty.call(
	            options,
	            option
	          )
	            ? options[option]
	            : defaults[option];
	        }
	      }
	    }

	    function getTargetOrigin(remoteHost) {
	      return '' === remoteHost || 'file://' === remoteHost ? '*' : remoteHost
	    }

	    function depricate(key) {
	      var splitName = key.split('Callback');

	      if (splitName.length === 2) {
	        var name =
	          'on' + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
	        this[name] = this[key];
	        delete this[key];
	        warn(
	          iframeId,
	          "Deprecated: '" +
	            key +
	            "' has been renamed '" +
	            name +
	            "'. The old method will be removed in the next major version."
	        );
	      }
	    }

	    function processOptions(options) {
	      options = options || {};
	      settings[iframeId] = {
	        firstRun: true,
	        iframe: iframe,
	        remoteHost:
	          iframe.src &&
	          iframe.src
	            .split('/')
	            .slice(0, 3)
	            .join('/')
	      };

	      checkOptions(options);
	      Object.keys(options).forEach(depricate, options);
	      copyOptions(options);

	      if (settings[iframeId]) {
	        settings[iframeId].targetOrigin =
	          true === settings[iframeId].checkOrigin
	            ? getTargetOrigin(settings[iframeId].remoteHost)
	            : '*';
	      }
	    }

	    function beenHere() {
	      return iframeId in settings && 'iFrameResizer' in iframe
	    }

	    var iframeId = ensureHasId(iframe.id);

	    if (!beenHere()) {
	      processOptions(options);
	      setScrolling();
	      setLimits();
	      setupBodyMarginValues();
	      init(createOutgoingMsg(iframeId));
	      setupIFrameObject();
	    } else {
	      warn(iframeId, 'Ignored iFrame, already setup.');
	    }
	  }

	  function debouce(fn, time) {
	    if (null === timer) {
	      timer = setTimeout(function() {
	        timer = null;
	        fn();
	      }, time);
	    }
	  }

	  var frameTimer = {};
	  function debounceFrameEvents(fn, time, frameId) {
	    if (!frameTimer[frameId]) {
	      frameTimer[frameId] = setTimeout(function() {
	        frameTimer[frameId] = null;
	        fn();
	      }, time);
	    }
	  }

	  // Not testable in PhantomJS
	  /* istanbul ignore next */

	  function fixHiddenIFrames() {
	    function checkIFrames() {
	      function checkIFrame(settingId) {
	        function chkDimension(dimension) {
	          return (
	            '0px' ===
	            (settings[settingId] && settings[settingId].iframe.style[dimension])
	          )
	        }

	        function isVisible(el) {
	          return null !== el.offsetParent
	        }

	        if (
	          settings[settingId] &&
	          isVisible(settings[settingId].iframe) &&
	          (chkDimension('height') || chkDimension('width'))
	        ) {
	          trigger(
	            'Visibility change',
	            'resize',
	            settings[settingId].iframe,
	            settingId
	          );
	        }
	      }

	      Object.keys(settings).forEach(function(key) {
	        checkIFrame(settings[key]);
	      });
	    }

	    function mutationObserved(mutations) {
	      log(
	        'window',
	        'Mutation observed: ' + mutations[0].target + ' ' + mutations[0].type
	      );
	      debouce(checkIFrames, 16);
	    }

	    function createMutationObserver() {
	      var target = document.querySelector('body'),
	        config = {
	          attributes: true,
	          attributeOldValue: false,
	          characterData: true,
	          characterDataOldValue: false,
	          childList: true,
	          subtree: true
	        },
	        observer = new MutationObserver(mutationObserved);

	      observer.observe(target, config);
	    }

	    var MutationObserver = getMutationObserver();
	    if (MutationObserver) {
	      createMutationObserver();
	    }
	  }

	  function resizeIFrames(event) {
	    function resize() {
	      sendTriggerMsg('Window ' + event, 'resize');
	    }

	    log('window', 'Trigger event: ' + event);
	    debouce(resize, 16);
	  }

	  // Not testable in PhantomJS
	  /* istanbul ignore next */
	  function tabVisible() {
	    function resize() {
	      sendTriggerMsg('Tab Visable', 'resize');
	    }

	    if ('hidden' !== document.visibilityState) {
	      log('document', 'Trigger event: Visiblity change');
	      debouce(resize, 16);
	    }
	  }

	  function sendTriggerMsg(eventName, event) {
	    function isIFrameResizeEnabled(iframeId) {
	      return (
	        settings[iframeId] &&
	        'parent' === settings[iframeId].resizeFrom &&
	        settings[iframeId].autoResize &&
	        !settings[iframeId].firstRun
	      )
	    }

	    Object.keys(settings).forEach(function(iframeId) {
	      if (isIFrameResizeEnabled(iframeId)) {
	        trigger(eventName, event, document.getElementById(iframeId), iframeId);
	      }
	    });
	  }

	  function setupEventListeners() {
	    addEventListener(window, 'message', iFrameListener);

	    addEventListener(window, 'resize', function() {
	      resizeIFrames('resize');
	    });

	    addEventListener(document, 'visibilitychange', tabVisible);

	    addEventListener(document, '-webkit-visibilitychange', tabVisible);
	  }

	  function factory() {
	    function init(options, element) {
	      function chkType() {
	        if (!element.tagName) {
	          throw new TypeError('Object is not a valid DOM element')
	        } else if ('IFRAME' !== element.tagName.toUpperCase()) {
	          throw new TypeError(
	            'Expected <IFRAME> tag, found <' + element.tagName + '>'
	          )
	        }
	      }

	      if (element) {
	        chkType();
	        setupIFrame(element, options);
	        iFrames.push(element);
	      }
	    }

	    function warnDeprecatedOptions(options) {
	      if (options && options.enablePublicMethods) {
	        warn(
	          'enablePublicMethods option has been removed, public methods are now always available in the iFrame'
	        );
	      }
	    }

	    var iFrames;

	    setupRequestAnimationFrame();
	    setupEventListeners();

	    return function iFrameResizeF(options, target) {
	      iFrames = []; // Only return iFrames past in on this call

	      warnDeprecatedOptions(options);

	      switch (typeof target) {
	        case 'undefined':
	        case 'string':
	          Array.prototype.forEach.call(
	            document.querySelectorAll(target || 'iframe'),
	            init.bind(undefined, options)
	          );
	          break

	        case 'object':
	          init(options, target);
	          break

	        default:
	          throw new TypeError('Unexpected data type (' + typeof target + ')')
	      }

	      return iFrames
	    }
	  }

	  function createJQueryPublicMethod($) {
	    if (!$.fn) {
	      info('', 'Unable to bind to jQuery, it is not fully loaded.');
	    } else if (!$.fn.iFrameResize) {
	      $.fn.iFrameResize = function $iFrameResizeF(options) {
	        function init(index, element) {
	          setupIFrame(element, options);
	        }

	        return this.filter('iframe')
	          .each(init)
	          .end()
	      };
	    }
	  }

	  if (window.jQuery) {
	    createJQueryPublicMethod(window.jQuery);
	  }

	  if (typeof undefined === 'function' && undefined.amd) {
	    undefined([], factory);
	  } else {
	    // Node for browserfy
	    module.exports = factory();
	  }
	  window.iFrameResize = window.iFrameResize || factory();
	})();
	});

	var iframeResizer_contentWindow = createCommonjsModule(function (module) {
	(function(undefined) {
	  if (typeof window === 'undefined') return // don't run for server side render

	  var autoResize = true,
	    base = 10,
	    bodyBackground = '',
	    bodyMargin = 0,
	    bodyMarginStr = '',
	    bodyObserver = null,
	    bodyPadding = '',
	    calculateWidth = false,
	    doubleEventList = { resize: 1, click: 1 },
	    eventCancelTimer = 128,
	    firstRun = true,
	    height = 1,
	    heightCalcModeDefault = 'bodyOffset',
	    heightCalcMode = heightCalcModeDefault,
	    initLock = true,
	    initMsg = '',
	    inPageLinks = {},
	    interval = 32,
	    intervalTimer = null,
	    logging = false,
	    msgID = '[iFrameSizer]', // Must match host page msg ID
	    msgIdLen = msgID.length,
	    myID = '',
	    resetRequiredMethods = {
	      max: 1,
	      min: 1,
	      bodyScroll: 1,
	      documentElementScroll: 1
	    },
	    resizeFrom = 'child',
	    sendPermit = true,
	    target = window.parent,
	    targetOriginDefault = '*',
	    tolerance = 0,
	    triggerLocked = false,
	    triggerLockedTimer = null,
	    throttledTimer = 16,
	    width = 1,
	    widthCalcModeDefault = 'scroll',
	    widthCalcMode = widthCalcModeDefault,
	    win = window,
	    onMessage = function() {
	      warn('onMessage function not defined');
	    },
	    onReady = function() {},
	    onPageInfo = function() {},
	    customCalcMethods = {
	      height: function() {
	        warn('Custom height calculation function not defined');
	        return document.documentElement.offsetHeight
	      },
	      width: function() {
	        warn('Custom width calculation function not defined');
	        return document.body.scrollWidth
	      }
	    },
	    eventHandlersByName = {},
	    passiveSupported = false;

	  function noop() {}

	  try {
	    var options = Object.create(
	      {},
	      {
	        passive: {
	          get: function() {
	            passiveSupported = true;
	          }
	        }
	      }
	    );
	    window.addEventListener('test', noop, options);
	    window.removeEventListener('test', noop, options);
	  } catch (error) {
	    /* */
	  }

	  function addEventListener(el, evt, func, options) {
	    el.addEventListener(evt, func, passiveSupported ? options || {} : false);
	  }

	  function removeEventListener(el, evt, func) {
	    el.removeEventListener(evt, func, false);
	  }

	  function capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1)
	  }

	  // Based on underscore.js
	  function throttle(func) {
	    var context,
	      args,
	      result,
	      timeout = null,
	      previous = 0,
	      later = function() {
	        previous = getNow();
	        timeout = null;
	        result = func.apply(context, args);
	        if (!timeout) {
	          // eslint-disable-next-line no-multi-assign
	          context = args = null;
	        }
	      };

	    return function() {
	      var now = getNow();

	      if (!previous) {
	        previous = now;
	      }

	      var remaining = throttledTimer - (now - previous);

	      context = this;
	      args = arguments;

	      if (remaining <= 0 || remaining > throttledTimer) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }

	        previous = now;
	        result = func.apply(context, args);

	        if (!timeout) {
	          // eslint-disable-next-line no-multi-assign
	          context = args = null;
	        }
	      } else if (!timeout) {
	        timeout = setTimeout(later, remaining);
	      }

	      return result
	    }
	  }

	  var getNow =
	    Date.now ||
	    function() {
	      /* istanbul ignore next */ // Not testable in PhantonJS
	      return new Date().getTime()
	    };

	  function formatLogMsg(msg) {
	    return msgID + '[' + myID + '] ' + msg
	  }

	  function log(msg) {
	    if (logging && 'object' === typeof window.console) {
	      // eslint-disable-next-line no-console
	      console.log(formatLogMsg(msg));
	    }
	  }

	  function warn(msg) {
	    if ('object' === typeof window.console) {
	      // eslint-disable-next-line no-console
	      console.warn(formatLogMsg(msg));
	    }
	  }

	  function init() {
	    readDataFromParent();
	    log('Initialising iFrame (' + location.href + ')');
	    readDataFromPage();
	    setMargin();
	    setBodyStyle('background', bodyBackground);
	    setBodyStyle('padding', bodyPadding);
	    injectClearFixIntoBodyElement();
	    checkHeightMode();
	    checkWidthMode();
	    stopInfiniteResizingOfIFrame();
	    setupPublicMethods();
	    startEventListeners();
	    inPageLinks = setupInPageLinks();
	    sendSize('init', 'Init message from host page');
	    onReady();
	  }

	  function readDataFromParent() {
	    function strBool(str) {
	      return 'true' === str
	    }

	    var data = initMsg.substr(msgIdLen).split(':');

	    myID = data[0];
	    bodyMargin = undefined !== data[1] ? Number(data[1]) : bodyMargin; // For V1 compatibility
	    calculateWidth = undefined !== data[2] ? strBool(data[2]) : calculateWidth;
	    logging = undefined !== data[3] ? strBool(data[3]) : logging;
	    interval = undefined !== data[4] ? Number(data[4]) : interval;
	    autoResize = undefined !== data[6] ? strBool(data[6]) : autoResize;
	    bodyMarginStr = data[7];
	    heightCalcMode = undefined !== data[8] ? data[8] : heightCalcMode;
	    bodyBackground = data[9];
	    bodyPadding = data[10];
	    tolerance = undefined !== data[11] ? Number(data[11]) : tolerance;
	    inPageLinks.enable = undefined !== data[12] ? strBool(data[12]) : false;
	    resizeFrom = undefined !== data[13] ? data[13] : resizeFrom;
	    widthCalcMode = undefined !== data[14] ? data[14] : widthCalcMode;
	  }

	  function depricate(key) {
	    var splitName = key.split('Callback');

	    if (splitName.length === 2) {
	      var name =
	        'on' + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
	      this[name] = this[key];
	      delete this[key];
	      warn(
	        "Deprecated: '" +
	          key +
	          "' has been renamed '" +
	          name +
	          "'. The old method will be removed in the next major version."
	      );
	    }
	  }

	  function readDataFromPage() {
	    function readData() {
	      var data = window.iFrameResizer;

	      log('Reading data from page: ' + JSON.stringify(data));
	      Object.keys(data).forEach(depricate, data);

	      onMessage = 'onMessage' in data ? data.onMessage : onMessage;
	      onReady = 'onReady' in data ? data.onReady : onReady;
	      targetOriginDefault =
	        'targetOrigin' in data ? data.targetOrigin : targetOriginDefault;
	      heightCalcMode =
	        'heightCalculationMethod' in data
	          ? data.heightCalculationMethod
	          : heightCalcMode;
	      widthCalcMode =
	        'widthCalculationMethod' in data
	          ? data.widthCalculationMethod
	          : widthCalcMode;
	    }

	    function setupCustomCalcMethods(calcMode, calcFunc) {
	      if ('function' === typeof calcMode) {
	        log('Setup custom ' + calcFunc + 'CalcMethod');
	        customCalcMethods[calcFunc] = calcMode;
	        calcMode = 'custom';
	      }

	      return calcMode
	    }

	    if (
	      'iFrameResizer' in window &&
	      Object === window.iFrameResizer.constructor
	    ) {
	      readData();
	      heightCalcMode = setupCustomCalcMethods(heightCalcMode, 'height');
	      widthCalcMode = setupCustomCalcMethods(widthCalcMode, 'width');
	    }

	    log('TargetOrigin for parent set to: ' + targetOriginDefault);
	  }

	  function chkCSS(attr, value) {
	    if (-1 !== value.indexOf('-')) {
	      warn('Negative CSS value ignored for ' + attr);
	      value = '';
	    }
	    return value
	  }

	  function setBodyStyle(attr, value) {
	    if (undefined !== value && '' !== value && 'null' !== value) {
	      document.body.style[attr] = value;
	      log('Body ' + attr + ' set to "' + value + '"');
	    }
	  }

	  function setMargin() {
	    // If called via V1 script, convert bodyMargin from int to str
	    if (undefined === bodyMarginStr) {
	      bodyMarginStr = bodyMargin + 'px';
	    }

	    setBodyStyle('margin', chkCSS('margin', bodyMarginStr));
	  }

	  function stopInfiniteResizingOfIFrame() {
	    document.documentElement.style.height = '';
	    document.body.style.height = '';
	    log('HTML & body height set to "auto"');
	  }

	  function manageTriggerEvent(options) {
	    var listener = {
	      add: function(eventName) {
	        function handleEvent() {
	          sendSize(options.eventName, options.eventType);
	        }

	        eventHandlersByName[eventName] = handleEvent;

	        addEventListener(window, eventName, handleEvent, { passive: true });
	      },
	      remove: function(eventName) {
	        var handleEvent = eventHandlersByName[eventName];
	        delete eventHandlersByName[eventName];

	        removeEventListener(window, eventName, handleEvent);
	      }
	    };

	    if (options.eventNames && Array.prototype.map) {
	      options.eventName = options.eventNames[0];
	      options.eventNames.map(listener[options.method]);
	    } else {
	      listener[options.method](options.eventName);
	    }

	    log(
	      capitalizeFirstLetter(options.method) +
	        ' event listener: ' +
	        options.eventType
	    );
	  }

	  function manageEventListeners(method) {
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Animation Start',
	      eventNames: ['animationstart', 'webkitAnimationStart']
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Animation Iteration',
	      eventNames: ['animationiteration', 'webkitAnimationIteration']
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Animation End',
	      eventNames: ['animationend', 'webkitAnimationEnd']
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Input',
	      eventName: 'input'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Mouse Up',
	      eventName: 'mouseup'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Mouse Down',
	      eventName: 'mousedown'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Orientation Change',
	      eventName: 'orientationchange'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Print',
	      eventName: ['afterprint', 'beforeprint']
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Ready State Change',
	      eventName: 'readystatechange'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Touch Start',
	      eventName: 'touchstart'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Touch End',
	      eventName: 'touchend'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Touch Cancel',
	      eventName: 'touchcancel'
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Transition Start',
	      eventNames: [
	        'transitionstart',
	        'webkitTransitionStart',
	        'MSTransitionStart',
	        'oTransitionStart',
	        'otransitionstart'
	      ]
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Transition Iteration',
	      eventNames: [
	        'transitioniteration',
	        'webkitTransitionIteration',
	        'MSTransitionIteration',
	        'oTransitionIteration',
	        'otransitioniteration'
	      ]
	    });
	    manageTriggerEvent({
	      method: method,
	      eventType: 'Transition End',
	      eventNames: [
	        'transitionend',
	        'webkitTransitionEnd',
	        'MSTransitionEnd',
	        'oTransitionEnd',
	        'otransitionend'
	      ]
	    });
	    if ('child' === resizeFrom) {
	      manageTriggerEvent({
	        method: method,
	        eventType: 'IFrame Resized',
	        eventName: 'resize'
	      });
	    }
	  }

	  function checkCalcMode(calcMode, calcModeDefault, modes, type) {
	    if (calcModeDefault !== calcMode) {
	      if (!(calcMode in modes)) {
	        warn(
	          calcMode + ' is not a valid option for ' + type + 'CalculationMethod.'
	        );
	        calcMode = calcModeDefault;
	      }
	      log(type + ' calculation method set to "' + calcMode + '"');
	    }

	    return calcMode
	  }

	  function checkHeightMode() {
	    heightCalcMode = checkCalcMode(
	      heightCalcMode,
	      heightCalcModeDefault,
	      getHeight,
	      'height'
	    );
	  }

	  function checkWidthMode() {
	    widthCalcMode = checkCalcMode(
	      widthCalcMode,
	      widthCalcModeDefault,
	      getWidth,
	      'width'
	    );
	  }

	  function startEventListeners() {
	    if (true === autoResize) {
	      manageEventListeners('add');
	      setupMutationObserver();
	    } else {
	      log('Auto Resize disabled');
	    }
	  }

	  //   function stopMsgsToParent() {
	  //     log('Disable outgoing messages')
	  //     sendPermit = false
	  //   }

	  //   function removeMsgListener() {
	  //     log('Remove event listener: Message')
	  //     removeEventListener(window, 'message', receiver)
	  //   }

	  function disconnectMutationObserver() {
	    if (null !== bodyObserver) {
	      /* istanbul ignore next */ // Not testable in PhantonJS
	      bodyObserver.disconnect();
	    }
	  }

	  function stopEventListeners() {
	    manageEventListeners('remove');
	    disconnectMutationObserver();
	    clearInterval(intervalTimer);
	  }

	  //   function teardown() {
	  //     stopMsgsToParent()
	  //     removeMsgListener()
	  //     if (true === autoResize) stopEventListeners()
	  //   }

	  function injectClearFixIntoBodyElement() {
	    var clearFix = document.createElement('div');
	    clearFix.style.clear = 'both';
	    // Guard against the following having been globally redefined in CSS.
	    clearFix.style.display = 'block';
	    clearFix.style.height = '0';
	    document.body.appendChild(clearFix);
	  }

	  function setupInPageLinks() {
	    function getPagePosition() {
	      return {
	        x:
	          window.pageXOffset !== undefined
	            ? window.pageXOffset
	            : document.documentElement.scrollLeft,
	        y:
	          window.pageYOffset !== undefined
	            ? window.pageYOffset
	            : document.documentElement.scrollTop
	      }
	    }

	    function getElementPosition(el) {
	      var elPosition = el.getBoundingClientRect(),
	        pagePosition = getPagePosition();

	      return {
	        x: parseInt(elPosition.left, 10) + parseInt(pagePosition.x, 10),
	        y: parseInt(elPosition.top, 10) + parseInt(pagePosition.y, 10)
	      }
	    }

	    function findTarget(location) {
	      function jumpToTarget(target) {
	        var jumpPosition = getElementPosition(target);

	        log(
	          'Moving to in page link (#' +
	            hash +
	            ') at x: ' +
	            jumpPosition.x +
	            ' y: ' +
	            jumpPosition.y
	        );
	        sendMsg(jumpPosition.y, jumpPosition.x, 'scrollToOffset'); // X&Y reversed at sendMsg uses height/width
	      }

	      var hash = location.split('#')[1] || location, // Remove # if present
	        hashData = decodeURIComponent(hash),
	        target =
	          document.getElementById(hashData) ||
	          document.getElementsByName(hashData)[0];

	      if (undefined !== target) {
	        jumpToTarget(target);
	      } else {
	        log(
	          'In page link (#' +
	            hash +
	            ') not found in iFrame, so sending to parent'
	        );
	        sendMsg(0, 0, 'inPageLink', '#' + hash);
	      }
	    }

	    function checkLocationHash() {
	      if ('' !== location.hash && '#' !== location.hash) {
	        findTarget(location.href);
	      }
	    }

	    function bindAnchors() {
	      function setupLink(el) {
	        function linkClicked(e) {
	          e.preventDefault();

	          /* jshint validthis:true */
	          findTarget(this.getAttribute('href'));
	        }

	        if ('#' !== el.getAttribute('href')) {
	          addEventListener(el, 'click', linkClicked);
	        }
	      }

	      Array.prototype.forEach.call(
	        document.querySelectorAll('a[href^="#"]'),
	        setupLink
	      );
	    }

	    function bindLocationHash() {
	      addEventListener(window, 'hashchange', checkLocationHash);
	    }

	    function initCheck() {
	      // Check if page loaded with location hash after init resize
	      setTimeout(checkLocationHash, eventCancelTimer);
	    }

	    function enableInPageLinks() {
	      /* istanbul ignore else */ // Not testable in phantonJS
	      if (Array.prototype.forEach && document.querySelectorAll) {
	        log('Setting up location.hash handlers');
	        bindAnchors();
	        bindLocationHash();
	        initCheck();
	      } else {
	        warn(
	          'In page linking not fully supported in this browser! (See README.md for IE8 workaround)'
	        );
	      }
	    }

	    if (inPageLinks.enable) {
	      enableInPageLinks();
	    } else {
	      log('In page linking not enabled');
	    }

	    return {
	      findTarget: findTarget
	    }
	  }

	  function setupPublicMethods() {
	    log('Enable public methods');

	    win.parentIFrame = {
	      autoResize: function autoResizeF(resize) {
	        if (true === resize && false === autoResize) {
	          autoResize = true;
	          startEventListeners();
	        } else if (false === resize && true === autoResize) {
	          autoResize = false;
	          stopEventListeners();
	        }
	        sendMsg(0, 0, 'autoResize', JSON.stringify(autoResize));
	        return autoResize
	      },

	      close: function closeF() {
	        sendMsg(0, 0, 'close');
	        // teardown()
	      },

	      getId: function getIdF() {
	        return myID
	      },

	      getPageInfo: function getPageInfoF(callback) {
	        if ('function' === typeof callback) {
	          onPageInfo = callback;
	          sendMsg(0, 0, 'pageInfo');
	        } else {
	          onPageInfo = function() {};
	          sendMsg(0, 0, 'pageInfoStop');
	        }
	      },

	      moveToAnchor: function moveToAnchorF(hash) {
	        inPageLinks.findTarget(hash);
	      },

	      reset: function resetF() {
	        resetIFrame('parentIFrame.reset');
	      },

	      scrollTo: function scrollToF(x, y) {
	        sendMsg(y, x, 'scrollTo'); // X&Y reversed at sendMsg uses height/width
	      },

	      scrollToOffset: function scrollToF(x, y) {
	        sendMsg(y, x, 'scrollToOffset'); // X&Y reversed at sendMsg uses height/width
	      },

	      sendMessage: function sendMessageF(msg, targetOrigin) {
	        sendMsg(0, 0, 'message', JSON.stringify(msg), targetOrigin);
	      },

	      setHeightCalculationMethod: function setHeightCalculationMethodF(
	        heightCalculationMethod
	      ) {
	        heightCalcMode = heightCalculationMethod;
	        checkHeightMode();
	      },

	      setWidthCalculationMethod: function setWidthCalculationMethodF(
	        widthCalculationMethod
	      ) {
	        widthCalcMode = widthCalculationMethod;
	        checkWidthMode();
	      },

	      setTargetOrigin: function setTargetOriginF(targetOrigin) {
	        log('Set targetOrigin: ' + targetOrigin);
	        targetOriginDefault = targetOrigin;
	      },

	      size: function sizeF(customHeight, customWidth) {
	        var valString =
	          '' + (customHeight || '') + (customWidth ? ',' + customWidth : '');
	        sendSize(
	          'size',
	          'parentIFrame.size(' + valString + ')',
	          customHeight,
	          customWidth
	        );
	      }
	    };
	  }

	  function initInterval() {
	    if (0 !== interval) {
	      log('setInterval: ' + interval + 'ms');
	      intervalTimer = setInterval(function() {
	        sendSize('interval', 'setInterval: ' + interval);
	      }, Math.abs(interval));
	    }
	  }

	  // Not testable in PhantomJS
	  /* istanbul ignore next */
	  function setupBodyMutationObserver() {
	    function addImageLoadListners(mutation) {
	      function addImageLoadListener(element) {
	        if (false === element.complete) {
	          log('Attach listeners to ' + element.src);
	          element.addEventListener('load', imageLoaded, false);
	          element.addEventListener('error', imageError, false);
	          elements.push(element);
	        }
	      }

	      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
	        addImageLoadListener(mutation.target);
	      } else if (mutation.type === 'childList') {
	        Array.prototype.forEach.call(
	          mutation.target.querySelectorAll('img'),
	          addImageLoadListener
	        );
	      }
	    }

	    function removeFromArray(element) {
	      elements.splice(elements.indexOf(element), 1);
	    }

	    function removeImageLoadListener(element) {
	      log('Remove listeners from ' + element.src);
	      element.removeEventListener('load', imageLoaded, false);
	      element.removeEventListener('error', imageError, false);
	      removeFromArray(element);
	    }

	    function imageEventTriggered(event, type, typeDesc) {
	      removeImageLoadListener(event.target);
	      sendSize(type, typeDesc + ': ' + event.target.src, undefined, undefined);
	    }

	    function imageLoaded(event) {
	      imageEventTriggered(event, 'imageLoad', 'Image loaded');
	    }

	    function imageError(event) {
	      imageEventTriggered(event, 'imageLoadFailed', 'Image load failed');
	    }

	    function mutationObserved(mutations) {
	      sendSize(
	        'mutationObserver',
	        'mutationObserver: ' + mutations[0].target + ' ' + mutations[0].type
	      );

	      // Deal with WebKit / Blink asyncing image loading when tags are injected into the page
	      mutations.forEach(addImageLoadListners);
	    }

	    function createMutationObserver() {
	      var target = document.querySelector('body'),
	        config = {
	          attributes: true,
	          attributeOldValue: false,
	          characterData: true,
	          characterDataOldValue: false,
	          childList: true,
	          subtree: true
	        };

	      observer = new MutationObserver(mutationObserved);

	      log('Create body MutationObserver');
	      observer.observe(target, config);

	      return observer
	    }

	    var elements = [],
	      MutationObserver =
	        window.MutationObserver || window.WebKitMutationObserver,
	      observer = createMutationObserver();

	    return {
	      disconnect: function() {
	        if ('disconnect' in observer) {
	          log('Disconnect body MutationObserver');
	          observer.disconnect();
	          elements.forEach(removeImageLoadListener);
	        }
	      }
	    }
	  }

	  function setupMutationObserver() {
	    var forceIntervalTimer = 0 > interval;

	    // Not testable in PhantomJS
	    /* istanbul ignore if */ if (
	      window.MutationObserver ||
	      window.WebKitMutationObserver
	    ) {
	      if (forceIntervalTimer) {
	        initInterval();
	      } else {
	        bodyObserver = setupBodyMutationObserver();
	      }
	    } else {
	      log('MutationObserver not supported in this browser!');
	      initInterval();
	    }
	  }

	  // document.documentElement.offsetHeight is not reliable, so
	  // we have to jump through hoops to get a better value.
	  function getComputedStyle(prop, el) {
	    var retVal = 0;
	    el = el || document.body; // Not testable in phantonJS

	    retVal = document.defaultView.getComputedStyle(el, null);
	    retVal = null !== retVal ? retVal[prop] : 0;

	    return parseInt(retVal, base)
	  }

	  function chkEventThottle(timer) {
	    if (timer > throttledTimer / 2) {
	      throttledTimer = 2 * timer;
	      log('Event throttle increased to ' + throttledTimer + 'ms');
	    }
	  }

	  // Idea from https://github.com/guardian/iframe-messenger
	  function getMaxElement(side, elements) {
	    var elementsLength = elements.length,
	      elVal = 0,
	      maxVal = 0,
	      Side = capitalizeFirstLetter(side),
	      timer = getNow();

	    for (var i = 0; i < elementsLength; i++) {
	      elVal =
	        elements[i].getBoundingClientRect()[side] +
	        getComputedStyle('margin' + Side, elements[i]);
	      if (elVal > maxVal) {
	        maxVal = elVal;
	      }
	    }

	    timer = getNow() - timer;

	    log('Parsed ' + elementsLength + ' HTML elements');
	    log('Element position calculated in ' + timer + 'ms');

	    chkEventThottle(timer);

	    return maxVal
	  }

	  function getAllMeasurements(dimention) {
	    return [
	      dimention.bodyOffset(),
	      dimention.bodyScroll(),
	      dimention.documentElementOffset(),
	      dimention.documentElementScroll()
	    ]
	  }

	  function getTaggedElements(side, tag) {
	    function noTaggedElementsFound() {
	      warn('No tagged elements (' + tag + ') found on page');
	      return document.querySelectorAll('body *')
	    }

	    var elements = document.querySelectorAll('[' + tag + ']');

	    if (0 === elements.length) noTaggedElementsFound();

	    return getMaxElement(side, elements)
	  }

	  function getAllElements() {
	    return document.querySelectorAll('body *')
	  }

	  var getHeight = {
	      bodyOffset: function getBodyOffsetHeight() {
	        return (
	          document.body.offsetHeight +
	          getComputedStyle('marginTop') +
	          getComputedStyle('marginBottom')
	        )
	      },

	      offset: function() {
	        return getHeight.bodyOffset() // Backwards compatability
	      },

	      bodyScroll: function getBodyScrollHeight() {
	        return document.body.scrollHeight
	      },

	      custom: function getCustomWidth() {
	        return customCalcMethods.height()
	      },

	      documentElementOffset: function getDEOffsetHeight() {
	        return document.documentElement.offsetHeight
	      },

	      documentElementScroll: function getDEScrollHeight() {
	        return document.documentElement.scrollHeight
	      },

	      max: function getMaxHeight() {
	        return Math.max.apply(null, getAllMeasurements(getHeight))
	      },

	      min: function getMinHeight() {
	        return Math.min.apply(null, getAllMeasurements(getHeight))
	      },

	      grow: function growHeight() {
	        return getHeight.max() // Run max without the forced downsizing
	      },

	      lowestElement: function getBestHeight() {
	        return Math.max(
	          getHeight.bodyOffset() || getHeight.documentElementOffset(),
	          getMaxElement('bottom', getAllElements())
	        )
	      },

	      taggedElement: function getTaggedElementsHeight() {
	        return getTaggedElements('bottom', 'data-iframe-height')
	      }
	    },
	    getWidth = {
	      bodyScroll: function getBodyScrollWidth() {
	        return document.body.scrollWidth
	      },

	      bodyOffset: function getBodyOffsetWidth() {
	        return document.body.offsetWidth
	      },

	      custom: function getCustomWidth() {
	        return customCalcMethods.width()
	      },

	      documentElementScroll: function getDEScrollWidth() {
	        return document.documentElement.scrollWidth
	      },

	      documentElementOffset: function getDEOffsetWidth() {
	        return document.documentElement.offsetWidth
	      },

	      scroll: function getMaxWidth() {
	        return Math.max(getWidth.bodyScroll(), getWidth.documentElementScroll())
	      },

	      max: function getMaxWidth() {
	        return Math.max.apply(null, getAllMeasurements(getWidth))
	      },

	      min: function getMinWidth() {
	        return Math.min.apply(null, getAllMeasurements(getWidth))
	      },

	      rightMostElement: function rightMostElement() {
	        return getMaxElement('right', getAllElements())
	      },

	      taggedElement: function getTaggedElementsWidth() {
	        return getTaggedElements('right', 'data-iframe-width')
	      }
	    };

	  function sizeIFrame(
	    triggerEvent,
	    triggerEventDesc,
	    customHeight,
	    customWidth
	  ) {
	    function resizeIFrame() {
	      height = currentHeight;
	      width = currentWidth;

	      sendMsg(height, width, triggerEvent);
	    }

	    function isSizeChangeDetected() {
	      function checkTolarance(a, b) {
	        var retVal = Math.abs(a - b) <= tolerance;
	        return !retVal
	      }

	      currentHeight =
	        undefined !== customHeight ? customHeight : getHeight[heightCalcMode]();
	      currentWidth =
	        undefined !== customWidth ? customWidth : getWidth[widthCalcMode]();

	      return (
	        checkTolarance(height, currentHeight) ||
	        (calculateWidth && checkTolarance(width, currentWidth))
	      )
	    }

	    function isForceResizableEvent() {
	      return !(triggerEvent in { init: 1, interval: 1, size: 1 })
	    }

	    function isForceResizableCalcMode() {
	      return (
	        heightCalcMode in resetRequiredMethods ||
	        (calculateWidth && widthCalcMode in resetRequiredMethods)
	      )
	    }

	    function logIgnored() {
	      log('No change in size detected');
	    }

	    function checkDownSizing() {
	      if (isForceResizableEvent() && isForceResizableCalcMode()) {
	        resetIFrame(triggerEventDesc);
	      } else if (!(triggerEvent in { interval: 1 })) {
	        logIgnored();
	      }
	    }

	    var currentHeight, currentWidth;

	    if (isSizeChangeDetected() || 'init' === triggerEvent) {
	      lockTrigger();
	      resizeIFrame();
	    } else {
	      checkDownSizing();
	    }
	  }

	  var sizeIFrameThrottled = throttle(sizeIFrame);

	  function sendSize(triggerEvent, triggerEventDesc, customHeight, customWidth) {
	    function recordTrigger() {
	      if (!(triggerEvent in { reset: 1, resetPage: 1, init: 1 })) {
	        log('Trigger event: ' + triggerEventDesc);
	      }
	    }

	    function isDoubleFiredEvent() {
	      return triggerLocked && triggerEvent in doubleEventList
	    }

	    if (!isDoubleFiredEvent()) {
	      recordTrigger();
	      if (triggerEvent === 'init') {
	        sizeIFrame(triggerEvent, triggerEventDesc, customHeight, customWidth);
	      } else {
	        sizeIFrameThrottled(
	          triggerEvent,
	          triggerEventDesc,
	          customHeight,
	          customWidth
	        );
	      }
	    } else {
	      log('Trigger event cancelled: ' + triggerEvent);
	    }
	  }

	  function lockTrigger() {
	    if (!triggerLocked) {
	      triggerLocked = true;
	      log('Trigger event lock on');
	    }
	    clearTimeout(triggerLockedTimer);
	    triggerLockedTimer = setTimeout(function() {
	      triggerLocked = false;
	      log('Trigger event lock off');
	      log('--');
	    }, eventCancelTimer);
	  }

	  function triggerReset(triggerEvent) {
	    height = getHeight[heightCalcMode]();
	    width = getWidth[widthCalcMode]();

	    sendMsg(height, width, triggerEvent);
	  }

	  function resetIFrame(triggerEventDesc) {
	    var hcm = heightCalcMode;
	    heightCalcMode = heightCalcModeDefault;

	    log('Reset trigger event: ' + triggerEventDesc);
	    lockTrigger();
	    triggerReset('reset');

	    heightCalcMode = hcm;
	  }

	  function sendMsg(height, width, triggerEvent, msg, targetOrigin) {
	    function setTargetOrigin() {
	      if (undefined === targetOrigin) {
	        targetOrigin = targetOriginDefault;
	      } else {
	        log('Message targetOrigin: ' + targetOrigin);
	      }
	    }

	    function sendToParent() {
	      var size = height + ':' + width,
	        message =
	          myID +
	          ':' +
	          size +
	          ':' +
	          triggerEvent +
	          (undefined !== msg ? ':' + msg : '');

	      log('Sending message to host page (' + message + ')');
	      target.postMessage(msgID + message, targetOrigin);
	    }

	    if (true === sendPermit) {
	      setTargetOrigin();
	      sendToParent();
	    }
	  }

	  function receiver(event) {
	    var processRequestFromParent = {
	      init: function initFromParent() {
	        initMsg = event.data;
	        target = event.source;

	        init();
	        firstRun = false;
	        setTimeout(function() {
	          initLock = false;
	        }, eventCancelTimer);
	      },

	      reset: function resetFromParent() {
	        if (!initLock) {
	          log('Page size reset by host page');
	          triggerReset('resetPage');
	        } else {
	          log('Page reset ignored by init');
	        }
	      },

	      resize: function resizeFromParent() {
	        sendSize('resizeParent', 'Parent window requested size check');
	      },

	      moveToAnchor: function moveToAnchorF() {
	        inPageLinks.findTarget(getData());
	      },
	      inPageLink: function inPageLinkF() {
	        this.moveToAnchor();
	      }, // Backward compatability

	      pageInfo: function pageInfoFromParent() {
	        var msgBody = getData();
	        log('PageInfoFromParent called from parent: ' + msgBody);
	        onPageInfo(JSON.parse(msgBody));
	        log(' --');
	      },

	      message: function messageFromParent() {
	        var msgBody = getData();

	        log('onMessage called from parent: ' + msgBody);
	        // eslint-disable-next-line sonarjs/no-extra-arguments
	        onMessage(JSON.parse(msgBody));
	        log(' --');
	      }
	    };

	    function isMessageForUs() {
	      return msgID === ('' + event.data).substr(0, msgIdLen) // ''+ Protects against non-string messages
	    }

	    function getMessageType() {
	      return event.data.split(']')[1].split(':')[0]
	    }

	    function getData() {
	      return event.data.substr(event.data.indexOf(':') + 1)
	    }

	    function isMiddleTier() {
	      return (
	        (!(module.exports) &&
	          'iFrameResize' in window) ||
	        ('jQuery' in window && 'iFrameResize' in window.jQuery.prototype)
	      )
	    }

	    function isInitMsg() {
	      // Test if this message is from a child below us. This is an ugly test, however, updating
	      // the message format would break backwards compatibity.
	      return event.data.split(':')[2] in { true: 1, false: 1 }
	    }

	    function callFromParent() {
	      var messageType = getMessageType();

	      if (messageType in processRequestFromParent) {
	        processRequestFromParent[messageType]();
	      } else if (!isMiddleTier() && !isInitMsg()) {
	        warn('Unexpected message (' + event.data + ')');
	      }
	    }

	    function processMessage() {
	      if (false === firstRun) {
	        callFromParent();
	      } else if (isInitMsg()) {
	        processRequestFromParent.init();
	      } else {
	        log(
	          'Ignored message of type "' +
	            getMessageType() +
	            '". Received before initialization.'
	        );
	      }
	    }

	    if (isMessageForUs()) {
	      processMessage();
	    }
	  }

	  // Normally the parent kicks things off when it detects the iFrame has loaded.
	  // If this script is async-loaded, then tell parent page to retry init.
	  function chkLateLoaded() {
	    if ('loading' !== document.readyState) {
	      window.parent.postMessage('[iFrameResizerChild]Ready', '*');
	    }
	  }

	  addEventListener(window, 'message', receiver);
	  addEventListener(window, 'readystatechange', chkLateLoaded);
	  chkLateLoaded();

	  
	})();
	});

	var iframeResize_1 = iframeResizer;
	var iframeResizer$1 = iframeResizer; // Backwards compatability
	var iframeResizerContentWindow = iframeResizer_contentWindow;

	var js = {
		iframeResize: iframeResize_1,
		iframeResizer: iframeResizer$1,
		iframeResizerContentWindow: iframeResizerContentWindow
	};

	var iframeResizer$2 = js;

	iframeResizer$2.iframeResizer({ maxWidth: '100%' }, 'iframe.app-example__frame--resizable');

	const nodeListForEach$2 = common.nodeListForEach;

	// Initialise tabs
	const $tabs = document.querySelectorAll('[data-module~="app-tabs"]');
	nodeListForEach$2($tabs, $tab => {
	  new AppTabs($tab).init();
	});

	// Initialise nav toggles
	const $toggles = document.querySelectorAll('[data-module~="subnav-toggle"]');
	nodeListForEach$2($toggles, $toggle => {
	  new SubNavToggle($toggle).init();
	});

	// Initialise language switch
	const $languageSwitchExamples = document.querySelectorAll('[data-module~="app-language-switch-example"]');
	nodeListForEach$2($languageSwitchExamples, $example => {
	  new LanguageSwitchExample($example).init();
	});

	// Initialise copy to clipboard
	const $copyToClipboardButtons = document.querySelectorAll('[data-module="app-copy"]');
	nodeListForEach$2($copyToClipboardButtons, $button => {
	  new CopyToClipboard($button).init();
	});

	// Initialise temporary accordian workaround
	const $accordions = document.querySelectorAll('[data-module~="govuk-accordion"]');
	nodeListForEach$2($accordions, $accordion => {
	  new Accordion($accordion).init();
	});

	// Initialise print links
	const $printLinks = document.querySelectorAll('[data-module="print-link"');
	nodeListForEach$2($printLinks, $printLink => {
	  new PrintLink($printLink).init();
	});

	all.initAll();
	all$1.initAll();

	window.hmrcDesignSystem = { CopyToClipboard };

}());
