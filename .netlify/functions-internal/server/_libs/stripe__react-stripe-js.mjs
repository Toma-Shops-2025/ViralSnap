import { a as React2 } from "./react.mjs";
import { P as PropTypes } from "./prop-types.mjs";
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var useAttachEvent = function useAttachEvent2(element, event, cb) {
  var cbDefined = !!cb;
  var cbRef = React2.useRef(cb);
  React2.useEffect(function() {
    cbRef.current = cb;
  }, [cb]);
  React2.useEffect(function() {
    if (!cbDefined || !element) {
      return function() {
      };
    }
    var decoratedCb = function decoratedCb2() {
      if (cbRef.current) {
        cbRef.current.apply(cbRef, arguments);
      }
    };
    element.on(event, decoratedCb);
    return function() {
      element.off(event, decoratedCb);
    };
  }, [cbDefined, event, element, cbRef]);
};
var usePrevious = function usePrevious2(value) {
  var ref = React2.useRef(value);
  React2.useEffect(function() {
    ref.current = value;
  }, [value]);
  return ref.current;
};
var isUnknownObject = function isUnknownObject2(raw) {
  return raw !== null && _typeof(raw) === "object";
};
var isPromise = function isPromise2(raw) {
  return isUnknownObject(raw) && typeof raw.then === "function";
};
var isStripe = function isStripe2(raw) {
  return isUnknownObject(raw) && typeof raw.elements === "function" && typeof raw.createToken === "function" && typeof raw.createPaymentMethod === "function" && typeof raw.confirmCardPayment === "function";
};
var PLAIN_OBJECT_STR = "[object Object]";
var isEqual = function isEqual2(left, right) {
  if (!isUnknownObject(left) || !isUnknownObject(right)) {
    return left === right;
  }
  var leftArray = Array.isArray(left);
  var rightArray = Array.isArray(right);
  if (leftArray !== rightArray) return false;
  var leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
  var rightPlainObject = Object.prototype.toString.call(right) === PLAIN_OBJECT_STR;
  if (leftPlainObject !== rightPlainObject) return false;
  if (!leftPlainObject && !leftArray) return left === right;
  var leftKeys = Object.keys(left);
  var rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  var keySet = {};
  for (var i = 0; i < leftKeys.length; i += 1) {
    keySet[leftKeys[i]] = true;
  }
  for (var _i = 0; _i < rightKeys.length; _i += 1) {
    keySet[rightKeys[_i]] = true;
  }
  var allKeys = Object.keys(keySet);
  if (allKeys.length !== leftKeys.length) {
    return false;
  }
  var l = left;
  var r = right;
  var pred = function pred2(key) {
    return isEqual2(l[key], r[key]);
  };
  return allKeys.every(pred);
};
var extractAllowedOptionsUpdates = function extractAllowedOptionsUpdates2(options, prevOptions, immutableKeys) {
  if (!isUnknownObject(options)) {
    return null;
  }
  return Object.keys(options).reduce(function(newOptions, key) {
    var isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
    if (immutableKeys.includes(key)) {
      if (isUpdated) {
        console.warn("Unsupported prop change: options.".concat(key, " is not a mutable property."));
      }
      return newOptions;
    }
    if (!isUpdated) {
      return newOptions;
    }
    return _objectSpread2(_objectSpread2({}, newOptions || {}), {}, _defineProperty({}, key, options[key]));
  }, null);
};
var INVALID_STRIPE_ERROR$1 = "Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.";
var validateStripe = function validateStripe2(maybeStripe) {
  var errorMsg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : INVALID_STRIPE_ERROR$1;
  if (maybeStripe === null || isStripe(maybeStripe)) {
    return maybeStripe;
  }
  throw new Error(errorMsg);
};
var parseStripeProp = function parseStripeProp2(raw) {
  var errorMsg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : INVALID_STRIPE_ERROR$1;
  if (isPromise(raw)) {
    return {
      tag: "async",
      stripePromise: Promise.resolve(raw).then(function(result) {
        return validateStripe(result, errorMsg);
      })
    };
  }
  var stripe = validateStripe(raw, errorMsg);
  if (stripe === null) {
    return {
      tag: "empty"
    };
  }
  return {
    tag: "sync",
    stripe
  };
};
var registerWithStripeJs = function registerWithStripeJs2(stripe) {
  if (!stripe || !stripe._registerWrapper || !stripe.registerAppInfo) {
    return;
  }
  stripe._registerWrapper({
    name: "react-stripe-js",
    version: "6.2.0"
  });
  stripe.registerAppInfo({
    name: "react-stripe-js",
    version: "6.2.0",
    url: "https://stripe.com/docs/stripe-js/react"
  });
};
var ElementsContext = /* @__PURE__ */ React2.createContext(null);
ElementsContext.displayName = "ElementsContext";
var parseElementsContext = function parseElementsContext2(ctx, useCase) {
  if (!ctx) {
    throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(useCase, " in an <Elements> provider."));
  }
  return ctx;
};
({
  stripe: PropTypes.any,
  options: PropTypes.object
});
({
  children: PropTypes.func.isRequired
});
var CheckoutContext = /* @__PURE__ */ React2.createContext(null);
CheckoutContext.displayName = "CheckoutContext";
var useElementsOrCheckoutContextWithUseCase = function useElementsOrCheckoutContextWithUseCase2(useCaseString) {
  var checkout = React2.useContext(CheckoutContext);
  var elements = React2.useContext(ElementsContext);
  if (checkout) {
    if (elements) {
      throw new Error("You cannot wrap the part of your app that ".concat(useCaseString, " in both a checkout provider and <Elements> provider."));
    } else {
      return checkout;
    }
  } else {
    return parseElementsContext(elements, useCaseString);
  }
};
var _excluded = ["mode"];
var capitalized = function capitalized2(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var createElementComponent = function createElementComponent2(type, isServer2, customDisplayName) {
  var displayName = "".concat(capitalized(type), "Element");
  var ClientElement = function ClientElement2(_ref) {
    var id = _ref.id, className = _ref.className, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, onBlur = _ref.onBlur, onFocus = _ref.onFocus, onReady = _ref.onReady, onChange = _ref.onChange, onEscape = _ref.onEscape, onClick = _ref.onClick, onLoadError = _ref.onLoadError, onLoaderStart = _ref.onLoaderStart, onNetworksChange = _ref.onNetworksChange, onConfirm = _ref.onConfirm, onCancel = _ref.onCancel, onShippingAddressChange = _ref.onShippingAddressChange, onShippingRateChange = _ref.onShippingRateChange, onSavedPaymentMethodRemove = _ref.onSavedPaymentMethodRemove, onSavedPaymentMethodUpdate = _ref.onSavedPaymentMethodUpdate;
    var ctx = useElementsOrCheckoutContextWithUseCase("mounts <".concat(displayName, ">"));
    var elements = "elements" in ctx ? ctx.elements : null;
    var checkoutState = "checkoutState" in ctx ? ctx.checkoutState : null;
    var checkoutSdk = (checkoutState === null || checkoutState === void 0 ? void 0 : checkoutState.type) === "success" || (checkoutState === null || checkoutState === void 0 ? void 0 : checkoutState.type) === "loading" ? checkoutState.sdk : null;
    var _React$useState = React2.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), element = _React$useState2[0], setElement = _React$useState2[1];
    var elementRef = React2.useRef(null);
    var domNode = React2.useRef(null);
    useAttachEvent(element, "blur", onBlur);
    useAttachEvent(element, "focus", onFocus);
    useAttachEvent(element, "escape", onEscape);
    useAttachEvent(element, "click", onClick);
    useAttachEvent(element, "loaderror", onLoadError);
    useAttachEvent(element, "loaderstart", onLoaderStart);
    useAttachEvent(element, "networkschange", onNetworksChange);
    useAttachEvent(element, "confirm", onConfirm);
    useAttachEvent(element, "cancel", onCancel);
    useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
    useAttachEvent(element, "shippingratechange", onShippingRateChange);
    useAttachEvent(element, "savedpaymentmethodremove", onSavedPaymentMethodRemove);
    useAttachEvent(element, "savedpaymentmethodupdate", onSavedPaymentMethodUpdate);
    useAttachEvent(element, "change", onChange);
    var readyCallback;
    if (onReady) {
      if (type === "expressCheckout") {
        readyCallback = onReady;
      } else {
        readyCallback = function readyCallback2() {
          onReady(element);
        };
      }
    }
    useAttachEvent(element, "ready", readyCallback);
    React2.useLayoutEffect(function() {
      if (elementRef.current === null && domNode.current !== null && (elements || checkoutSdk)) {
        var newElement = null;
        if (checkoutSdk) {
          var elementsSdk = checkoutSdk;
          var formSdk = checkoutSdk;
          switch (type) {
            case "paymentForm":
              newElement = formSdk.createForm(options);
              break;
            case "payment":
              newElement = elementsSdk.createPaymentElement(options);
              break;
            case "address":
              if ("mode" in options) {
                var mode = options.mode, restOptions = _objectWithoutProperties(options, _excluded);
                if (mode === "shipping") {
                  newElement = elementsSdk.createShippingAddressElement(restOptions);
                } else if (mode === "billing") {
                  newElement = elementsSdk.createBillingAddressElement(restOptions);
                } else {
                  throw new Error("Invalid options.mode. mode must be 'billing' or 'shipping'.");
                }
              } else {
                throw new Error("You must supply options.mode. mode must be 'billing' or 'shipping'.");
              }
              break;
            case "expressCheckout":
              newElement = elementsSdk.createExpressCheckoutElement(options);
              break;
            case "currencySelector":
              newElement = checkoutSdk.createCurrencySelectorElement();
              break;
            case "taxId":
              newElement = elementsSdk.createTaxIdElement(options);
              break;
            case "contactDetails":
              newElement = elementsSdk.createContactDetailsElement();
              break;
            default:
              throw new Error("<".concat(displayName, "> is not supported inside a checkout provider. Use an <Elements> provider instead."));
          }
        } else if (elements) {
          newElement = elements.create(type, options);
        }
        elementRef.current = newElement;
        setElement(newElement);
        if (newElement) {
          newElement.mount(domNode.current);
        }
      }
    }, [elements, checkoutSdk, options]);
    var prevOptions = usePrevious(options);
    React2.useEffect(function() {
      if (!elementRef.current) {
        return;
      }
      var updates = extractAllowedOptionsUpdates(options, prevOptions, ["paymentRequest"]);
      if (updates && "update" in elementRef.current) {
        elementRef.current.update(updates);
      }
    }, [options, prevOptions]);
    React2.useLayoutEffect(function() {
      return function() {
        if (elementRef.current && typeof elementRef.current.destroy === "function") {
          try {
            elementRef.current.destroy();
            elementRef.current = null;
          } catch (error) {
          }
        }
      };
    }, []);
    return /* @__PURE__ */ React2.createElement("div", {
      id,
      className,
      ref: domNode
    });
  };
  var ServerElement = function ServerElement2(props) {
    useElementsOrCheckoutContextWithUseCase("mounts <".concat(displayName, ">"));
    var id = props.id, className = props.className;
    return /* @__PURE__ */ React2.createElement("div", {
      id,
      className
    });
  };
  var Element = isServer2 ? ServerElement : ClientElement;
  Element.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onReady: PropTypes.func,
    onEscape: PropTypes.func,
    onClick: PropTypes.func,
    onLoadError: PropTypes.func,
    onLoaderStart: PropTypes.func,
    onNetworksChange: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onShippingAddressChange: PropTypes.func,
    onShippingRateChange: PropTypes.func,
    onSavedPaymentMethodRemove: PropTypes.func,
    onSavedPaymentMethodUpdate: PropTypes.func,
    options: PropTypes.object
  };
  Element.displayName = displayName;
  Element.__elementType = type;
  return Element;
};
var isServer = typeof window === "undefined";
var EmbeddedCheckoutContext = /* @__PURE__ */ React2.createContext(null);
EmbeddedCheckoutContext.displayName = "EmbeddedCheckoutProviderContext";
var useEmbeddedCheckoutContext = function useEmbeddedCheckoutContext2() {
  var ctx = React2.useContext(EmbeddedCheckoutContext);
  if (!ctx) {
    throw new Error("<EmbeddedCheckout> must be used within <EmbeddedCheckoutProvider>");
  }
  return ctx;
};
var INVALID_STRIPE_ERROR = "Invalid prop `stripe` supplied to `EmbeddedCheckoutProvider`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.";
var EmbeddedCheckoutProvider = function EmbeddedCheckoutProvider2(_ref) {
  var rawStripeProp = _ref.stripe, options = _ref.options, children = _ref.children;
  var parsed = React2.useMemo(function() {
    return parseStripeProp(rawStripeProp, INVALID_STRIPE_ERROR);
  }, [rawStripeProp]);
  var embeddedCheckoutPromise = React2.useRef(null);
  var loadedStripe = React2.useRef(null);
  var _React$useState = React2.useState({
    embeddedCheckout: null
  }), _React$useState2 = _slicedToArray(_React$useState, 2), ctx = _React$useState2[0], setContext = _React$useState2[1];
  React2.useEffect(function() {
    if (loadedStripe.current || embeddedCheckoutPromise.current) {
      return;
    }
    var setStripeAndInitEmbeddedCheckout = function setStripeAndInitEmbeddedCheckout2(stripe) {
      if (loadedStripe.current || embeddedCheckoutPromise.current) return;
      loadedStripe.current = stripe;
      embeddedCheckoutPromise.current = loadedStripe.current.createEmbeddedCheckoutPage(options).then(function(embeddedCheckout) {
        setContext({
          embeddedCheckout
        });
      });
    };
    if (parsed.tag === "async" && !loadedStripe.current && (options.clientSecret || options.fetchClientSecret)) {
      parsed.stripePromise.then(function(stripe) {
        if (stripe) {
          setStripeAndInitEmbeddedCheckout(stripe);
        }
      });
    } else if (parsed.tag === "sync" && !loadedStripe.current && (options.clientSecret || options.fetchClientSecret)) {
      setStripeAndInitEmbeddedCheckout(parsed.stripe);
    }
  }, [parsed, options, ctx, loadedStripe]);
  React2.useEffect(function() {
    return function() {
      if (ctx.embeddedCheckout) {
        embeddedCheckoutPromise.current = null;
        ctx.embeddedCheckout.destroy();
      } else if (embeddedCheckoutPromise.current) {
        embeddedCheckoutPromise.current.then(function() {
          embeddedCheckoutPromise.current = null;
          if (ctx.embeddedCheckout) {
            ctx.embeddedCheckout.destroy();
          }
        });
      }
    };
  }, [ctx.embeddedCheckout]);
  React2.useEffect(function() {
    registerWithStripeJs(loadedStripe);
  }, [loadedStripe]);
  var prevStripe = usePrevious(rawStripeProp);
  React2.useEffect(function() {
    if (prevStripe !== null && prevStripe !== rawStripeProp) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the `stripe` prop after setting it.");
    }
  }, [prevStripe, rawStripeProp]);
  var prevOptions = usePrevious(options);
  React2.useEffect(function() {
    if (prevOptions == null) {
      return;
    }
    if (options == null) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot unset options after setting them.");
      return;
    }
    if (options.clientSecret === void 0 && options.fetchClientSecret === void 0) {
      console.warn("Invalid props passed to EmbeddedCheckoutProvider: You must provide one of either `options.fetchClientSecret` or `options.clientSecret`.");
    }
    if (prevOptions.clientSecret != null && options.clientSecret !== prevOptions.clientSecret) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the client secret after setting it. Unmount and create a new instance of EmbeddedCheckoutProvider instead.");
    }
    if (prevOptions.fetchClientSecret != null && options.fetchClientSecret !== prevOptions.fetchClientSecret) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot change fetchClientSecret after setting it. Unmount and create a new instance of EmbeddedCheckoutProvider instead.");
    }
    if (prevOptions.onComplete != null && options.onComplete !== prevOptions.onComplete) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the onComplete option after setting it.");
    }
    if (prevOptions.onShippingDetailsChange != null && options.onShippingDetailsChange !== prevOptions.onShippingDetailsChange) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the onShippingDetailsChange option after setting it.");
    }
    if (prevOptions.onLineItemsChange != null && options.onLineItemsChange !== prevOptions.onLineItemsChange) {
      console.warn("Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the onLineItemsChange option after setting it.");
    }
  }, [prevOptions, options]);
  return /* @__PURE__ */ React2.createElement(EmbeddedCheckoutContext.Provider, {
    value: ctx
  }, children);
};
var EmbeddedCheckoutClientElement = function EmbeddedCheckoutClientElement2(_ref) {
  var id = _ref.id, className = _ref.className;
  var _useEmbeddedCheckoutC = useEmbeddedCheckoutContext(), embeddedCheckout = _useEmbeddedCheckoutC.embeddedCheckout;
  var isMounted = React2.useRef(false);
  var domNode = React2.useRef(null);
  React2.useLayoutEffect(function() {
    if (!isMounted.current && embeddedCheckout && domNode.current !== null) {
      embeddedCheckout.mount(domNode.current);
      isMounted.current = true;
    }
    return function() {
      if (isMounted.current && embeddedCheckout) {
        try {
          embeddedCheckout.unmount();
          isMounted.current = false;
        } catch (e) {
        }
      }
    };
  }, [embeddedCheckout]);
  return /* @__PURE__ */ React2.createElement("div", {
    ref: domNode,
    id,
    className
  });
};
var EmbeddedCheckoutServerElement = function EmbeddedCheckoutServerElement2(_ref2) {
  var id = _ref2.id, className = _ref2.className;
  useEmbeddedCheckoutContext();
  return /* @__PURE__ */ React2.createElement("div", {
    id,
    className
  });
};
var EmbeddedCheckout = isServer ? EmbeddedCheckoutServerElement : EmbeddedCheckoutClientElement;
createElementComponent("auBankAccount", isServer);
createElementComponent("card", isServer);
createElementComponent("cardNumber", isServer);
createElementComponent("cardExpiry", isServer);
createElementComponent("cardCvc", isServer);
createElementComponent("iban", isServer);
createElementComponent("payment", isServer);
createElementComponent("expressCheckout", isServer);
createElementComponent("paymentRequestButton", isServer);
createElementComponent("linkAuthentication", isServer);
createElementComponent("contactDetails", isServer);
createElementComponent("address", isServer);
createElementComponent("shippingAddress", isServer);
createElementComponent("paymentMethodMessaging", isServer);
createElementComponent("taxId", isServer);
createElementComponent("issuingCardNumberDisplay", isServer);
createElementComponent("issuingCardCvcDisplay", isServer);
createElementComponent("issuingCardExpiryDisplay", isServer);
createElementComponent("issuingCardPinDisplay", isServer);
createElementComponent("issuingCardCopyButton", isServer);
export {
  EmbeddedCheckout as E,
  EmbeddedCheckoutProvider as a
};
