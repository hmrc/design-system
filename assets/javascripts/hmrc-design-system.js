(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var all = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory();
	}(commonjsGlobal, (function () {
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
	      // eslint-disable-next-line max-len
	      /* TODO: It remains unclear whether a check for the same domain is necessary for security reasons.
	         There may be user research suggesting considerations regarding the visibility of the
	         back link on refresh.
	         Currently, a page refresh sets the referer to empty, leading to the back link being hidden
	         under our existing logic.
	       */
	      // eslint-disable-next-line max-len
	      var referrerNotOnSameDomain = function referrerNotOnSameDomain() {
	        var referer = _this.document.referrer;
	        return !referer || referer.indexOf(_this.window.location.host) === -1;
	      };

	      // hide the backlink if the referrer is on a different domain or the referrer is not set
	      if (referrerNotOnSameDomain()) {
	        this.$module.classList.add('hmrc-hidden-backlink');
	      } else {
	        // prevent resubmit warning
	        if (this.window.history.replaceState && typeof this.window.history.replaceState === 'function') {
	          this.window.history.replaceState(null, null, this.window.location.href);
	        }
	        this.$module.addEventListener('click', function (event) {
	          event.preventDefault();
	          if (_this.window.history.back && typeof _this.window.history.back === 'function') {
	            _this.window.history.back();
	          }
	        });
	      }
	    }
	  };

	  function _classCallCheck(a, n) {
	    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	  }
	  function _defineProperties(e, r) {
	    for (var t = 0; t < r.length; t++) {
	      var o = r[t];
	      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
	    }
	  }
	  function _createClass(e, r, t) {
	    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
	      writable: !1
	    }), e;
	  }
	  function _defineProperty(e, r, t) {
	    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
	      value: t,
	      enumerable: !0,
	      configurable: !0,
	      writable: !0
	    }) : e[r] = t, e;
	  }
	  function ownKeys(e, r) {
	    var t = Object.keys(e);
	    if (Object.getOwnPropertySymbols) {
	      var o = Object.getOwnPropertySymbols(e);
	      r && (o = o.filter(function (r) {
	        return Object.getOwnPropertyDescriptor(e, r).enumerable;
	      })), t.push.apply(t, o);
	    }
	    return t;
	  }
	  function _objectSpread2(e) {
	    for (var r = 1; r < arguments.length; r++) {
	      var t = null != arguments[r] ? arguments[r] : {};
	      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
	        _defineProperty(e, r, t[r]);
	      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
	        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
	      });
	    }
	    return e;
	  }
	  function _toPrimitive(t, r) {
	    if ("object" != typeof t || !t) return t;
	    var e = t[Symbol.toPrimitive];
	    if (void 0 !== e) {
	      var i = e.call(t, r || "default");
	      if ("object" != typeof i) return i;
	      throw new TypeError("@@toPrimitive must return a primitive value.");
	    }
	    return ("string" === r ? String : Number)(t);
	  }
	  function _toPropertyKey(t) {
	    var i = _toPrimitive(t, "string");
	    return "symbol" == typeof i ? i : i + "";
	  }
	  function _typeof(o) {
	    "@babel/helpers - typeof";

	    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
	      return typeof o;
	    } : function (o) {
	      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	    }, _typeof(o);
	  }

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
	      elements.forEach(function (i) {
	        i.classList.add(className);
	      });
	    },
	    removeClass: function removeClass(selector, className) {
	      var elements = document.querySelectorAll(selector);
	      elements.forEach(function (i) {
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
	      var xhr = new XMLHttpRequest();
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
	    };

	    // disable the non-dialog page to prevent confusion for VoiceOver users
	    var selectors = ['#skiplink-container', 'body > header', '#global-cookie-message', 'main', 'body > footer', 'body > .govuk-skip-link', '.cbanner-govuk-cookie-banner', 'body > .govuk-width-container'];
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
	    elements.forEach(function ($elem) {
	      var value = $elem.getAttribute('aria-hidden');
	      $elem.setAttribute('aria-hidden', 'true');
	      resetElementsFunctionList.push(function () {
	        if (value) {
	          $elem.setAttribute('aria-hidden', value);
	        } else {
	          $elem.removeAttribute('aria-hidden');
	        }
	      });
	    });

	    //
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

	  // TODO: rewrite this to follow govuk-frontend prototype module pattern

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
	        synchroniseTabs: validate["boolean"](lookupData('data-synchronise-tabs') || false),
	        hideSignOutButton: validate["boolean"](lookupData('data-hide-sign-out-button') || false)
	      };

	      // Default timeoutUrl to signOutUrl if not set
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
	      $element.appendChild($visualMessge);
	      $element.appendChild($audibleMessage);
	      $element.appendChild($staySignedInButton);
	      $staySignedInButton.addEventListener('click', keepAliveAndClose);
	      $element.appendChild(document.createTextNode(' '));
	      if (!settings.hideSignOutButton) {
	        var $signOutButton = utils.generateDomElementFromStringAndAppendText('<a id="hmrc-timeout-sign-out-link" class="govuk-link hmrc-timeout-dialog__link">', settings.signOutButtonText);
	        $signOutButton.addEventListener('click', signOut);
	        $signOutButton.setAttribute('href', settings.signOutUrl);
	        $element.appendChild(wrapLink($signOutButton));
	      }
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
	        var counter = Math.max(getSecondsRemaining(), 0);
	        updateCountdown(counter);
	        if (counter === 0) {
	          timeout();
	        } else {
	          currentTimer = window.setTimeout(runUpdate, getNextTimeout());
	        }
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

	  function HmrcPrintLink($module, window) {
	    this.$module = $module;
	    this.window = window;
	  }
	  HmrcPrintLink.prototype.init = function init() {
	    var _this = this;
	    this.$module.addEventListener('click', function (event) {
	      event.preventDefault();
	      _this.window.print();
	    });
	  };

	  function initAll() {
	    var $AccountMenuSelector = '[data-module="hmrc-account-menu"]';
	    if (document.querySelector($AccountMenuSelector)) {
	      new AccountMenu($AccountMenuSelector).init();
	    }
	    var $HmrcPrintLinks = document.querySelectorAll('a[data-module="hmrc-print-link"]');
	    $HmrcPrintLinks.forEach(function ($HmrcPrintLink) {
	      new HmrcPrintLink($HmrcPrintLink, window).init();
	    });
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
	    $BackLinks.forEach(function ($BackLink) {
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

	function normaliseString(value, property) {
	  const trimmedValue = value ? value.trim() : '';
	  let output;
	  let outputType = property == null ? void 0 : property.type;
	  if (!outputType) {
	    if (['true', 'false'].includes(trimmedValue)) {
	      outputType = 'boolean';
	    }
	    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
	      outputType = 'number';
	    }
	  }
	  switch (outputType) {
	    case 'boolean':
	      output = trimmedValue === 'true';
	      break;
	    case 'number':
	      output = Number(trimmedValue);
	      break;
	    default:
	      output = value;
	  }
	  return output;
	}

	function mergeConfigs(...configObjects) {
	  const formattedConfigObject = {};
	  for (const configObject of configObjects) {
	    for (const key of Object.keys(configObject)) {
	      const option = formattedConfigObject[key];
	      const override = configObject[key];
	      if (isObject(option) && isObject(override)) {
	        formattedConfigObject[key] = mergeConfigs(option, override);
	      } else {
	        formattedConfigObject[key] = override;
	      }
	    }
	  }
	  return formattedConfigObject;
	}
	function extractConfigByNamespace(Component, dataset, namespace) {
	  const property = Component.schema.properties[namespace];
	  if ((property == null ? void 0 : property.type) !== 'object') {
	    return;
	  }
	  const newObject = {
	    [namespace]: ({})
	  };
	  for (const [key, value] of Object.entries(dataset)) {
	    let current = newObject;
	    const keyParts = key.split('.');
	    for (const [index, name] of keyParts.entries()) {
	      if (typeof current === 'object') {
	        if (index < keyParts.length - 1) {
	          if (!isObject(current[name])) {
	            current[name] = {};
	          }
	          current = current[name];
	        } else if (key !== namespace) {
	          current[name] = normaliseString(value);
	        }
	      }
	    }
	  }
	  return newObject[namespace];
	}
	function getFragmentFromUrl(url) {
	  if (!url.includes('#')) {
	    return undefined;
	  }
	  return url.split('#').pop();
	}
	function getBreakpoint(name) {
	  const property = `--govuk-frontend-breakpoint-${name}`;
	  const value = window.getComputedStyle(document.documentElement).getPropertyValue(property);
	  return {
	    property,
	    value: value || undefined
	  };
	}
	function setFocus($element, options = {}) {
	  var _options$onBeforeFocu;
	  const isFocusable = $element.getAttribute('tabindex');
	  if (!isFocusable) {
	    $element.setAttribute('tabindex', '-1');
	  }
	  function onFocus() {
	    $element.addEventListener('blur', onBlur, {
	      once: true
	    });
	  }
	  function onBlur() {
	    var _options$onBlur;
	    (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
	    if (!isFocusable) {
	      $element.removeAttribute('tabindex');
	    }
	  }
	  $element.addEventListener('focus', onFocus, {
	    once: true
	  });
	  (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
	  $element.focus();
	}
	function isInitialised($root, moduleName) {
	  return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
	}

	/**
	 * Checks if GOV.UK Frontend is supported on this page
	 *
	 * Some browsers will load and run our JavaScript but GOV.UK Frontend
	 * won't be supported.
	 *
	 * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
	 * @returns {boolean} Whether GOV.UK Frontend is supported on this page
	 */
	function isSupported($scope = document.body) {
	  if (!$scope) {
	    return false;
	  }
	  return $scope.classList.contains('govuk-frontend-supported');
	}
	function validateConfig(schema, config) {
	  const validationErrors = [];
	  for (const [name, conditions] of Object.entries(schema)) {
	    const errors = [];
	    if (Array.isArray(conditions)) {
	      for (const {
	        required,
	        errorMessage
	      } of conditions) {
	        if (!required.every(key => !!config[key])) {
	          errors.push(errorMessage);
	        }
	      }
	      if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
	        validationErrors.push(...errors);
	      }
	    }
	  }
	  return validationErrors;
	}
	function isArray(option) {
	  return Array.isArray(option);
	}
	function isObject(option) {
	  return !!option && typeof option === 'object' && !isArray(option);
	}
	function formatErrorMessage(Component, message) {
	  return `${Component.moduleName}: ${message}`;
	}

	function normaliseDataset(Component, dataset) {
	  const out = {};
	  for (const [field, property] of Object.entries(Component.schema.properties)) {
	    if (field in dataset) {
	      out[field] = normaliseString(dataset[field], property);
	    }
	    if ((property == null ? void 0 : property.type) === 'object') {
	      out[field] = extractConfigByNamespace(Component, dataset, field);
	    }
	  }
	  return out;
	}

	class GOVUKFrontendError extends Error {
	  constructor(...args) {
	    super(...args);
	    this.name = 'GOVUKFrontendError';
	  }
	}
	class SupportError extends GOVUKFrontendError {
	  /**
	   * Checks if GOV.UK Frontend is supported on this page
	   *
	   * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
	   */
	  constructor($scope = document.body) {
	    const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
	    super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
	    this.name = 'SupportError';
	  }
	}
	class ConfigError extends GOVUKFrontendError {
	  constructor(...args) {
	    super(...args);
	    this.name = 'ConfigError';
	  }
	}
	class ElementError extends GOVUKFrontendError {
	  constructor(messageOrOptions) {
	    let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
	    if (typeof messageOrOptions === 'object') {
	      const {
	        component,
	        identifier,
	        element,
	        expectedType
	      } = messageOrOptions;
	      message = identifier;
	      message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
	      message = formatErrorMessage(component, message);
	    }
	    super(message);
	    this.name = 'ElementError';
	  }
	}
	class InitError extends GOVUKFrontendError {
	  constructor(componentOrMessage) {
	    const message = typeof componentOrMessage === 'string' ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
	    super(message);
	    this.name = 'InitError';
	  }
	}

	class GOVUKFrontendComponent {
	  /**
	   * Returns the root element of the component
	   *
	   * @protected
	   * @returns {RootElementType} - the root element of component
	   */
	  get $root() {
	    return this._$root;
	  }
	  constructor($root) {
	    this._$root = void 0;
	    const childConstructor = this.constructor;
	    if (typeof childConstructor.moduleName !== 'string') {
	      throw new InitError(`\`moduleName\` not defined in component`);
	    }
	    if (!($root instanceof childConstructor.elementType)) {
	      throw new ElementError({
	        element: $root,
	        component: childConstructor,
	        identifier: 'Root element (`$root`)',
	        expectedType: childConstructor.elementType.name
	      });
	    } else {
	      this._$root = $root;
	    }
	    childConstructor.checkSupport();
	    this.checkInitialised();
	    const moduleName = childConstructor.moduleName;
	    this.$root.setAttribute(`data-${moduleName}-init`, '');
	  }
	  checkInitialised() {
	    const constructor = this.constructor;
	    const moduleName = constructor.moduleName;
	    if (moduleName && isInitialised(this.$root, moduleName)) {
	      throw new InitError(constructor);
	    }
	  }
	  static checkSupport() {
	    if (!isSupported()) {
	      throw new SupportError();
	    }
	  }
	}

	/**
	 * @typedef ChildClass
	 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
	 */

	/**
	 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
	 */
	GOVUKFrontendComponent.elementType = HTMLElement;

	class I18n {
	  constructor(translations = {}, config = {}) {
	    var _config$locale;
	    this.translations = void 0;
	    this.locale = void 0;
	    this.translations = translations;
	    this.locale = (_config$locale = config.locale) != null ? _config$locale : document.documentElement.lang || 'en';
	  }
	  t(lookupKey, options) {
	    if (!lookupKey) {
	      throw new Error('i18n: lookup key missing');
	    }
	    let translation = this.translations[lookupKey];
	    if (typeof (options == null ? void 0 : options.count) === 'number' && typeof translation === 'object') {
	      const translationPluralForm = translation[this.getPluralSuffix(lookupKey, options.count)];
	      if (translationPluralForm) {
	        translation = translationPluralForm;
	      }
	    }
	    if (typeof translation === 'string') {
	      if (translation.match(/%{(.\S+)}/)) {
	        if (!options) {
	          throw new Error('i18n: cannot replace placeholders in string if no option data provided');
	        }
	        return this.replacePlaceholders(translation, options);
	      }
	      return translation;
	    }
	    return lookupKey;
	  }
	  replacePlaceholders(translationString, options) {
	    const formatter = Intl.NumberFormat.supportedLocalesOf(this.locale).length ? new Intl.NumberFormat(this.locale) : undefined;
	    return translationString.replace(/%{(.\S+)}/g, function (placeholderWithBraces, placeholderKey) {
	      if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
	        const placeholderValue = options[placeholderKey];
	        if (placeholderValue === false || typeof placeholderValue !== 'number' && typeof placeholderValue !== 'string') {
	          return '';
	        }
	        if (typeof placeholderValue === 'number') {
	          return formatter ? formatter.format(placeholderValue) : `${placeholderValue}`;
	        }
	        return placeholderValue;
	      }
	      throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
	    });
	  }
	  hasIntlPluralRulesSupport() {
	    return Boolean('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
	  }
	  getPluralSuffix(lookupKey, count) {
	    count = Number(count);
	    if (!isFinite(count)) {
	      return 'other';
	    }
	    const translation = this.translations[lookupKey];
	    const preferredForm = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(count) : this.selectPluralFormUsingFallbackRules(count);
	    if (typeof translation === 'object') {
	      if (preferredForm in translation) {
	        return preferredForm;
	      } else if ('other' in translation) {
	        console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
	        return 'other';
	      }
	    }
	    throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
	  }
	  selectPluralFormUsingFallbackRules(count) {
	    count = Math.abs(Math.floor(count));
	    const ruleset = this.getPluralRulesForLocale();
	    if (ruleset) {
	      return I18n.pluralRules[ruleset](count);
	    }
	    return 'other';
	  }
	  getPluralRulesForLocale() {
	    const localeShort = this.locale.split('-')[0];
	    for (const pluralRule in I18n.pluralRulesMap) {
	      const languages = I18n.pluralRulesMap[pluralRule];
	      if (languages.includes(this.locale) || languages.includes(localeShort)) {
	        return pluralRule;
	      }
	    }
	  }
	}
	I18n.pluralRulesMap = {
	  arabic: ['ar'],
	  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
	  french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
	  german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
	  irish: ['ga'],
	  russian: ['ru', 'uk'],
	  scottish: ['gd'],
	  spanish: ['pt-PT', 'it', 'es'],
	  welsh: ['cy']
	};
	I18n.pluralRules = {
	  arabic(n) {
	    if (n === 0) {
	      return 'zero';
	    }
	    if (n === 1) {
	      return 'one';
	    }
	    if (n === 2) {
	      return 'two';
	    }
	    if (n % 100 >= 3 && n % 100 <= 10) {
	      return 'few';
	    }
	    if (n % 100 >= 11 && n % 100 <= 99) {
	      return 'many';
	    }
	    return 'other';
	  },
	  chinese() {
	    return 'other';
	  },
	  french(n) {
	    return n === 0 || n === 1 ? 'one' : 'other';
	  },
	  german(n) {
	    return n === 1 ? 'one' : 'other';
	  },
	  irish(n) {
	    if (n === 1) {
	      return 'one';
	    }
	    if (n === 2) {
	      return 'two';
	    }
	    if (n >= 3 && n <= 6) {
	      return 'few';
	    }
	    if (n >= 7 && n <= 10) {
	      return 'many';
	    }
	    return 'other';
	  },
	  russian(n) {
	    const lastTwo = n % 100;
	    const last = lastTwo % 10;
	    if (last === 1 && lastTwo !== 11) {
	      return 'one';
	    }
	    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
	      return 'few';
	    }
	    if (last === 0 || last >= 5 && last <= 9 || lastTwo >= 11 && lastTwo <= 14) {
	      return 'many';
	    }
	    return 'other';
	  },
	  scottish(n) {
	    if (n === 1 || n === 11) {
	      return 'one';
	    }
	    if (n === 2 || n === 12) {
	      return 'two';
	    }
	    if (n >= 3 && n <= 10 || n >= 13 && n <= 19) {
	      return 'few';
	    }
	    return 'other';
	  },
	  spanish(n) {
	    if (n === 1) {
	      return 'one';
	    }
	    if (n % 1000000 === 0 && n !== 0) {
	      return 'many';
	    }
	    return 'other';
	  },
	  welsh(n) {
	    if (n === 0) {
	      return 'zero';
	    }
	    if (n === 1) {
	      return 'one';
	    }
	    if (n === 2) {
	      return 'two';
	    }
	    if (n === 3) {
	      return 'few';
	    }
	    if (n === 6) {
	      return 'many';
	    }
	    return 'other';
	  }
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
	 * @preserve
	 */
	class Accordion extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for accordion
	   * @param {AccordionConfig} [config] - Accordion config
	   */
	  constructor($root, config = {}) {
	    super($root);
	    this.config = void 0;
	    this.i18n = void 0;
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
	    this.$sections = void 0;
	    this.$showAllButton = null;
	    this.$showAllIcon = null;
	    this.$showAllText = null;
	    this.config = mergeConfigs(Accordion.defaults, config, normaliseDataset(Accordion, this.$root.dataset));
	    this.i18n = new I18n(this.config.i18n);
	    const $sections = this.$root.querySelectorAll(`.${this.sectionClass}`);
	    if (!$sections.length) {
	      throw new ElementError({
	        component: Accordion,
	        identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
	      });
	    }
	    this.$sections = $sections;
	    this.initControls();
	    this.initSectionHeaders();
	    this.updateShowAllButton(this.areAllSectionsOpen());
	  }
	  initControls() {
	    this.$showAllButton = document.createElement('button');
	    this.$showAllButton.setAttribute('type', 'button');
	    this.$showAllButton.setAttribute('class', this.showAllClass);
	    this.$showAllButton.setAttribute('aria-expanded', 'false');
	    this.$showAllIcon = document.createElement('span');
	    this.$showAllIcon.classList.add(this.upChevronIconClass);
	    this.$showAllButton.appendChild(this.$showAllIcon);
	    const $accordionControls = document.createElement('div');
	    $accordionControls.setAttribute('class', this.controlsClass);
	    $accordionControls.appendChild(this.$showAllButton);
	    this.$root.insertBefore($accordionControls, this.$root.firstChild);
	    this.$showAllText = document.createElement('span');
	    this.$showAllText.classList.add(this.showAllTextClass);
	    this.$showAllButton.appendChild(this.$showAllText);
	    this.$showAllButton.addEventListener('click', () => this.onShowOrHideAllToggle());
	    if ('onbeforematch' in document) {
	      document.addEventListener('beforematch', event => this.onBeforeMatch(event));
	    }
	  }
	  initSectionHeaders() {
	    this.$sections.forEach(($section, i) => {
	      const $header = $section.querySelector(`.${this.sectionHeaderClass}`);
	      if (!$header) {
	        throw new ElementError({
	          component: Accordion,
	          identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
	        });
	      }
	      this.constructHeaderMarkup($header, i);
	      this.setExpanded(this.isExpanded($section), $section);
	      $header.addEventListener('click', () => this.onSectionToggle($section));
	      this.setInitialState($section);
	    });
	  }
	  constructHeaderMarkup($header, index) {
	    const $span = $header.querySelector(`.${this.sectionButtonClass}`);
	    const $heading = $header.querySelector(`.${this.sectionHeadingClass}`);
	    const $summary = $header.querySelector(`.${this.sectionSummaryClass}`);
	    if (!$heading) {
	      throw new ElementError({
	        component: Accordion,
	        identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
	      });
	    }
	    if (!$span) {
	      throw new ElementError({
	        component: Accordion,
	        identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
	      });
	    }
	    const $button = document.createElement('button');
	    $button.setAttribute('type', 'button');
	    $button.setAttribute('aria-controls', `${this.$root.id}-content-${index + 1}`);
	    for (const attr of Array.from($span.attributes)) {
	      if (attr.name !== 'id') {
	        $button.setAttribute(attr.name, attr.value);
	      }
	    }
	    const $headingText = document.createElement('span');
	    $headingText.classList.add(this.sectionHeadingTextClass);
	    $headingText.id = $span.id;
	    const $headingTextFocus = document.createElement('span');
	    $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
	    $headingText.appendChild($headingTextFocus);
	    Array.from($span.childNodes).forEach($child => $headingTextFocus.appendChild($child));
	    const $showHideToggle = document.createElement('span');
	    $showHideToggle.classList.add(this.sectionShowHideToggleClass);
	    $showHideToggle.setAttribute('data-nosnippet', '');
	    const $showHideToggleFocus = document.createElement('span');
	    $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
	    $showHideToggle.appendChild($showHideToggleFocus);
	    const $showHideText = document.createElement('span');
	    const $showHideIcon = document.createElement('span');
	    $showHideIcon.classList.add(this.upChevronIconClass);
	    $showHideToggleFocus.appendChild($showHideIcon);
	    $showHideText.classList.add(this.sectionShowHideTextClass);
	    $showHideToggleFocus.appendChild($showHideText);
	    $button.appendChild($headingText);
	    $button.appendChild(this.getButtonPunctuationEl());
	    if ($summary) {
	      const $summarySpan = document.createElement('span');
	      const $summarySpanFocus = document.createElement('span');
	      $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
	      $summarySpan.appendChild($summarySpanFocus);
	      for (const attr of Array.from($summary.attributes)) {
	        $summarySpan.setAttribute(attr.name, attr.value);
	      }
	      Array.from($summary.childNodes).forEach($child => $summarySpanFocus.appendChild($child));
	      $summary.remove();
	      $button.appendChild($summarySpan);
	      $button.appendChild(this.getButtonPunctuationEl());
	    }
	    $button.appendChild($showHideToggle);
	    $heading.removeChild($span);
	    $heading.appendChild($button);
	  }
	  onBeforeMatch(event) {
	    const $fragment = event.target;
	    if (!($fragment instanceof Element)) {
	      return;
	    }
	    const $section = $fragment.closest(`.${this.sectionClass}`);
	    if ($section) {
	      this.setExpanded(true, $section);
	    }
	  }
	  onSectionToggle($section) {
	    const nowExpanded = !this.isExpanded($section);
	    this.setExpanded(nowExpanded, $section);
	    this.storeState($section, nowExpanded);
	  }
	  onShowOrHideAllToggle() {
	    const nowExpanded = !this.areAllSectionsOpen();
	    this.$sections.forEach($section => {
	      this.setExpanded(nowExpanded, $section);
	      this.storeState($section, nowExpanded);
	    });
	    this.updateShowAllButton(nowExpanded);
	  }
	  setExpanded(expanded, $section) {
	    const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
	    const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
	    const $button = $section.querySelector(`.${this.sectionButtonClass}`);
	    const $content = $section.querySelector(`.${this.sectionContentClass}`);
	    if (!$content) {
	      throw new ElementError({
	        component: Accordion,
	        identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
	      });
	    }
	    if (!$showHideIcon || !$showHideText || !$button) {
	      return;
	    }
	    const newButtonText = expanded ? this.i18n.t('hideSection') : this.i18n.t('showSection');
	    $showHideText.textContent = newButtonText;
	    $button.setAttribute('aria-expanded', `${expanded}`);
	    const ariaLabelParts = [];
	    const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
	    if ($headingText) {
	      ariaLabelParts.push(`${$headingText.textContent}`.trim());
	    }
	    const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
	    if ($summary) {
	      ariaLabelParts.push(`${$summary.textContent}`.trim());
	    }
	    const ariaLabelMessage = expanded ? this.i18n.t('hideSectionAriaLabel') : this.i18n.t('showSectionAriaLabel');
	    ariaLabelParts.push(ariaLabelMessage);
	    $button.setAttribute('aria-label', ariaLabelParts.join(' , '));
	    if (expanded) {
	      $content.removeAttribute('hidden');
	      $section.classList.add(this.sectionExpandedClass);
	      $showHideIcon.classList.remove(this.downChevronIconClass);
	    } else {
	      $content.setAttribute('hidden', 'until-found');
	      $section.classList.remove(this.sectionExpandedClass);
	      $showHideIcon.classList.add(this.downChevronIconClass);
	    }
	    this.updateShowAllButton(this.areAllSectionsOpen());
	  }
	  isExpanded($section) {
	    return $section.classList.contains(this.sectionExpandedClass);
	  }
	  areAllSectionsOpen() {
	    return Array.from(this.$sections).every($section => this.isExpanded($section));
	  }
	  updateShowAllButton(expanded) {
	    if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
	      return;
	    }
	    this.$showAllButton.setAttribute('aria-expanded', expanded.toString());
	    this.$showAllText.textContent = expanded ? this.i18n.t('hideAllSections') : this.i18n.t('showAllSections');
	    this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded);
	  }

	  /**
	   * Get the identifier for a section
	   *
	   * We need a unique way of identifying each content in the Accordion.
	   * Since an `#id` should be unique and an `id` is required for `aria-`
	   * attributes `id` can be safely used.
	   *
	   * @param {Element} $section - Section element
	   * @returns {string | undefined | null} Identifier for section
	   */
	  getIdentifier($section) {
	    const $button = $section.querySelector(`.${this.sectionButtonClass}`);
	    return $button == null ? void 0 : $button.getAttribute('aria-controls');
	  }
	  storeState($section, isExpanded) {
	    if (!this.config.rememberExpanded) {
	      return;
	    }
	    const id = this.getIdentifier($section);
	    if (id) {
	      try {
	        window.sessionStorage.setItem(id, isExpanded.toString());
	      } catch (exception) {}
	    }
	  }
	  setInitialState($section) {
	    if (!this.config.rememberExpanded) {
	      return;
	    }
	    const id = this.getIdentifier($section);
	    if (id) {
	      try {
	        const state = window.sessionStorage.getItem(id);
	        if (state !== null) {
	          this.setExpanded(state === 'true', $section);
	        }
	      } catch (exception) {}
	    }
	  }
	  getButtonPunctuationEl() {
	    const $punctuationEl = document.createElement('span');
	    $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
	    $punctuationEl.textContent = ', ';
	    return $punctuationEl;
	  }
	}

	/**
	 * Accordion config
	 *
	 * @see {@link Accordion.defaults}
	 * @typedef {object} AccordionConfig
	 * @property {AccordionTranslations} [i18n=Accordion.defaults.i18n] - Accordion translations
	 * @property {boolean} [rememberExpanded] - Whether the expanded and collapsed
	 *   state of each section is remembered and restored when navigating.
	 */

	/**
	 * Accordion translations
	 *
	 * @see {@link Accordion.defaults.i18n}
	 * @typedef {object} AccordionTranslations
	 *
	 * Messages used by the component for the labels of its buttons. This includes
	 * the visible text shown on screen, and text to help assistive technology users
	 * for the buttons toggling each section.
	 * @property {string} [hideAllSections] - The text content for the 'Hide all
	 *   sections' button, used when at least one section is expanded.
	 * @property {string} [hideSection] - The text content for the 'Hide'
	 *   button, used when a section is expanded.
	 * @property {string} [hideSectionAriaLabel] - The text content appended to the
	 *   'Hide' button's accessible name when a section is expanded.
	 * @property {string} [showAllSections] - The text content for the 'Show all
	 *   sections' button, used when all sections are collapsed.
	 * @property {string} [showSection] - The text content for the 'Show'
	 *   button, used when a section is collapsed.
	 * @property {string} [showSectionAriaLabel] - The text content appended to the
	 *   'Show' button's accessible name when a section is expanded.
	 */

	/**
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 */
	Accordion.moduleName = 'govuk-accordion';
	Accordion.defaults = Object.freeze({
	  i18n: {
	    hideAllSections: 'Hide all sections',
	    hideSection: 'Hide',
	    hideSectionAriaLabel: 'Hide this section',
	    showAllSections: 'Show all sections',
	    showSection: 'Show',
	    showSectionAriaLabel: 'Show this section'
	  },
	  rememberExpanded: true
	});
	Accordion.schema = Object.freeze({
	  properties: {
	    i18n: {
	      type: 'object'
	    },
	    rememberExpanded: {
	      type: 'boolean'
	    }
	  }
	});

	const DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

	/**
	 * JavaScript enhancements for the Button component
	 *
	 * @preserve
	 */
	class Button extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for button
	   * @param {ButtonConfig} [config] - Button config
	   */
	  constructor($root, config = {}) {
	    super($root);
	    this.config = void 0;
	    this.debounceFormSubmitTimer = null;
	    this.config = mergeConfigs(Button.defaults, config, normaliseDataset(Button, this.$root.dataset));
	    this.$root.addEventListener('keydown', event => this.handleKeyDown(event));
	    this.$root.addEventListener('click', event => this.debounce(event));
	  }
	  handleKeyDown(event) {
	    const $target = event.target;
	    if (event.key !== ' ') {
	      return;
	    }
	    if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
	      event.preventDefault();
	      $target.click();
	    }
	  }
	  debounce(event) {
	    if (!this.config.preventDoubleClick) {
	      return;
	    }
	    if (this.debounceFormSubmitTimer) {
	      event.preventDefault();
	      return false;
	    }
	    this.debounceFormSubmitTimer = window.setTimeout(() => {
	      this.debounceFormSubmitTimer = null;
	    }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
	  }
	}

	/**
	 * Button config
	 *
	 * @typedef {object} ButtonConfig
	 * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
	 *   clicks on submit buttons from submitting forms multiple times.
	 */

	/**
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 */
	Button.moduleName = 'govuk-button';
	Button.defaults = Object.freeze({
	  preventDoubleClick: false
	});
	Button.schema = Object.freeze({
	  properties: {
	    preventDoubleClick: {
	      type: 'boolean'
	    }
	  }
	});

	function closestAttributeValue($element, attributeName) {
	  const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
	  return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
	}

	/**
	 * Character count component
	 *
	 * Tracks the number of characters or words in the `.govuk-js-character-count`
	 * `<textarea>` inside the element. Displays a message with the remaining number
	 * of characters/words available, or the number of characters/words in excess.
	 *
	 * You can configure the message to only appear after a certain percentage
	 * of the available characters/words has been entered.
	 *
	 * @preserve
	 */
	class CharacterCount extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for character count
	   * @param {CharacterCountConfig} [config] - Character count config
	   */
	  constructor($root, config = {}) {
	    var _ref, _this$config$maxwords;
	    super($root);
	    this.$textarea = void 0;
	    this.$visibleCountMessage = void 0;
	    this.$screenReaderCountMessage = void 0;
	    this.lastInputTimestamp = null;
	    this.lastInputValue = '';
	    this.valueChecker = null;
	    this.config = void 0;
	    this.i18n = void 0;
	    this.maxLength = void 0;
	    const $textarea = this.$root.querySelector('.govuk-js-character-count');
	    if (!($textarea instanceof HTMLTextAreaElement || $textarea instanceof HTMLInputElement)) {
	      throw new ElementError({
	        component: CharacterCount,
	        element: $textarea,
	        expectedType: 'HTMLTextareaElement or HTMLInputElement',
	        identifier: 'Form field (`.govuk-js-character-count`)'
	      });
	    }
	    const datasetConfig = normaliseDataset(CharacterCount, this.$root.dataset);
	    let configOverrides = {};
	    if ('maxwords' in datasetConfig || 'maxlength' in datasetConfig) {
	      configOverrides = {
	        maxlength: undefined,
	        maxwords: undefined
	      };
	    }
	    this.config = mergeConfigs(CharacterCount.defaults, config, configOverrides, datasetConfig);
	    const errors = validateConfig(CharacterCount.schema, this.config);
	    if (errors[0]) {
	      throw new ConfigError(formatErrorMessage(CharacterCount, errors[0]));
	    }
	    this.i18n = new I18n(this.config.i18n, {
	      locale: closestAttributeValue(this.$root, 'lang')
	    });
	    this.maxLength = (_ref = (_this$config$maxwords = this.config.maxwords) != null ? _this$config$maxwords : this.config.maxlength) != null ? _ref : Infinity;
	    this.$textarea = $textarea;
	    const textareaDescriptionId = `${this.$textarea.id}-info`;
	    const $textareaDescription = document.getElementById(textareaDescriptionId);
	    if (!$textareaDescription) {
	      throw new ElementError({
	        component: CharacterCount,
	        element: $textareaDescription,
	        identifier: `Count message (\`id="${textareaDescriptionId}"\`)`
	      });
	    }
	    if (`${$textareaDescription.textContent}`.match(/^\s*$/)) {
	      $textareaDescription.textContent = this.i18n.t('textareaDescription', {
	        count: this.maxLength
	      });
	    }
	    this.$textarea.insertAdjacentElement('afterend', $textareaDescription);
	    const $screenReaderCountMessage = document.createElement('div');
	    $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden';
	    $screenReaderCountMessage.setAttribute('aria-live', 'polite');
	    this.$screenReaderCountMessage = $screenReaderCountMessage;
	    $textareaDescription.insertAdjacentElement('afterend', $screenReaderCountMessage);
	    const $visibleCountMessage = document.createElement('div');
	    $visibleCountMessage.className = $textareaDescription.className;
	    $visibleCountMessage.classList.add('govuk-character-count__status');
	    $visibleCountMessage.setAttribute('aria-hidden', 'true');
	    this.$visibleCountMessage = $visibleCountMessage;
	    $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage);
	    $textareaDescription.classList.add('govuk-visually-hidden');
	    this.$textarea.removeAttribute('maxlength');
	    this.bindChangeEvents();
	    window.addEventListener('pageshow', () => this.updateCountMessage());
	    this.updateCountMessage();
	  }
	  bindChangeEvents() {
	    this.$textarea.addEventListener('keyup', () => this.handleKeyUp());
	    this.$textarea.addEventListener('focus', () => this.handleFocus());
	    this.$textarea.addEventListener('blur', () => this.handleBlur());
	  }
	  handleKeyUp() {
	    this.updateVisibleCountMessage();
	    this.lastInputTimestamp = Date.now();
	  }
	  handleFocus() {
	    this.valueChecker = window.setInterval(() => {
	      if (!this.lastInputTimestamp || Date.now() - 500 >= this.lastInputTimestamp) {
	        this.updateIfValueChanged();
	      }
	    }, 1000);
	  }
	  handleBlur() {
	    if (this.valueChecker) {
	      window.clearInterval(this.valueChecker);
	    }
	  }
	  updateIfValueChanged() {
	    if (this.$textarea.value !== this.lastInputValue) {
	      this.lastInputValue = this.$textarea.value;
	      this.updateCountMessage();
	    }
	  }
	  updateCountMessage() {
	    this.updateVisibleCountMessage();
	    this.updateScreenReaderCountMessage();
	  }
	  updateVisibleCountMessage() {
	    const remainingNumber = this.maxLength - this.count(this.$textarea.value);
	    const isError = remainingNumber < 0;
	    this.$visibleCountMessage.classList.toggle('govuk-character-count__message--disabled', !this.isOverThreshold());
	    this.$textarea.classList.toggle('govuk-textarea--error', isError);
	    this.$visibleCountMessage.classList.toggle('govuk-error-message', isError);
	    this.$visibleCountMessage.classList.toggle('govuk-hint', !isError);
	    this.$visibleCountMessage.textContent = this.getCountMessage();
	  }
	  updateScreenReaderCountMessage() {
	    if (this.isOverThreshold()) {
	      this.$screenReaderCountMessage.removeAttribute('aria-hidden');
	    } else {
	      this.$screenReaderCountMessage.setAttribute('aria-hidden', 'true');
	    }
	    this.$screenReaderCountMessage.textContent = this.getCountMessage();
	  }
	  count(text) {
	    if (this.config.maxwords) {
	      var _text$match;
	      const tokens = (_text$match = text.match(/\S+/g)) != null ? _text$match : [];
	      return tokens.length;
	    }
	    return text.length;
	  }
	  getCountMessage() {
	    const remainingNumber = this.maxLength - this.count(this.$textarea.value);
	    const countType = this.config.maxwords ? 'words' : 'characters';
	    return this.formatCountMessage(remainingNumber, countType);
	  }
	  formatCountMessage(remainingNumber, countType) {
	    if (remainingNumber === 0) {
	      return this.i18n.t(`${countType}AtLimit`);
	    }
	    const translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit';
	    return this.i18n.t(`${countType}${translationKeySuffix}`, {
	      count: Math.abs(remainingNumber)
	    });
	  }
	  isOverThreshold() {
	    if (!this.config.threshold) {
	      return true;
	    }
	    const currentLength = this.count(this.$textarea.value);
	    const maxLength = this.maxLength;
	    const thresholdValue = maxLength * this.config.threshold / 100;
	    return thresholdValue <= currentLength;
	  }
	}

	/**
	 * Character count config
	 *
	 * @see {@link CharacterCount.defaults}
	 * @typedef {object} CharacterCountConfig
	 * @property {number} [maxlength] - The maximum number of characters.
	 *   If maxwords is provided, the maxlength option will be ignored.
	 * @property {number} [maxwords] - The maximum number of words. If maxwords is
	 *   provided, the maxlength option will be ignored.
	 * @property {number} [threshold=0] - The percentage value of the limit at
	 *   which point the count message is displayed. If this attribute is set, the
	 *   count message will be hidden by default.
	 * @property {CharacterCountTranslations} [i18n=CharacterCount.defaults.i18n] - Character count translations
	 */

	/**
	 * Character count translations
	 *
	 * @see {@link CharacterCount.defaults.i18n}
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
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
	 */
	CharacterCount.moduleName = 'govuk-character-count';
	CharacterCount.defaults = Object.freeze({
	  threshold: 0,
	  i18n: {
	    charactersUnderLimit: {
	      one: 'You have %{count} character remaining',
	      other: 'You have %{count} characters remaining'
	    },
	    charactersAtLimit: 'You have 0 characters remaining',
	    charactersOverLimit: {
	      one: 'You have %{count} character too many',
	      other: 'You have %{count} characters too many'
	    },
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
	  }
	});
	CharacterCount.schema = Object.freeze({
	  properties: {
	    i18n: {
	      type: 'object'
	    },
	    maxwords: {
	      type: 'number'
	    },
	    maxlength: {
	      type: 'number'
	    },
	    threshold: {
	      type: 'number'
	    }
	  },
	  anyOf: [{
	    required: ['maxwords'],
	    errorMessage: 'Either "maxlength" or "maxwords" must be provided'
	  }, {
	    required: ['maxlength'],
	    errorMessage: 'Either "maxlength" or "maxwords" must be provided'
	  }]
	});

	/**
	 * Checkboxes component
	 *
	 * @preserve
	 */
	class Checkboxes extends GOVUKFrontendComponent {
	  /**
	   * Checkboxes can be associated with a 'conditionally revealed' content block
	   * – for example, a checkbox for 'Phone' could reveal an additional form field
	   * for the user to enter their phone number.
	   *
	   * These associations are made using a `data-aria-controls` attribute, which
	   * is promoted to an aria-controls attribute during initialisation.
	   *
	   * We also need to restore the state of any conditional reveals on the page
	   * (for example if the user has navigated back), and set up event handlers to
	   * keep the reveal in sync with the checkbox state.
	   *
	   * @param {Element | null} $root - HTML element to use for checkboxes
	   */
	  constructor($root) {
	    super($root);
	    this.$inputs = void 0;
	    const $inputs = this.$root.querySelectorAll('input[type="checkbox"]');
	    if (!$inputs.length) {
	      throw new ElementError({
	        component: Checkboxes,
	        identifier: 'Form inputs (`<input type="checkbox">`)'
	      });
	    }
	    this.$inputs = $inputs;
	    this.$inputs.forEach($input => {
	      const targetId = $input.getAttribute('data-aria-controls');
	      if (!targetId) {
	        return;
	      }
	      if (!document.getElementById(targetId)) {
	        throw new ElementError({
	          component: Checkboxes,
	          identifier: `Conditional reveal (\`id="${targetId}"\`)`
	        });
	      }
	      $input.setAttribute('aria-controls', targetId);
	      $input.removeAttribute('data-aria-controls');
	    });
	    window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
	    this.syncAllConditionalReveals();
	    this.$root.addEventListener('click', event => this.handleClick(event));
	  }
	  syncAllConditionalReveals() {
	    this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
	  }
	  syncConditionalRevealWithInputState($input) {
	    const targetId = $input.getAttribute('aria-controls');
	    if (!targetId) {
	      return;
	    }
	    const $target = document.getElementById(targetId);
	    if ($target != null && $target.classList.contains('govuk-checkboxes__conditional')) {
	      const inputIsChecked = $input.checked;
	      $input.setAttribute('aria-expanded', inputIsChecked.toString());
	      $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
	    }
	  }
	  unCheckAllInputsExcept($input) {
	    const allInputsWithSameName = document.querySelectorAll(`input[type="checkbox"][name="${$input.name}"]`);
	    allInputsWithSameName.forEach($inputWithSameName => {
	      const hasSameFormOwner = $input.form === $inputWithSameName.form;
	      if (hasSameFormOwner && $inputWithSameName !== $input) {
	        $inputWithSameName.checked = false;
	        this.syncConditionalRevealWithInputState($inputWithSameName);
	      }
	    });
	  }
	  unCheckExclusiveInputs($input) {
	    const allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(`input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`);
	    allInputsWithSameNameAndExclusiveBehaviour.forEach($exclusiveInput => {
	      const hasSameFormOwner = $input.form === $exclusiveInput.form;
	      if (hasSameFormOwner) {
	        $exclusiveInput.checked = false;
	        this.syncConditionalRevealWithInputState($exclusiveInput);
	      }
	    });
	  }
	  handleClick(event) {
	    const $clickedInput = event.target;
	    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
	      return;
	    }
	    const hasAriaControls = $clickedInput.getAttribute('aria-controls');
	    if (hasAriaControls) {
	      this.syncConditionalRevealWithInputState($clickedInput);
	    }
	    if (!$clickedInput.checked) {
	      return;
	    }
	    const hasBehaviourExclusive = $clickedInput.getAttribute('data-behaviour') === 'exclusive';
	    if (hasBehaviourExclusive) {
	      this.unCheckAllInputsExcept($clickedInput);
	    } else {
	      this.unCheckExclusiveInputs($clickedInput);
	    }
	  }
	}
	Checkboxes.moduleName = 'govuk-checkboxes';

	/**
	 * Error summary component
	 *
	 * Takes focus on initialisation for accessible announcement, unless disabled in
	 * configuration.
	 *
	 * @preserve
	 */
	class ErrorSummary extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for error summary
	   * @param {ErrorSummaryConfig} [config] - Error summary config
	   */
	  constructor($root, config = {}) {
	    super($root);
	    this.config = void 0;
	    this.config = mergeConfigs(ErrorSummary.defaults, config, normaliseDataset(ErrorSummary, this.$root.dataset));
	    if (!this.config.disableAutoFocus) {
	      setFocus(this.$root);
	    }
	    this.$root.addEventListener('click', event => this.handleClick(event));
	  }
	  handleClick(event) {
	    const $target = event.target;
	    if ($target && this.focusTarget($target)) {
	      event.preventDefault();
	    }
	  }
	  focusTarget($target) {
	    if (!($target instanceof HTMLAnchorElement)) {
	      return false;
	    }
	    const inputId = getFragmentFromUrl($target.href);
	    if (!inputId) {
	      return false;
	    }
	    const $input = document.getElementById(inputId);
	    if (!$input) {
	      return false;
	    }
	    const $legendOrLabel = this.getAssociatedLegendOrLabel($input);
	    if (!$legendOrLabel) {
	      return false;
	    }
	    $legendOrLabel.scrollIntoView();
	    $input.focus({
	      preventScroll: true
	    });
	    return true;
	  }
	  getAssociatedLegendOrLabel($input) {
	    var _document$querySelect;
	    const $fieldset = $input.closest('fieldset');
	    if ($fieldset) {
	      const $legends = $fieldset.getElementsByTagName('legend');
	      if ($legends.length) {
	        const $candidateLegend = $legends[0];
	        if ($input instanceof HTMLInputElement && ($input.type === 'checkbox' || $input.type === 'radio')) {
	          return $candidateLegend;
	        }
	        const legendTop = $candidateLegend.getBoundingClientRect().top;
	        const inputRect = $input.getBoundingClientRect();
	        if (inputRect.height && window.innerHeight) {
	          const inputBottom = inputRect.top + inputRect.height;
	          if (inputBottom - legendTop < window.innerHeight / 2) {
	            return $candidateLegend;
	          }
	        }
	      }
	    }
	    return (_document$querySelect = document.querySelector(`label[for='${$input.getAttribute('id')}']`)) != null ? _document$querySelect : $input.closest('label');
	  }
	}

	/**
	 * Error summary config
	 *
	 * @typedef {object} ErrorSummaryConfig
	 * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
	 *   summary will not be focussed when the page loads.
	 */

	/**
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 */
	ErrorSummary.moduleName = 'govuk-error-summary';
	ErrorSummary.defaults = Object.freeze({
	  disableAutoFocus: false
	});
	ErrorSummary.schema = Object.freeze({
	  properties: {
	    disableAutoFocus: {
	      type: 'boolean'
	    }
	  }
	});

	/**
	 * Exit this page component
	 *
	 * @preserve
	 */
	class ExitThisPage extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element that wraps the Exit This Page button
	   * @param {ExitThisPageConfig} [config] - Exit This Page config
	   */
	  constructor($root, config = {}) {
	    super($root);
	    this.config = void 0;
	    this.i18n = void 0;
	    this.$button = void 0;
	    this.$skiplinkButton = null;
	    this.$updateSpan = null;
	    this.$indicatorContainer = null;
	    this.$overlay = null;
	    this.keypressCounter = 0;
	    this.lastKeyWasModified = false;
	    this.timeoutTime = 5000;
	    this.keypressTimeoutId = null;
	    this.timeoutMessageId = null;
	    const $button = this.$root.querySelector('.govuk-exit-this-page__button');
	    if (!($button instanceof HTMLAnchorElement)) {
	      throw new ElementError({
	        component: ExitThisPage,
	        element: $button,
	        expectedType: 'HTMLAnchorElement',
	        identifier: 'Button (`.govuk-exit-this-page__button`)'
	      });
	    }
	    this.config = mergeConfigs(ExitThisPage.defaults, config, normaliseDataset(ExitThisPage, this.$root.dataset));
	    this.i18n = new I18n(this.config.i18n);
	    this.$button = $button;
	    const $skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');
	    if ($skiplinkButton instanceof HTMLAnchorElement) {
	      this.$skiplinkButton = $skiplinkButton;
	    }
	    this.buildIndicator();
	    this.initUpdateSpan();
	    this.initButtonClickHandler();
	    if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
	      document.addEventListener('keyup', this.handleKeypress.bind(this), true);
	      document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
	    }
	    window.addEventListener('pageshow', this.resetPage.bind(this));
	  }
	  initUpdateSpan() {
	    this.$updateSpan = document.createElement('span');
	    this.$updateSpan.setAttribute('role', 'status');
	    this.$updateSpan.className = 'govuk-visually-hidden';
	    this.$root.appendChild(this.$updateSpan);
	  }
	  initButtonClickHandler() {
	    this.$button.addEventListener('click', this.handleClick.bind(this));
	    if (this.$skiplinkButton) {
	      this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
	    }
	  }
	  buildIndicator() {
	    this.$indicatorContainer = document.createElement('div');
	    this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
	    this.$indicatorContainer.setAttribute('aria-hidden', 'true');
	    for (let i = 0; i < 3; i++) {
	      const $indicator = document.createElement('div');
	      $indicator.className = 'govuk-exit-this-page__indicator-light';
	      this.$indicatorContainer.appendChild($indicator);
	    }
	    this.$button.appendChild(this.$indicatorContainer);
	  }
	  updateIndicator() {
	    if (!this.$indicatorContainer) {
	      return;
	    }
	    this.$indicatorContainer.classList.toggle('govuk-exit-this-page__indicator--visible', this.keypressCounter > 0);
	    const $indicators = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light');
	    $indicators.forEach(($indicator, index) => {
	      $indicator.classList.toggle('govuk-exit-this-page__indicator-light--on', index < this.keypressCounter);
	    });
	  }
	  exitPage() {
	    if (!this.$updateSpan) {
	      return;
	    }
	    this.$updateSpan.textContent = '';
	    document.body.classList.add('govuk-exit-this-page-hide-content');
	    this.$overlay = document.createElement('div');
	    this.$overlay.className = 'govuk-exit-this-page-overlay';
	    this.$overlay.setAttribute('role', 'alert');
	    document.body.appendChild(this.$overlay);
	    this.$overlay.textContent = this.i18n.t('activated');
	    window.location.href = this.$button.href;
	  }
	  handleClick(event) {
	    event.preventDefault();
	    this.exitPage();
	  }
	  handleKeypress(event) {
	    if (!this.$updateSpan) {
	      return;
	    }
	    if (event.key === 'Shift' && !this.lastKeyWasModified) {
	      this.keypressCounter += 1;
	      this.updateIndicator();
	      if (this.timeoutMessageId) {
	        window.clearTimeout(this.timeoutMessageId);
	        this.timeoutMessageId = null;
	      }
	      if (this.keypressCounter >= 3) {
	        this.keypressCounter = 0;
	        if (this.keypressTimeoutId) {
	          window.clearTimeout(this.keypressTimeoutId);
	          this.keypressTimeoutId = null;
	        }
	        this.exitPage();
	      } else {
	        if (this.keypressCounter === 1) {
	          this.$updateSpan.textContent = this.i18n.t('pressTwoMoreTimes');
	        } else {
	          this.$updateSpan.textContent = this.i18n.t('pressOneMoreTime');
	        }
	      }
	      this.setKeypressTimer();
	    } else if (this.keypressTimeoutId) {
	      this.resetKeypressTimer();
	    }
	    this.lastKeyWasModified = event.shiftKey;
	  }
	  setKeypressTimer() {
	    if (this.keypressTimeoutId) {
	      window.clearTimeout(this.keypressTimeoutId);
	    }
	    this.keypressTimeoutId = window.setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime);
	  }
	  resetKeypressTimer() {
	    if (!this.$updateSpan) {
	      return;
	    }
	    if (this.keypressTimeoutId) {
	      window.clearTimeout(this.keypressTimeoutId);
	      this.keypressTimeoutId = null;
	    }
	    const $updateSpan = this.$updateSpan;
	    this.keypressCounter = 0;
	    $updateSpan.textContent = this.i18n.t('timedOut');
	    this.timeoutMessageId = window.setTimeout(() => {
	      $updateSpan.textContent = '';
	    }, this.timeoutTime);
	    this.updateIndicator();
	  }
	  resetPage() {
	    document.body.classList.remove('govuk-exit-this-page-hide-content');
	    if (this.$overlay) {
	      this.$overlay.remove();
	      this.$overlay = null;
	    }
	    if (this.$updateSpan) {
	      this.$updateSpan.setAttribute('role', 'status');
	      this.$updateSpan.textContent = '';
	    }
	    this.updateIndicator();
	    if (this.keypressTimeoutId) {
	      window.clearTimeout(this.keypressTimeoutId);
	    }
	    if (this.timeoutMessageId) {
	      window.clearTimeout(this.timeoutMessageId);
	    }
	  }
	}

	/**
	 * Exit this Page config
	 *
	 * @see {@link ExitThisPage.defaults}
	 * @typedef {object} ExitThisPageConfig
	 * @property {ExitThisPageTranslations} [i18n=ExitThisPage.defaults.i18n] - Exit this page translations
	 */

	/**
	 * Exit this Page translations
	 *
	 * @see {@link ExitThisPage.defaults.i18n}
	 * @typedef {object} ExitThisPageTranslations
	 *
	 * Messages used by the component programatically inserted text, including
	 * overlay text and screen reader announcements.
	 * @property {string} [activated] - Screen reader announcement for when EtP
	 *   keypress functionality has been successfully activated.
	 * @property {string} [timedOut] - Screen reader announcement for when the EtP
	 *   keypress functionality has timed out.
	 * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
	 *   the user they must press the activation key two more times.
	 * @property {string} [pressOneMoreTime] - Screen reader announcement informing
	 *   the user they must press the activation key one more time.
	 */

	/**
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 */
	ExitThisPage.moduleName = 'govuk-exit-this-page';
	ExitThisPage.defaults = Object.freeze({
	  i18n: {
	    activated: 'Loading.',
	    timedOut: 'Exit this page expired.',
	    pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
	    pressOneMoreTime: 'Shift, press 1 more time to exit.'
	  }
	});
	ExitThisPage.schema = Object.freeze({
	  properties: {
	    i18n: {
	      type: 'object'
	    }
	  }
	});

	/**
	 * Header component
	 *
	 * @preserve
	 */
	class Header extends GOVUKFrontendComponent {
	  /**
	   * Apply a matchMedia for desktop which will trigger a state sync if the
	   * browser viewport moves between states.
	   *
	   * @param {Element | null} $root - HTML element to use for header
	   */
	  constructor($root) {
	    super($root);
	    this.$menuButton = void 0;
	    this.$menu = void 0;
	    this.menuIsOpen = false;
	    this.mql = null;
	    const $menuButton = this.$root.querySelector('.govuk-js-header-toggle');
	    if (!$menuButton) {
	      return this;
	    }
	    const menuId = $menuButton.getAttribute('aria-controls');
	    if (!menuId) {
	      throw new ElementError({
	        component: Header,
	        identifier: 'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
	      });
	    }
	    const $menu = document.getElementById(menuId);
	    if (!$menu) {
	      throw new ElementError({
	        component: Header,
	        element: $menu,
	        identifier: `Navigation (\`<ul id="${menuId}">\`)`
	      });
	    }
	    this.$menu = $menu;
	    this.$menuButton = $menuButton;
	    this.setupResponsiveChecks();
	    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
	  }
	  setupResponsiveChecks() {
	    const breakpoint = getBreakpoint('desktop');
	    if (!breakpoint.value) {
	      throw new ElementError({
	        component: Header,
	        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
	      });
	    }
	    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
	    if ('addEventListener' in this.mql) {
	      this.mql.addEventListener('change', () => this.checkMode());
	    } else {
	      this.mql.addListener(() => this.checkMode());
	    }
	    this.checkMode();
	  }
	  checkMode() {
	    if (!this.mql || !this.$menu || !this.$menuButton) {
	      return;
	    }
	    if (this.mql.matches) {
	      this.$menu.removeAttribute('hidden');
	      this.$menuButton.setAttribute('hidden', '');
	    } else {
	      this.$menuButton.removeAttribute('hidden');
	      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
	      if (this.menuIsOpen) {
	        this.$menu.removeAttribute('hidden');
	      } else {
	        this.$menu.setAttribute('hidden', '');
	      }
	    }
	  }
	  handleMenuButtonClick() {
	    this.menuIsOpen = !this.menuIsOpen;
	    this.checkMode();
	  }
	}
	Header.moduleName = 'govuk-header';

	/**
	 * Notification Banner component
	 *
	 * @preserve
	 */
	class NotificationBanner extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for notification banner
	   * @param {NotificationBannerConfig} [config] - Notification banner config
	   */
	  constructor($root, config = {}) {
	    super($root);
	    this.config = void 0;
	    this.config = mergeConfigs(NotificationBanner.defaults, config, normaliseDataset(NotificationBanner, this.$root.dataset));
	    if (this.$root.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
	      setFocus(this.$root);
	    }
	  }
	}

	/**
	 * Notification banner config
	 *
	 * @typedef {object} NotificationBannerConfig
	 * @property {boolean} [disableAutoFocus=false] - If set to `true` the
	 *   notification banner will not be focussed when the page loads. This only
	 *   applies if the component has a `role` of `alert` – in other cases the
	 *   component will not be focused on page load, regardless of this option.
	 */

	/**
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 */
	NotificationBanner.moduleName = 'govuk-notification-banner';
	NotificationBanner.defaults = Object.freeze({
	  disableAutoFocus: false
	});
	NotificationBanner.schema = Object.freeze({
	  properties: {
	    disableAutoFocus: {
	      type: 'boolean'
	    }
	  }
	});

	/**
	 * Password input component
	 *
	 * @preserve
	 */
	class PasswordInput extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for password input
	   * @param {PasswordInputConfig} [config] - Password input config
	   */
	  constructor($root, config = {}) {
	    super($root);
	    this.config = void 0;
	    this.i18n = void 0;
	    this.$input = void 0;
	    this.$showHideButton = void 0;
	    this.$screenReaderStatusMessage = void 0;
	    const $input = this.$root.querySelector('.govuk-js-password-input-input');
	    if (!($input instanceof HTMLInputElement)) {
	      throw new ElementError({
	        component: PasswordInput,
	        element: $input,
	        expectedType: 'HTMLInputElement',
	        identifier: 'Form field (`.govuk-js-password-input-input`)'
	      });
	    }
	    if ($input.type !== 'password') {
	      throw new ElementError('Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.');
	    }
	    const $showHideButton = this.$root.querySelector('.govuk-js-password-input-toggle');
	    if (!($showHideButton instanceof HTMLButtonElement)) {
	      throw new ElementError({
	        component: PasswordInput,
	        element: $showHideButton,
	        expectedType: 'HTMLButtonElement',
	        identifier: 'Button (`.govuk-js-password-input-toggle`)'
	      });
	    }
	    if ($showHideButton.type !== 'button') {
	      throw new ElementError('Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.');
	    }
	    this.$input = $input;
	    this.$showHideButton = $showHideButton;
	    this.config = mergeConfigs(PasswordInput.defaults, config, normaliseDataset(PasswordInput, this.$root.dataset));
	    this.i18n = new I18n(this.config.i18n, {
	      locale: closestAttributeValue(this.$root, 'lang')
	    });
	    this.$showHideButton.removeAttribute('hidden');
	    const $screenReaderStatusMessage = document.createElement('div');
	    $screenReaderStatusMessage.className = 'govuk-password-input__sr-status govuk-visually-hidden';
	    $screenReaderStatusMessage.setAttribute('aria-live', 'polite');
	    this.$screenReaderStatusMessage = $screenReaderStatusMessage;
	    this.$input.insertAdjacentElement('afterend', $screenReaderStatusMessage);
	    this.$showHideButton.addEventListener('click', this.toggle.bind(this));
	    if (this.$input.form) {
	      this.$input.form.addEventListener('submit', () => this.hide());
	    }
	    window.addEventListener('pageshow', event => {
	      if (event.persisted && this.$input.type !== 'password') {
	        this.hide();
	      }
	    });
	    this.hide();
	  }
	  toggle(event) {
	    event.preventDefault();
	    if (this.$input.type === 'password') {
	      this.show();
	      return;
	    }
	    this.hide();
	  }
	  show() {
	    this.setType('text');
	  }
	  hide() {
	    this.setType('password');
	  }
	  setType(type) {
	    if (type === this.$input.type) {
	      return;
	    }
	    this.$input.setAttribute('type', type);
	    const isHidden = type === 'password';
	    const prefixButton = isHidden ? 'show' : 'hide';
	    const prefixStatus = isHidden ? 'passwordHidden' : 'passwordShown';
	    this.$showHideButton.innerText = this.i18n.t(`${prefixButton}Password`);
	    this.$showHideButton.setAttribute('aria-label', this.i18n.t(`${prefixButton}PasswordAriaLabel`));
	    this.$screenReaderStatusMessage.innerText = this.i18n.t(`${prefixStatus}Announcement`);
	  }
	}

	/**
	 * Password input config
	 *
	 * @typedef {object} PasswordInputConfig
	 * @property {PasswordInputTranslations} [i18n=PasswordInput.defaults.i18n] - Password input translations
	 */

	/**
	 * Password input translations
	 *
	 * @see {@link PasswordInput.defaults.i18n}
	 * @typedef {object} PasswordInputTranslations
	 *
	 * Messages displayed to the user indicating the state of the show/hide toggle.
	 * @property {string} [showPassword] - Visible text of the button when the
	 *   password is currently hidden. Plain text only.
	 * @property {string} [hidePassword] - Visible text of the button when the
	 *   password is currently visible. Plain text only.
	 * @property {string} [showPasswordAriaLabel] - aria-label of the button when
	 *   the password is currently hidden. Plain text only.
	 * @property {string} [hidePasswordAriaLabel] - aria-label of the button when
	 *   the password is currently visible. Plain text only.
	 * @property {string} [passwordShownAnnouncement] - Screen reader
	 *   announcement to make when the password has just become visible.
	 *   Plain text only.
	 * @property {string} [passwordHiddenAnnouncement] - Screen reader
	 *   announcement to make when the password has just been hidden.
	 *   Plain text only.
	 */

	/**
	 * @typedef {import('../../common/index.mjs').Schema} Schema
	 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
	 */
	PasswordInput.moduleName = 'govuk-password-input';
	PasswordInput.defaults = Object.freeze({
	  i18n: {
	    showPassword: 'Show',
	    hidePassword: 'Hide',
	    showPasswordAriaLabel: 'Show password',
	    hidePasswordAriaLabel: 'Hide password',
	    passwordShownAnnouncement: 'Your password is visible',
	    passwordHiddenAnnouncement: 'Your password is hidden'
	  }
	});
	PasswordInput.schema = Object.freeze({
	  properties: {
	    i18n: {
	      type: 'object'
	    }
	  }
	});

	/**
	 * Radios component
	 *
	 * @preserve
	 */
	class Radios extends GOVUKFrontendComponent {
	  /**
	   * Radios can be associated with a 'conditionally revealed' content block –
	   * for example, a radio for 'Phone' could reveal an additional form field for
	   * the user to enter their phone number.
	   *
	   * These associations are made using a `data-aria-controls` attribute, which
	   * is promoted to an aria-controls attribute during initialisation.
	   *
	   * We also need to restore the state of any conditional reveals on the page
	   * (for example if the user has navigated back), and set up event handlers to
	   * keep the reveal in sync with the radio state.
	   *
	   * @param {Element | null} $root - HTML element to use for radios
	   */
	  constructor($root) {
	    super($root);
	    this.$inputs = void 0;
	    const $inputs = this.$root.querySelectorAll('input[type="radio"]');
	    if (!$inputs.length) {
	      throw new ElementError({
	        component: Radios,
	        identifier: 'Form inputs (`<input type="radio">`)'
	      });
	    }
	    this.$inputs = $inputs;
	    this.$inputs.forEach($input => {
	      const targetId = $input.getAttribute('data-aria-controls');
	      if (!targetId) {
	        return;
	      }
	      if (!document.getElementById(targetId)) {
	        throw new ElementError({
	          component: Radios,
	          identifier: `Conditional reveal (\`id="${targetId}"\`)`
	        });
	      }
	      $input.setAttribute('aria-controls', targetId);
	      $input.removeAttribute('data-aria-controls');
	    });
	    window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
	    this.syncAllConditionalReveals();
	    this.$root.addEventListener('click', event => this.handleClick(event));
	  }
	  syncAllConditionalReveals() {
	    this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
	  }
	  syncConditionalRevealWithInputState($input) {
	    const targetId = $input.getAttribute('aria-controls');
	    if (!targetId) {
	      return;
	    }
	    const $target = document.getElementById(targetId);
	    if ($target != null && $target.classList.contains('govuk-radios__conditional')) {
	      const inputIsChecked = $input.checked;
	      $input.setAttribute('aria-expanded', inputIsChecked.toString());
	      $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
	    }
	  }
	  handleClick(event) {
	    const $clickedInput = event.target;
	    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
	      return;
	    }
	    const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
	    const $clickedInputForm = $clickedInput.form;
	    const $clickedInputName = $clickedInput.name;
	    $allInputs.forEach($input => {
	      const hasSameFormOwner = $input.form === $clickedInputForm;
	      const hasSameName = $input.name === $clickedInputName;
	      if (hasSameName && hasSameFormOwner) {
	        this.syncConditionalRevealWithInputState($input);
	      }
	    });
	  }
	}
	Radios.moduleName = 'govuk-radios';

	/**
	 * Service Navigation component
	 *
	 * @preserve
	 */
	class ServiceNavigation extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for header
	   */
	  constructor($root) {
	    super($root);
	    this.$menuButton = void 0;
	    this.$menu = void 0;
	    this.menuIsOpen = false;
	    this.mql = null;
	    const $menuButton = this.$root.querySelector('.govuk-js-service-navigation-toggle');
	    if (!$menuButton) {
	      return this;
	    }
	    const menuId = $menuButton.getAttribute('aria-controls');
	    if (!menuId) {
	      throw new ElementError({
	        component: ServiceNavigation,
	        identifier: 'Navigation button (`<button class="govuk-js-service-navigation-toggle">`) attribute (`aria-controls`)'
	      });
	    }
	    const $menu = document.getElementById(menuId);
	    if (!$menu) {
	      throw new ElementError({
	        component: ServiceNavigation,
	        element: $menu,
	        identifier: `Navigation (\`<ul id="${menuId}">\`)`
	      });
	    }
	    this.$menu = $menu;
	    this.$menuButton = $menuButton;
	    this.setupResponsiveChecks();
	    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
	  }
	  setupResponsiveChecks() {
	    const breakpoint = getBreakpoint('tablet');
	    if (!breakpoint.value) {
	      throw new ElementError({
	        component: ServiceNavigation,
	        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
	      });
	    }
	    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
	    if ('addEventListener' in this.mql) {
	      this.mql.addEventListener('change', () => this.checkMode());
	    } else {
	      this.mql.addListener(() => this.checkMode());
	    }
	    this.checkMode();
	  }
	  checkMode() {
	    if (!this.mql || !this.$menu || !this.$menuButton) {
	      return;
	    }
	    if (this.mql.matches) {
	      this.$menu.removeAttribute('hidden');
	      this.$menuButton.setAttribute('hidden', '');
	    } else {
	      this.$menuButton.removeAttribute('hidden');
	      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
	      if (this.menuIsOpen) {
	        this.$menu.removeAttribute('hidden');
	      } else {
	        this.$menu.setAttribute('hidden', '');
	      }
	    }
	  }
	  handleMenuButtonClick() {
	    this.menuIsOpen = !this.menuIsOpen;
	    this.checkMode();
	  }
	}
	ServiceNavigation.moduleName = 'govuk-service-navigation';

	/**
	 * Skip link component
	 *
	 * @preserve
	 * @augments GOVUKFrontendComponent<HTMLAnchorElement>
	 */
	class SkipLink extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for skip link
	   * @throws {ElementError} when $root is not set or the wrong type
	   * @throws {ElementError} when $root.hash does not contain a hash
	   * @throws {ElementError} when the linked element is missing or the wrong type
	   */
	  constructor($root) {
	    var _this$$root$getAttrib;
	    super($root);
	    const hash = this.$root.hash;
	    const href = (_this$$root$getAttrib = this.$root.getAttribute('href')) != null ? _this$$root$getAttrib : '';
	    let url;
	    try {
	      url = new window.URL(this.$root.href);
	    } catch (error) {
	      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) is invalid`);
	    }
	    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
	      return;
	    }
	    const linkedElementId = getFragmentFromUrl(hash);
	    if (!linkedElementId) {
	      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
	    }
	    const $linkedElement = document.getElementById(linkedElementId);
	    if (!$linkedElement) {
	      throw new ElementError({
	        component: SkipLink,
	        element: $linkedElement,
	        identifier: `Target content (\`id="${linkedElementId}"\`)`
	      });
	    }
	    this.$root.addEventListener('click', () => setFocus($linkedElement, {
	      onBeforeFocus() {
	        $linkedElement.classList.add('govuk-skip-link-focused-element');
	      },
	      onBlur() {
	        $linkedElement.classList.remove('govuk-skip-link-focused-element');
	      }
	    }));
	  }
	}
	SkipLink.elementType = HTMLAnchorElement;
	SkipLink.moduleName = 'govuk-skip-link';

	/**
	 * Tabs component
	 *
	 * @preserve
	 */
	class Tabs extends GOVUKFrontendComponent {
	  /**
	   * @param {Element | null} $root - HTML element to use for tabs
	   */
	  constructor($root) {
	    super($root);
	    this.$tabs = void 0;
	    this.$tabList = void 0;
	    this.$tabListItems = void 0;
	    this.jsHiddenClass = 'govuk-tabs__panel--hidden';
	    this.changingHash = false;
	    this.boundTabClick = void 0;
	    this.boundTabKeydown = void 0;
	    this.boundOnHashChange = void 0;
	    this.mql = null;
	    const $tabs = this.$root.querySelectorAll('a.govuk-tabs__tab');
	    if (!$tabs.length) {
	      throw new ElementError({
	        component: Tabs,
	        identifier: 'Links (`<a class="govuk-tabs__tab">`)'
	      });
	    }
	    this.$tabs = $tabs;
	    this.boundTabClick = this.onTabClick.bind(this);
	    this.boundTabKeydown = this.onTabKeydown.bind(this);
	    this.boundOnHashChange = this.onHashChange.bind(this);
	    const $tabList = this.$root.querySelector('.govuk-tabs__list');
	    const $tabListItems = this.$root.querySelectorAll('li.govuk-tabs__list-item');
	    if (!$tabList) {
	      throw new ElementError({
	        component: Tabs,
	        identifier: 'List (`<ul class="govuk-tabs__list">`)'
	      });
	    }
	    if (!$tabListItems.length) {
	      throw new ElementError({
	        component: Tabs,
	        identifier: 'List items (`<li class="govuk-tabs__list-item">`)'
	      });
	    }
	    this.$tabList = $tabList;
	    this.$tabListItems = $tabListItems;
	    this.setupResponsiveChecks();
	  }
	  setupResponsiveChecks() {
	    const breakpoint = getBreakpoint('tablet');
	    if (!breakpoint.value) {
	      throw new ElementError({
	        component: Tabs,
	        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
	      });
	    }
	    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
	    if ('addEventListener' in this.mql) {
	      this.mql.addEventListener('change', () => this.checkMode());
	    } else {
	      this.mql.addListener(() => this.checkMode());
	    }
	    this.checkMode();
	  }
	  checkMode() {
	    var _this$mql;
	    if ((_this$mql = this.mql) != null && _this$mql.matches) {
	      this.setup();
	    } else {
	      this.teardown();
	    }
	  }
	  setup() {
	    var _this$getTab;
	    this.$tabList.setAttribute('role', 'tablist');
	    this.$tabListItems.forEach($item => {
	      $item.setAttribute('role', 'presentation');
	    });
	    this.$tabs.forEach($tab => {
	      this.setAttributes($tab);
	      $tab.addEventListener('click', this.boundTabClick, true);
	      $tab.addEventListener('keydown', this.boundTabKeydown, true);
	      this.hideTab($tab);
	    });
	    const $activeTab = (_this$getTab = this.getTab(window.location.hash)) != null ? _this$getTab : this.$tabs[0];
	    this.showTab($activeTab);
	    window.addEventListener('hashchange', this.boundOnHashChange, true);
	  }
	  teardown() {
	    this.$tabList.removeAttribute('role');
	    this.$tabListItems.forEach($item => {
	      $item.removeAttribute('role');
	    });
	    this.$tabs.forEach($tab => {
	      $tab.removeEventListener('click', this.boundTabClick, true);
	      $tab.removeEventListener('keydown', this.boundTabKeydown, true);
	      this.unsetAttributes($tab);
	    });
	    window.removeEventListener('hashchange', this.boundOnHashChange, true);
	  }
	  onHashChange() {
	    const hash = window.location.hash;
	    const $tabWithHash = this.getTab(hash);
	    if (!$tabWithHash) {
	      return;
	    }
	    if (this.changingHash) {
	      this.changingHash = false;
	      return;
	    }
	    const $previousTab = this.getCurrentTab();
	    if (!$previousTab) {
	      return;
	    }
	    this.hideTab($previousTab);
	    this.showTab($tabWithHash);
	    $tabWithHash.focus();
	  }
	  hideTab($tab) {
	    this.unhighlightTab($tab);
	    this.hidePanel($tab);
	  }
	  showTab($tab) {
	    this.highlightTab($tab);
	    this.showPanel($tab);
	  }
	  getTab(hash) {
	    return this.$root.querySelector(`a.govuk-tabs__tab[href="${hash}"]`);
	  }
	  setAttributes($tab) {
	    const panelId = getFragmentFromUrl($tab.href);
	    if (!panelId) {
	      return;
	    }
	    $tab.setAttribute('id', `tab_${panelId}`);
	    $tab.setAttribute('role', 'tab');
	    $tab.setAttribute('aria-controls', panelId);
	    $tab.setAttribute('aria-selected', 'false');
	    $tab.setAttribute('tabindex', '-1');
	    const $panel = this.getPanel($tab);
	    if (!$panel) {
	      return;
	    }
	    $panel.setAttribute('role', 'tabpanel');
	    $panel.setAttribute('aria-labelledby', $tab.id);
	    $panel.classList.add(this.jsHiddenClass);
	  }
	  unsetAttributes($tab) {
	    $tab.removeAttribute('id');
	    $tab.removeAttribute('role');
	    $tab.removeAttribute('aria-controls');
	    $tab.removeAttribute('aria-selected');
	    $tab.removeAttribute('tabindex');
	    const $panel = this.getPanel($tab);
	    if (!$panel) {
	      return;
	    }
	    $panel.removeAttribute('role');
	    $panel.removeAttribute('aria-labelledby');
	    $panel.classList.remove(this.jsHiddenClass);
	  }
	  onTabClick(event) {
	    const $currentTab = this.getCurrentTab();
	    const $nextTab = event.currentTarget;
	    if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
	      return;
	    }
	    event.preventDefault();
	    this.hideTab($currentTab);
	    this.showTab($nextTab);
	    this.createHistoryEntry($nextTab);
	  }
	  createHistoryEntry($tab) {
	    const $panel = this.getPanel($tab);
	    if (!$panel) {
	      return;
	    }
	    const panelId = $panel.id;
	    $panel.id = '';
	    this.changingHash = true;
	    window.location.hash = panelId;
	    $panel.id = panelId;
	  }
	  onTabKeydown(event) {
	    switch (event.key) {
	      case 'ArrowLeft':
	      case 'Left':
	        this.activatePreviousTab();
	        event.preventDefault();
	        break;
	      case 'ArrowRight':
	      case 'Right':
	        this.activateNextTab();
	        event.preventDefault();
	        break;
	    }
	  }
	  activateNextTab() {
	    const $currentTab = this.getCurrentTab();
	    if (!($currentTab != null && $currentTab.parentElement)) {
	      return;
	    }
	    const $nextTabListItem = $currentTab.parentElement.nextElementSibling;
	    if (!$nextTabListItem) {
	      return;
	    }
	    const $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
	    if (!$nextTab) {
	      return;
	    }
	    this.hideTab($currentTab);
	    this.showTab($nextTab);
	    $nextTab.focus();
	    this.createHistoryEntry($nextTab);
	  }
	  activatePreviousTab() {
	    const $currentTab = this.getCurrentTab();
	    if (!($currentTab != null && $currentTab.parentElement)) {
	      return;
	    }
	    const $previousTabListItem = $currentTab.parentElement.previousElementSibling;
	    if (!$previousTabListItem) {
	      return;
	    }
	    const $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
	    if (!$previousTab) {
	      return;
	    }
	    this.hideTab($currentTab);
	    this.showTab($previousTab);
	    $previousTab.focus();
	    this.createHistoryEntry($previousTab);
	  }
	  getPanel($tab) {
	    const panelId = getFragmentFromUrl($tab.href);
	    if (!panelId) {
	      return null;
	    }
	    return this.$root.querySelector(`#${panelId}`);
	  }
	  showPanel($tab) {
	    const $panel = this.getPanel($tab);
	    if (!$panel) {
	      return;
	    }
	    $panel.classList.remove(this.jsHiddenClass);
	  }
	  hidePanel($tab) {
	    const $panel = this.getPanel($tab);
	    if (!$panel) {
	      return;
	    }
	    $panel.classList.add(this.jsHiddenClass);
	  }
	  unhighlightTab($tab) {
	    if (!$tab.parentElement) {
	      return;
	    }
	    $tab.setAttribute('aria-selected', 'false');
	    $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
	    $tab.setAttribute('tabindex', '-1');
	  }
	  highlightTab($tab) {
	    if (!$tab.parentElement) {
	      return;
	    }
	    $tab.setAttribute('aria-selected', 'true');
	    $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
	    $tab.setAttribute('tabindex', '0');
	  }
	  getCurrentTab() {
	    return this.$root.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab');
	  }
	}
	Tabs.moduleName = 'govuk-tabs';

	/**
	 * Initialise all components
	 *
	 * Use the `data-module` attributes to find, instantiate and init all of the
	 * components provided as part of GOV.UK Frontend.
	 *
	 * @param {Config & { scope?: Element, onError?: OnErrorCallback<CompatibleClass> }} [config] - Config for all components (with optional scope)
	 */
	function initAll(config) {
	  var _config$scope;
	  config = typeof config !== 'undefined' ? config : {};
	  if (!isSupported()) {
	    if (config.onError) {
	      config.onError(new SupportError(), {
	        config
	      });
	    } else {
	      console.log(new SupportError());
	    }
	    return;
	  }
	  const components = [[Accordion, config.accordion], [Button, config.button], [CharacterCount, config.characterCount], [Checkboxes], [ErrorSummary, config.errorSummary], [ExitThisPage, config.exitThisPage], [Header], [NotificationBanner, config.notificationBanner], [PasswordInput, config.passwordInput], [Radios], [ServiceNavigation], [SkipLink], [Tabs]];
	  const options = {
	    scope: (_config$scope = config.scope) != null ? _config$scope : document,
	    onError: config.onError
	  };
	  components.forEach(([Component, config]) => {
	    createAll(Component, config, options);
	  });
	}

	/**
	 * Create all instances of a specific component on the page
	 *
	 * Uses the `data-module` attribute to find all elements matching the specified
	 * component on the page, creating instances of the component object for each
	 * of them.
	 *
	 * Any component errors will be caught and logged to the console.
	 *
	 * @template {CompatibleClass} T
	 * @param {T} Component - class of the component to create
	 * @param {T["defaults"]} [config] - Config supplied to component
	 * @param {OnErrorCallback<T> | Element | Document | CreateAllOptions<T> } [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
	 * @returns {Array<InstanceType<T>>} - array of instantiated components
	 */
	function createAll(Component, config, createAllOptions) {
	  let $scope = document;
	  let onError;
	  if (typeof createAllOptions === 'object') {
	    var _createAllOptions$sco;
	    createAllOptions = createAllOptions;
	    $scope = (_createAllOptions$sco = createAllOptions.scope) != null ? _createAllOptions$sco : $scope;
	    onError = createAllOptions.onError;
	  }
	  if (typeof createAllOptions === 'function') {
	    onError = createAllOptions;
	  }
	  if (createAllOptions instanceof HTMLElement) {
	    $scope = createAllOptions;
	  }
	  const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
	  if (!isSupported()) {
	    if (onError) {
	      onError(new SupportError(), {
	        component: Component,
	        config
	      });
	    } else {
	      console.log(new SupportError());
	    }
	    return [];
	  }
	  return Array.from($elements).map($element => {
	    try {
	      return typeof config !== 'undefined' ? new Component($element, config) : new Component($element);
	    } catch (error) {
	      if (onError) {
	        onError(error, {
	          element: $element,
	          component: Component,
	          config
	        });
	      } else {
	        console.log(error);
	      }
	      return null;
	    }
	  }).filter(Boolean);
	}

	// Taken from https://github.com/alphagov/govuk-design-system/blob/29b9cf8c30ac1514d16fc97adaf15100e5040f7d/src/javascripts/components/tabs.js

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

	  this.$allTabTogglersMarkedOpen.forEach(function ($tabToggler) {
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
	    $currentTogglerSiblings.forEach(function ($tabToggler) {
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

	    $currentTogglerSiblings.forEach(function ($tabToggler) {
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
	  this.$allTabContainers.forEach(function ($tabContainer) {
	    // unless the tab content has not tabs and it's been set as open
	    if (!$tabContainer.classList.contains(tabContainerNoTabsJsClass)) {
	      $tabContainer.classList.add(tabContainerHiddenClass);
	      $tabContainer.setAttribute('aria-hidden', 'true');
	    }
	  });

	  this.$allTabTogglers.forEach(function ($tabToggler) {
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
	 * clipboard.js v2.0.11
	 * https://clipboardjs.com/
	 *
	 * Licensed MIT © Zeno Rocha
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory();
	})(commonjsGlobal, function() {
	return /******/ (function() { // webpackBootstrap
	/******/ 	var __webpack_modules__ = ({

	/***/ 686:
	/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

	// EXPORTS
	__webpack_require__.d(__webpack_exports__, {
	  "default": function() { return /* binding */ clipboard; }
	});

	// EXTERNAL MODULE: ./node_modules/tiny-emitter/index.js
	var tiny_emitter = __webpack_require__(279);
	var tiny_emitter_default = /*#__PURE__*/__webpack_require__.n(tiny_emitter);
	// EXTERNAL MODULE: ./node_modules/good-listener/src/listen.js
	var listen = __webpack_require__(370);
	var listen_default = /*#__PURE__*/__webpack_require__.n(listen);
	// EXTERNAL MODULE: ./node_modules/select/src/select.js
	var src_select = __webpack_require__(817);
	var select_default = /*#__PURE__*/__webpack_require__.n(src_select);
	/**
	 * Executes a given operation type.
	 * @param {String} type
	 * @return {Boolean}
	 */
	function command(type) {
	  try {
	    return document.execCommand(type);
	  } catch (err) {
	    return false;
	  }
	}


	/**
	 * Cut action wrapper.
	 * @param {String|HTMLElement} target
	 * @return {String}
	 */

	var ClipboardActionCut = function ClipboardActionCut(target) {
	  var selectedText = select_default()(target);
	  command('cut');
	  return selectedText;
	};

	/* harmony default export */ var actions_cut = (ClipboardActionCut);
	/**
	 * Creates a fake textarea element with a value.
	 * @param {String} value
	 * @return {HTMLElement}
	 */
	function createFakeElement(value) {
	  var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
	  var fakeElement = document.createElement('textarea'); // Prevent zooming on iOS

	  fakeElement.style.fontSize = '12pt'; // Reset box model

	  fakeElement.style.border = '0';
	  fakeElement.style.padding = '0';
	  fakeElement.style.margin = '0'; // Move element out of screen horizontally

	  fakeElement.style.position = 'absolute';
	  fakeElement.style[isRTL ? 'right' : 'left'] = '-9999px'; // Move element to the same position vertically

	  var yPosition = window.pageYOffset || document.documentElement.scrollTop;
	  fakeElement.style.top = "".concat(yPosition, "px");
	  fakeElement.setAttribute('readonly', '');
	  fakeElement.value = value;
	  return fakeElement;
	}



	/**
	 * Create fake copy action wrapper using a fake element.
	 * @param {String} target
	 * @param {Object} options
	 * @return {String}
	 */

	var fakeCopyAction = function fakeCopyAction(value, options) {
	  var fakeElement = createFakeElement(value);
	  options.container.appendChild(fakeElement);
	  var selectedText = select_default()(fakeElement);
	  command('copy');
	  fakeElement.remove();
	  return selectedText;
	};
	/**
	 * Copy action wrapper.
	 * @param {String|HTMLElement} target
	 * @param {Object} options
	 * @return {String}
	 */


	var ClipboardActionCopy = function ClipboardActionCopy(target) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	    container: document.body
	  };
	  var selectedText = '';

	  if (typeof target === 'string') {
	    selectedText = fakeCopyAction(target, options);
	  } else if (target instanceof HTMLInputElement && !['text', 'search', 'url', 'tel', 'password'].includes(target === null || target === void 0 ? void 0 : target.type)) {
	    // If input type doesn't support `setSelectionRange`. Simulate it. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
	    selectedText = fakeCopyAction(target.value, options);
	  } else {
	    selectedText = select_default()(target);
	    command('copy');
	  }

	  return selectedText;
	};

	/* harmony default export */ var actions_copy = (ClipboardActionCopy);
	function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



	/**
	 * Inner function which performs selection from either `text` or `target`
	 * properties and then executes copy or cut operations.
	 * @param {Object} options
	 */

	var ClipboardActionDefault = function ClipboardActionDefault() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  // Defines base properties passed from constructor.
	  var _options$action = options.action,
	      action = _options$action === void 0 ? 'copy' : _options$action,
	      container = options.container,
	      target = options.target,
	      text = options.text; // Sets the `action` to be performed which can be either 'copy' or 'cut'.

	  if (action !== 'copy' && action !== 'cut') {
	    throw new Error('Invalid "action" value, use either "copy" or "cut"');
	  } // Sets the `target` property using an element that will be have its content copied.


	  if (target !== undefined) {
	    if (target && _typeof(target) === 'object' && target.nodeType === 1) {
	      if (action === 'copy' && target.hasAttribute('disabled')) {
	        throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
	      }

	      if (action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
	        throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
	      }
	    } else {
	      throw new Error('Invalid "target" value, use a valid Element');
	    }
	  } // Define selection strategy based on `text` property.


	  if (text) {
	    return actions_copy(text, {
	      container: container
	    });
	  } // Defines which selection strategy based on `target` property.


	  if (target) {
	    return action === 'cut' ? actions_cut(target) : actions_copy(target, {
	      container: container
	    });
	  }
	};

	/* harmony default export */ var actions_default = (ClipboardActionDefault);
	function clipboard_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { clipboard_typeof = function _typeof(obj) { return typeof obj; }; } else { clipboard_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return clipboard_typeof(obj); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

	function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

	function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _possibleConstructorReturn(self, call) { if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

	function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

	function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

	function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






	/**
	 * Helper function to retrieve attribute value.
	 * @param {String} suffix
	 * @param {Element} element
	 */

	function getAttributeValue(suffix, element) {
	  var attribute = "data-clipboard-".concat(suffix);

	  if (!element.hasAttribute(attribute)) {
	    return;
	  }

	  return element.getAttribute(attribute);
	}
	/**
	 * Base class which takes one or more elements, adds event listeners to them,
	 * and instantiates a new `ClipboardAction` on each click.
	 */


	var Clipboard = /*#__PURE__*/function (_Emitter) {
	  _inherits(Clipboard, _Emitter);

	  var _super = _createSuper(Clipboard);

	  /**
	   * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
	   * @param {Object} options
	   */
	  function Clipboard(trigger, options) {
	    var _this;

	    _classCallCheck(this, Clipboard);

	    _this = _super.call(this);

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
	    key: "resolveOptions",
	    value: function resolveOptions() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
	      this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
	      this.text = typeof options.text === 'function' ? options.text : this.defaultText;
	      this.container = clipboard_typeof(options.container) === 'object' ? options.container : document.body;
	    }
	    /**
	     * Adds a click event listener to the passed trigger.
	     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
	     */

	  }, {
	    key: "listenClick",
	    value: function listenClick(trigger) {
	      var _this2 = this;

	      this.listener = listen_default()(trigger, 'click', function (e) {
	        return _this2.onClick(e);
	      });
	    }
	    /**
	     * Defines a new `ClipboardAction` on each click event.
	     * @param {Event} e
	     */

	  }, {
	    key: "onClick",
	    value: function onClick(e) {
	      var trigger = e.delegateTarget || e.currentTarget;
	      var action = this.action(trigger) || 'copy';
	      var text = actions_default({
	        action: action,
	        container: this.container,
	        target: this.target(trigger),
	        text: this.text(trigger)
	      }); // Fires an event based on the copy operation result.

	      this.emit(text ? 'success' : 'error', {
	        action: action,
	        text: text,
	        trigger: trigger,
	        clearSelection: function clearSelection() {
	          if (trigger) {
	            trigger.focus();
	          }

	          window.getSelection().removeAllRanges();
	        }
	      });
	    }
	    /**
	     * Default `action` lookup function.
	     * @param {Element} trigger
	     */

	  }, {
	    key: "defaultAction",
	    value: function defaultAction(trigger) {
	      return getAttributeValue('action', trigger);
	    }
	    /**
	     * Default `target` lookup function.
	     * @param {Element} trigger
	     */

	  }, {
	    key: "defaultTarget",
	    value: function defaultTarget(trigger) {
	      var selector = getAttributeValue('target', trigger);

	      if (selector) {
	        return document.querySelector(selector);
	      }
	    }
	    /**
	     * Allow fire programmatically a copy action
	     * @param {String|HTMLElement} target
	     * @param {Object} options
	     * @returns Text copied.
	     */

	  }, {
	    key: "defaultText",

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
	    key: "destroy",
	    value: function destroy() {
	      this.listener.destroy();
	    }
	  }], [{
	    key: "copy",
	    value: function copy(target) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	        container: document.body
	      };
	      return actions_copy(target, options);
	    }
	    /**
	     * Allow fire programmatically a cut action
	     * @param {String|HTMLElement} target
	     * @returns Text cutted.
	     */

	  }, {
	    key: "cut",
	    value: function cut(target) {
	      return actions_cut(target);
	    }
	    /**
	     * Returns the support of the given action, or all actions if no action is
	     * given.
	     * @param {String} [action]
	     */

	  }, {
	    key: "isSupported",
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
	}((tiny_emitter_default()));

	/* harmony default export */ var clipboard = (Clipboard);

	/***/ }),

	/***/ 828:
	/***/ (function(module) {

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


	/***/ }),

	/***/ 438:
	/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

	var closest = __webpack_require__(828);

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

	/***/ 879:
	/***/ (function(__unused_webpack_module, exports) {

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

	/***/ 370:
	/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

	var is = __webpack_require__(879);
	var delegate = __webpack_require__(438);

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

	/***/ 817:
	/***/ (function(module) {

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

	/***/ 279:
	/***/ (function(module) {

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
	module.exports.TinyEmitter = E;


	/***/ })

	/******/ 	});
	/************************************************************************/
	/******/ 	// The module cache
	/******/ 	var __webpack_module_cache__ = {};
	/******/ 	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/ 		// Check if module is in cache
	/******/ 		if(__webpack_module_cache__[moduleId]) {
	/******/ 			return __webpack_module_cache__[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = __webpack_module_cache__[moduleId] = {
	/******/ 			// no module.id needed
	/******/ 			// no module.loaded needed
	/******/ 			exports: {}
	/******/ 		};
	/******/ 	
	/******/ 		// Execute the module function
	/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
	/******/ 	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/ 	
	/************************************************************************/
	/******/ 	/* webpack/runtime/compat get default export */
	/******/ 	!function() {
	/******/ 		// getDefaultExport function for compatibility with non-harmony modules
	/******/ 		__webpack_require__.n = function(module) {
	/******/ 			var getter = module && module.__esModule ?
	/******/ 				function() { return module['default']; } :
	/******/ 				function() { return module; };
	/******/ 			__webpack_require__.d(getter, { a: getter });
	/******/ 			return getter;
	/******/ 		};
	/******/ 	}();
	/******/ 	
	/******/ 	/* webpack/runtime/define property getters */
	/******/ 	!function() {
	/******/ 		// define getter functions for harmony exports
	/******/ 		__webpack_require__.d = function(exports, definition) {
	/******/ 			for(var key in definition) {
	/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
	/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
	/******/ 				}
	/******/ 			}
	/******/ 		};
	/******/ 	}();
	/******/ 	
	/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
	/******/ 	!function() {
	/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); };
	/******/ 	}();
	/******/ 	
	/************************************************************************/
	/******/ 	// module exports must be returned from runtime so entry inlining is disabled
	/******/ 	// startup
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(686);
	/******/ })()
	.default;
	});
	});

	var ClipboardJS = unwrapExports(clipboard);

	function CopyToClipboard ($module) {
	  if (!($module instanceof HTMLElement) || !ClipboardJS.isSupported()) {
	    return this
	  }

	  this.$module = $module;
	  this.$button = null;
	  this.$status = null;
	}

	CopyToClipboard.prototype.init = function () {
	  this.$button = document.createElement('button');
	  this.$button.className = 'app-copy-button js-copy-button';
	  this.$button.textContent = 'Copy';

	  this.$status = document.createElement('span');
	  this.$status.className = 'govuk-visually-hidden';
	  this.$status.setAttribute('aria-live', 'assertive');

	  this.$module.prepend(this.$button);
	  this.$module.prepend(this.$status);

	  this.copyAction();
	};

	CopyToClipboard.prototype.copyAction = function () {
	  try {
	    new ClipboardJS(this.$button, {
	      target: (trigger) => trigger.nextElementSibling
	    }).on('success', (event) => {
	      this.$button.textContent = 'Copied';
	      this.$status.textContent = 'Copied';
	      event.clearSelection();
	      setTimeout(() => {
	        this.$button.textContent = 'Copy';
	        this.$status.textContent = '';
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

	function Accordion$1 ($module) {
	  this.$module = $module;
	  this.$allAnchorLinks = this.$module.querySelectorAll(linkLocator);
	  this.$allSectionButtons = this.$module.querySelectorAll(sectionButtonLocator);
	  this.$mappedSectionButtons = {};
	}

	Accordion$1.prototype.init = function () {
	  if (!this.$module) {
	    return
	  }
	  this.$allAnchorLinks.forEach(this.attachClick.bind(this));
	  var self = this;
	  this.$allSectionButtons.forEach(function (button) {
	    self.$mappedSectionButtons[button.textContent.trim().toLowerCase()] = button.id;
	  });
	};

	Accordion$1.prototype.attachClick = function (link) {
	  link.addEventListener('click', this.handleClick.bind(this));
	};

	Accordion$1.prototype.handleClick = function (evt) {
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

	  this.$switches.forEach(function ($this) {
	    $this.addEventListener('click', self.handleClick.bind(self));
	  });
	};

	// Close current container on click
	LanguageSwitchExample.prototype.handleClick = function (event) {
	  var self = this;
	  event.preventDefault();
	  var $target = event.target;
	  this.$module.querySelectorAll('.' + this.currentClassName).forEach(function ($option) {
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

	// Initialise tabs
	const $tabs = document.querySelectorAll('[data-module~="app-tabs"]');
	$tabs.forEach($tab => {
	  new AppTabs($tab).init();
	});

	// Initialise nav toggles
	const $toggles = document.querySelectorAll('[data-module~="subnav-toggle"]');
	$toggles.forEach($toggle => {
	  new SubNavToggle($toggle).init();
	});

	// Initialise language switch
	const $languageSwitchExamples = document.querySelectorAll('[data-module~="app-language-switch-example"]');
	$languageSwitchExamples.forEach( $example => {
	  new LanguageSwitchExample($example).init();
	});

	// Initialise copy to clipboard
	const $copyToClipboardButtons = document.querySelectorAll('[data-module="app-copy"]');
	$copyToClipboardButtons.forEach( $button => {
	  new CopyToClipboard($button).init();
	});

	// Initialise temporary accordian workaround
	const $accordions = document.querySelectorAll('[data-module~="govuk-accordion"]');
	$accordions.forEach( $accordion => {
	  new Accordion$1($accordion).init();
	});

	// Initialise print links
	const $printLinks = document.querySelectorAll('[data-module="print-link"');
	$printLinks.forEach($printLink => {
	  new PrintLink($printLink).init();
	});

	all.initAll();
	initAll({
	  errorSummary: {
	    disableAutoFocus: true
	  },
	  notificationBanner: {
	    disableAutoFocus: true
	  }
	});

	window.hmrcDesignSystem = { CopyToClipboard };

}());
