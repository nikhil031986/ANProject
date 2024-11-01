const express = require('express');
const stripe = require('stripe')('sk_test_51QE6A0P4RbfVfKlDgZ0cFc1Kr3MCmmWbn6tkXmR33sKJDBYMDDA0Gs6CCvgTRffRjd9smYQg2mywiABUpABsuoo700D5ZRQdAU'); // Replace with your actual Stripe secret key
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // Allow requests from Angular app
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS"); // Allowed methods
  res.header("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header
  next();
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
