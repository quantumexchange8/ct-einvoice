import React, { useState } from "react";

const InvoiceDetails = ({ invoices }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCheckboxChange = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePreview = () => {
    if (selectedInvoice) {
      setShowPreview(true);
    } else {
      alert("Please select an invoice to preview.");
    }
  };

  return (
    <div>
      <h2>Invoice List</h2>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Invoice Number</th>
            <th>Customer</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedInvoice?.id === invoice.id}
                  onChange={() => handleCheckboxChange(invoice)}
                />
              </td>
              <td>{invoice.number}</td>
              <td>{invoice.customer}</td>
              <td>{invoice.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePreview}>Preview</button>
      {showPreview && selectedInvoice && (
        <div className="preview-modal">
          <h3>Invoice Preview</h3>
          <p><strong>Invoice Number:</strong> {selectedInvoice.number}</p>
          <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
          <p><strong>Amount:</strong> ${selectedInvoice.amount}</p>
          <button onClick={() => setShowPreview(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
