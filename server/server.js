const express = require('express');
const stripe = require('stripe')('pk_test_51PTq9FHxKSecz4CdhXq9Kmim4pfhTLKrwRrit0huvB2x05jhkIHbyPwioVB8bsMfS4YCKz4zVzA03Vjrg4dFnmuu004QAn4BqL'); // Replace with your actual Stripe secret key
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    return next();
  });
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

app.listen(3000, () => console.log('Server running on port 3000'));