import { PaymentForm } from "../components/paymentForm";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center p-10 shadow-md">
        <h1 className="mt-10 text-4xl font-bold">Dashboard</h1>
      </div>
      <PaymentForm />
    </div>
  );
}