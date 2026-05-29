/**
 * Utility functions for billing and invoice calculations
 */

export const calculateInvoiceTotals = ({
  consultationFee = 0,
  medicineCharges = 0,
  labCharges = 0,
  roomCharges = 0,
  discount = 0,
  paidAmount = 0,
  taxRate = 0.08 // 8% GST/Tax
}) => {
  const consult = Number(consultationFee) || 0;
  const meds = Number(medicineCharges) || 0;
  const lab = Number(labCharges) || 0;
  const room = Number(roomCharges) || 0;
  const disc = Number(discount) || 0;
  const paid = Number(paidAmount) || 0;

  const subtotal = consult + meds + lab + room;
  const taxableAmount = Math.max(0, subtotal - disc);
  const tax = Math.round(taxableAmount * taxRate);
  const grandTotal = taxableAmount + tax;
  const balance = Math.max(0, grandTotal - paid);

  return {
    subtotal,
    discount: disc,
    tax,
    grandTotal,
    paidAmount: paid,
    balance
  };
};
