import React from 'react';
import { Link } from 'react-router-dom';

// Helper component to avoid repetition for each step
const Step = ({ to, label, enabled }) => {
  const activeClasses = 'text-indigo-600 font-semibold hover:text-indigo-800';
  const disabledClasses = 'text-gray-400 cursor-not-allowed';

  return (
    <div>
      {enabled ? (
        <Link to={to} className={activeClasses}>
          {label}
        </Link>
      ) : (
        <span className={disabledClasses}>{label}</span>
      )}
    </div>
  );
};

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center items-center my-4 space-x-4">
      <Step to="/login" label="Sign In" enabled={step1} />

      <span className="text-gray-300">›</span>

      <Step to="/shipping" label="Shipping" enabled={step2} />

      <span className="text-gray-300">›</span>

      <Step to="/payment" label="Payment" enabled={step3} />

      <span className="text-gray-300">›</span>

      <Step to="/placeorder" label="Place Order" enabled={step4} />
    </nav>
  );
};

export default CheckoutSteps;