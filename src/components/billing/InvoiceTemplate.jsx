import React from 'react';
import { Shield } from 'lucide-react';

const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  if (!invoice) return null;

  // Calculate subtotal from categories if itemized services list is empty
  const subtotal = invoice.services && invoice.services.length > 0
    ? invoice.services.reduce((sum, s) => sum + s.charge, 0)
    : (Number(invoice.consultationFee) || 0) +
      (Number(invoice.medicineCharges) || 0) +
      (Number(invoice.labCharges) || 0) +
      (Number(invoice.roomCharges) || 0);

  const discount = Number(invoice.discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number(invoice.tax) || Math.round(taxableAmount * 0.08);
  const grandTotal = Number(invoice.totalAmount) || (taxableAmount + tax);
  const paidAmount = Number(invoice.paidAmount) || (invoice.paymentStatus === 'Paid' ? grandTotal : (invoice.paymentStatus === 'Pending' ? 0 : Math.round(grandTotal / 2)));
  const balance = Math.max(0, grandTotal - paidAmount);

  return (
    <div
      ref={ref}
      className="bg-white text-black p-8 font-sans border border-gray-200 shadow-sm print:shadow-none print:border-none w-full max-w-[210mm] min-h-[297mm] mx-auto flex flex-col justify-between"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact'
      }}
    >
      <div>
        {/* Hospital Letterhead Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#FD3A25] text-white font-bold text-2xl shadow-md">
              Q
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-gray-900">QUEBIX HMS</h2>
              <span className="text-[10px] text-[#FD3A25] font-bold block uppercase tracking-wider -mt-1">
                Smart Healthcare. Simplified Management.
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <h3 className="font-bold text-gray-800 text-sm">Quebix Hospital</h3>
            <p>Quebix Digital Office, Maharashtra, India</p>
            <p>Phone: +91 7769971133</p>
            <p>Email: support@quebixdigital.in</p>
          </div>
        </div>

        {/* Invoice Meta Description */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold tracking-widest text-gray-800 uppercase border-b border-gray-200 pb-2">
            INVOICE STATEMENT
          </h1>
        </div>

        {/* Patient / Doctor Metadata Details */}
        <div className="grid grid-cols-2 gap-6 text-xs mb-8">
          <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Patient Details</span>
            <div className="space-y-1">
              <p className="font-bold text-sm text-gray-900">{invoice.patientName}</p>
              <p className="text-gray-600"><strong>Patient ID:</strong> {invoice.patientId || 'N/A'}</p>
              <p className="text-gray-600"><strong>Attending Doctor:</strong> {invoice.doctorName || 'N/A'}</p>
              <p className="text-gray-600"><strong>Department:</strong> {invoice.department || 'General Medicine'}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Billing Metadata</span>
            <div className="space-y-1">
              <p className="text-gray-900"><strong>Invoice No:</strong> <span className="font-bold">{invoice.id}</span></p>
              <p className="text-gray-600"><strong>Date Issued:</strong> {invoice.date}</p>
              <p className="text-gray-600"><strong>Payment Method:</strong> {invoice.paymentMethod || 'Cash'}</p>
              <p className="text-gray-600">
                <strong>Status:</strong>{' '}
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  invoice.paymentStatus === 'Paid'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : invoice.paymentStatus === 'Partially Paid'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {invoice.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Services Table */}
        <div className="mb-8">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3 border-b border-gray-200 pb-1">
            Itemized Services & Charges
          </span>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600 font-bold bg-gray-50">
                <th className="py-2.5 px-3">Service Description</th>
                <th className="py-2.5 px-3 text-right">Charge (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900 font-medium">
              {invoice.services && invoice.services.length > 0 ? (
                invoice.services.map((srv, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3">{srv.name}</td>
                    <td className="py-3 px-3 text-right">₹{Number(srv.charge).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <>
                  {Number(invoice.consultationFee) > 0 && (
                    <tr>
                      <td className="py-3 px-3">Clinician Consultation Fee</td>
                      <td className="py-3 px-3 text-right">₹{Number(invoice.consultationFee).toLocaleString()}</td>
                    </tr>
                  )}
                  {Number(invoice.medicineCharges) > 0 && (
                    <tr>
                      <td className="py-3 px-3">Pharmacy Prescriptions & Medicines</td>
                      <td className="py-3 px-3 text-right">₹{Number(invoice.medicineCharges).toLocaleString()}</td>
                    </tr>
                  )}
                  {Number(invoice.labCharges) > 0 && (
                    <tr>
                      <td className="py-3 px-3">Laboratory Diagnostics & Pathology Tests</td>
                      <td className="py-3 px-3 text-right">₹{Number(invoice.labCharges).toLocaleString()}</td>
                    </tr>
                  )}
                  {Number(invoice.roomCharges) > 0 && (
                    <tr>
                      <td className="py-3 px-3">ICU / Ward Bed Admission Charges</td>
                      <td className="py-3 px-3 text-right">₹{Number(invoice.roomCharges).toLocaleString()}</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end pt-4 border-t border-gray-200 mb-8">
          <div className="w-72 space-y-2 text-xs text-right">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Subtotal:</span>
              <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Discount Applied:</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Tax / GST (8%):</span>
              <span className="font-bold text-gray-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-2 text-sm font-extrabold text-gray-900">
              <span>Grand Total Amount:</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Amount Paid:</span>
              <span className="font-bold text-gray-900">₹{paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 text-xs font-bold text-gray-800">
              <span>Balance Due Amount:</span>
              <span className={balance > 0 ? 'text-red-600 font-bold' : 'text-gray-800'}>
                ₹{balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature and T&C Footnote */}
      <div>
        <div className="grid grid-cols-2 gap-8 items-end pt-8 border-t border-gray-200">
          <div className="text-[9px] text-gray-400 space-y-1">
            <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Terms & Conditions</p>
            <p>1. Invoices are payable net-15 days from emission statement.</p>
            <p>2. Insurance disbursements are subject to policy approval coverages.</p>
            <p>3. This is a computer-generated billing slip. No physical signature is required.</p>
            <p className="text-gray-500">For questions, contact billing support: <strong>support@quebixdigital.in</strong></p>
          </div>
          <div className="flex flex-col items-center ml-auto w-48 text-center text-xs">
            <div className="w-full border-b border-gray-800 mb-1 h-8 flex items-end justify-center font-serif italic text-gray-700">
              Quebix Billing Clerk
            </div>
            <span className="font-bold text-gray-900 block">Authorized Signature</span>
            <span className="text-[10px] text-gray-500 block">Quebix Digital Billing Unit</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-[9px] text-gray-400 border-t border-gray-100 pt-4">
          Smart Healthcare. Simplified Management. Powered by Quebix Digital. Thank you for choosing us.
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
