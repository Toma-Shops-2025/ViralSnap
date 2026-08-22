import { l as loadStripe } from "../_libs/stripe__stripe-js.mjs";
const clientToken = "pk_live_51TfueWEstVb6DbcqpxNFrEi63uWVMeaW0EYeo61vdEkgZsVTUVrctXfJizR9fBB9Vuo8GGq7U5sep0rIx9N21FYz00qKhnpTVD";
function paymentsEnvironment() {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  throw new Error(
    "Stripe payments are not configured for this build. Complete Stripe go-live in your Lovable project to enable production checkout."
  );
}
let stripePromise = null;
function getStripe() {
  if (!stripePromise) {
    paymentsEnvironment();
    stripePromise = loadStripe(clientToken);
  }
  return stripePromise;
}
function getStripeEnvironment() {
  return paymentsEnvironment();
}
export {
  getStripeEnvironment as a,
  getStripe as g
};
