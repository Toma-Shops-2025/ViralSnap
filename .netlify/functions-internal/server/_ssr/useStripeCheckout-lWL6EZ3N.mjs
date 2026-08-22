import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as EmbeddedCheckoutProvider, E as EmbeddedCheckout } from "../_libs/stripe__react-stripe-js.mjs";
import { g as getStripe, a as getStripeEnvironment } from "./stripe-B2IM9WNU.mjs";
import { a as createProCheckoutSession, d as createSupporterCheckoutSession, c as createCoinCheckoutSession } from "./payments.functions-oTpZTTWw.mjs";
function StripeEmbeddedCheckout({
  priceId,
  creatorId,
  plan,
  customerEmail,
  userId,
  returnUrl
}) {
  const fetchClientSecret = async () => {
    const result = plan === "pro" ? await createProCheckoutSession({
      data: {
        customerEmail,
        returnUrl: returnUrl || window.location.href,
        environment: getStripeEnvironment()
      }
    }) : creatorId ? await createSupporterCheckoutSession({
      data: {
        creatorId,
        customerEmail,
        returnUrl: returnUrl || window.location.href,
        environment: getStripeEnvironment()
      }
    }) : await createCoinCheckoutSession({
      data: {
        priceId,
        customerEmail,
        userId,
        returnUrl: returnUrl || window.location.href,
        environment: getStripeEnvironment()
      }
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    return result.clientSecret;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "checkout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmbeddedCheckoutProvider, { stripe: getStripe(), options: { fetchClientSecret }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmbeddedCheckout, {}) }) });
}
function useStripeCheckout() {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [options, setOptions] = reactExports.useState(null);
  const openCheckout = reactExports.useCallback((opts) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);
  const closeCheckout = reactExports.useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);
  const checkoutElement = isOpen && options ? /* @__PURE__ */ jsxRuntimeExports.jsx(StripeEmbeddedCheckout, { ...options }) : null;
  return { openCheckout, closeCheckout, isOpen, checkoutElement };
}
export {
  useStripeCheckout as u
};
