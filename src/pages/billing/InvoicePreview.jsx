import React, { useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useReactToPrint } from 'react-to-print';
import { ArrowLeft, Printer, FileText, Image, CheckCircle } from 'lucide-react';
import InvoiceTemplate from '../../components/billing/InvoiceTemplate';
import Button from '../../components/common/Button';

export default function InvoicePreview() {
  const { billing, updateInvoice, addToast } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateRef = useRef(null);

  const invoiceId = searchParams.get('id');
  const invoice = billing.find((inv) => inv.id === invoiceId);

  // Print Handling (using react-to-print v3 contentRef)
  const handlePrint = useReactToPrint({
    contentRef: templateRef,
    documentTitle: `Invoice_${invoiceId}`
  });

  // PDF Download Handling (using html2canvas and jsPDF)
  const downloadPDF = () => {
    if (!invoice) return;
    const element = templateRef.current;
    if (!element) return;

    addToast('Generating PDF soft copy...', 'info');

    // Dynamic import to keep bundle size optimized
    Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]).then(([{ default: html2canvas }, { default: jsPDF }]) => {
      html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 Width in mm
        const pageHeight = 297; // A4 Height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Invoice_${invoice.id}.pdf`);
        addToast('PDF downloaded successfully', 'success');
      }).catch((err) => {
        console.error('PDF Generation failed:', err);
        addToast('Failed to generate PDF', 'danger');
      });
    });
  };

  // Image Download Handling (using html2canvas)
  const saveSoftCopy = () => {
    if (!invoice) return;
    const element = templateRef.current;
    if (!element) return;

    addToast('Capturing soft copy image...', 'info');

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = `Invoice_${invoice.id}.jpg`;
        link.href = imgData;
        link.click();
        addToast('Invoice image saved successfully', 'success');
      }).catch((err) => {
        console.error('Image capture failed:', err);
        addToast('Failed to save soft copy', 'danger');
      });
    });
  };

  // Mark as Paid Handling
  const handleMarkAsPaid = () => {
    if (!invoice) return;

    // Calculate Grand Total to update Paid Amount fully
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

    const updated = {
      ...invoice,
      paymentStatus: 'Paid',
      paidAmount: grandTotal,
      balance: 0
    };

    updateInvoice(updated);
    addToast('Invoice status marked as Paid', 'success');
  };

  if (!invoice) {
    return (
      <div className="p-8 text-center bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-text">Invoice Record Not Found</h3>
        <p className="text-xs text-text-muted">The requested statement could not be resolved in the database.</p>
        <Link to="/billing">
          <Button variant="primary" icon={<ArrowLeft className="h-4 w-4" />}>Back to Billing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <Link to="/billing" className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-border/30 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-text">Preview Invoice Statement</h2>
          <p className="text-xs text-text-muted mt-0.5">Manage print layouts, soft copy exports, and disbursements.</p>
        </div>
      </div>

      {/* Operation Toolbar */}
      <div className="flex flex-wrap gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm justify-between items-center print:hidden">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
            Print Invoice
          </Button>
          <Button variant="outline" onClick={downloadPDF} icon={<FileText className="h-4 w-4 text-primary" />}>
            Download PDF
          </Button>
          <Button variant="outline" onClick={saveSoftCopy} icon={<Image className="h-4 w-4 text-secondary" />}>
            Save Soft Copy
          </Button>
        </div>

        {invoice.paymentStatus !== 'Paid' && (
          <Button
            variant="ghost"
            className="text-success border-success/20 hover:bg-success/5 font-bold"
            onClick={handleMarkAsPaid}
            icon={<CheckCircle className="h-4 w-4" />}
          >
            Mark as Paid
          </Button>
        )}
      </div>

      {/* Invoice Layout Page Wrapper (Always forced light style inside the template) */}
      <div className="bg-[#0b0f19] dark:bg-[#020617] p-4 sm:p-8 rounded-3xl border border-border shadow-sm overflow-x-auto">
        <div className="min-w-[700px] flex justify-center">
          <InvoiceTemplate ref={templateRef} invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
