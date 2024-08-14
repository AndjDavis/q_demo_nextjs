import { NextResponse } from 'next/server';
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_KEY);

const handler = async function (req, res) {
  const { amount, description, email, name, } = req.body;

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: email,
    });

    // Create the invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      amount: amount,
      currency: 'usd',
      description: description,
    });

    // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 30,
    });

    // Finalize and send the invoice
    await stripe.invoices.finalizeInvoice(invoice.id);

    // Save the invoice details in your Django backend
    const saveResponse = await fetch('http://127.0.0.1:8000/api/invoice/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        amount: amount,
        stripe_invoice_id: invoice.id,
        stripe_customer_id: customer.id,
        vendor: 1,
        fee_applied: 20,
      }),
    });

    console.log("Response from backend", response)
    if (!saveResponse.ok) {
      throw new Error('Failed to save invoice on the backend');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}

export { handler as POST };