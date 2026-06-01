import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import {
  createCoinCheckoutSession,
  createSupporterCheckoutSession,
} from "@/lib/payments.functions";

interface StripeEmbeddedCheckoutProps {
  // Coin pack purchase
  priceId?: string;
  // Creator supporter subscription
  creatorId?: string;
  customerEmail?: string;
  userId: string;
  returnUrl?: string;
}

export function StripeEmbeddedCheckout({
  priceId,
  creatorId,
  customerEmail,
  userId,
  returnUrl,
}: StripeEmbeddedCheckoutProps) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = creatorId
      ? await createSupporterCheckoutSession({
          data: {
            creatorId,
            customerEmail,
            returnUrl: returnUrl || window.location.href,
            environment: getStripeEnvironment(),
          },
        })
      : await createCoinCheckoutSession({
          data: {
            priceId: priceId!,
            customerEmail,
            userId,
            returnUrl: returnUrl || window.location.href,
            environment: getStripeEnvironment(),
          },
        });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    return result.clientSecret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
