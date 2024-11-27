import Stripe from "stripe";

class CheckoutService {
  async stripeConfig(email: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.APP_ORIGIN}/app/sponsor/success`,
      cancel_url: `${process.env.APP_ORIGIN}/app`,
      customer_email: email,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: "AcadPulse Sponsorship",
              description:
                "Become a sponsor of AcadPulse. Allow up to 1000 requests per hour.",
            },
            unit_amount: 49900,
          },
          quantity: 1,
        },
      ],
    });

    return session;
  }
}

export default new CheckoutService();
