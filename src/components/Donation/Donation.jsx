import React, { useState } from "react";
import "./Donation.scss";

const Donation = () => {
  const [amount, setAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState(null);
  const [message, setMessage] = useState("");

  const donationTiers = [
    { id: 1, name: "Supporter", amount: 500 },
    { id: 2, name: "Contributor", amount: 1000 },
    { id: 3, name: "Patron", amount: 2500 },
    { id: 4, name: "Benefactor", amount: 5000 },
  ];

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setAmount(tier.amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`Thank you for your generous donation of ₹${amount}!`);
    setAmount("");
    setSelectedTier(null);
  };

  return (
    <div className="donation-page">
      <h2>Support CIT Alumni Initiatives</h2>
      <p>
        Your donation helps us support alumni activities, scholarships, and
        development projects at Coimbatore Institute of Technology.
      </p>

      <div className="donation-tiers">
        {donationTiers.map((tier) => (
          <div
            key={tier.id}
            className={`tier-card ${
              selectedTier?.id === tier.id ? "selected" : ""
            }`}
            onClick={() => handleTierSelect(tier)}
          >
            <h3>{tier.name}</h3>
            <p>₹{tier.amount}</p>
          </div>
        ))}
      </div>

      <form className="donation-form" onSubmit={handleSubmit}>
        <label htmlFor="customAmount">Custom Amount (₹)</label>
        <input
          type="number"
          id="customAmount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="1"
        />
        <button type="submit">Donate Now</button>
      </form>

      {message && <p className="thank-you-message">{message}</p>}
    </div>
  );
};

export default Donation;
