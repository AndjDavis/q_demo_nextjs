"use client";

import { useState } from "react";


export function PaymentForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const amount = parseFloat(data.get("amount"));
    const amountInCents = amount * 100;
    const response = await fetch('/api/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "amount": amountInCents,
        "description": data.get("description"),
        "email": data.get("email"),
        "name": data.get("name"),
      }),
    });

    const invoiceData = await response.json();

    if (invoiceData.error) {
      console.log("Error: ", invoiceData.error);
      setError(invoiceData.error.message);
      return;
    }

    setSuccess(invoiceData.success)
  }

  return (
    <div className="w-full flex flex-col items-center justify-top min-h-screen py-2">
      <div className="flex flex-col items-center p-10 shadow-md">
        <form
          className="w-full text-xl text-black font-semibold flex flex-col"
          onSubmit={handleSubmit}
        >
          {error && (
            <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
              {error}
            </span>
          )}
          {success && (
            <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
              {success}
            </span>
          )}

          <input
            name="name"
            placeholder="Name"
            type="text"
            required
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
          />
          <input
            name="amount"
            placeholder="Amount"
            type="number"
            required
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
          />
          <input
            name="description"
            placeholder="Description"
            type="text"
            required
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
          />

          <button
            className="w-full h-12 px-6 mt-4 text-lg text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700"
            type="submit"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}