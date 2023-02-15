const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser')


const app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require('stripe')('sk_test_51MYcYLLrAAAW4nlkuPT7FB2UQ8WGufwj1j9HSVeOV9g3Rd3kN9VT8gs8YgxKT1dhE6asZ9Kt74FXZFwpdV9L51kP00ES5LIs0I');

app.post('/checkout', async (req, res, next) => {
    try{
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [item.product]
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: 'https://localhost:4242/success.html',
            cancel_url: 'https://localhost:4242/cancel.html'
        });
        res.status(200).json(session);
    } catch (error){
        next(error);
    }
})

app.listen(4242, () => {
    console.log('app listen on 4242');
})
