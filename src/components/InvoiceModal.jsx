import { useState } from "react";
import "./InvoiceModal.css";

export default function InvoiceModal({ invoice, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !invoice) return null;

  const customerName = invoice.customer?.name || "Puthea Nita";
  const customerPhone = invoice.customer?.phone || "015 241471";
  const customerAddress = invoice.customer?.address || "Phnom Penh, Cambodia";
  const customerProvince = invoice.customer?.province || "Phnom Penh";
  const storePhone = invoice.storePhone || "015 241471";

  // 1. Download formatted text receipt file (.txt)
  const handleDownloadFile = () => {
    const invoiceText = `
=====================================================
         SKINCARE CO. - OFFICIAL TAX INVOICE
               វិក្កយបត្រផ្លូវការ / RECEIPT
=====================================================
Invoice No:    ${invoice.id}
Date & Time:   ${invoice.date}
Payment:       ${invoice.paymentMethod}
Status:        ${invoice.status}

-----------------------------------------------------
STORE DETAILS (អ្នកលក់):
Store:         ${invoice.storeName || "SkinCare Co."}
Hotline:       ${storePhone}
Location:      ${invoice.storeCity || "Phnom Penh, Cambodia"}

CUSTOMER & DELIVERY (អតិថិជន):
Name:          ${customerName}
Phone:         ${customerPhone}
Address:       ${customerAddress} (${customerProvince})
=====================================================
ITEMS PURCHASED:
-----------------------------------------------------
${invoice.items
  .map(
    (item, index) =>
      `${index + 1}. ${item.productName} (${item.volume || "Standard"})
   Qty: ${item.quantity}  x  $${item.price.toFixed(2)}  =  $${(item.price * item.quantity).toFixed(2)}`
  )
  .join("\n-----------------------------------------------------\n")}
=====================================================
Subtotal:       $${invoice.subtotal.toFixed(2)}
${invoice.discount > 0 ? `Promo Discount (${invoice.promoCode || "PCHUMBEN20"}): -$${invoice.discount.toFixed(2)}\n` : ""}Shipping:       ${invoice.shipping === 0 ? "FREE" : `$${invoice.shipping.toFixed(2)}`}
-----------------------------------------------------
GRAND TOTAL:    $${invoice.total.toFixed(2)}
=====================================================
🙏 សូមអរគុណសម្រាប់ការគាំទ្រហាងយើងខ្ញុំ!
Thank you for your purchase from SkinCare Co.!
=====================================================
`.trim();

    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Print / Save as PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // 3. Copy Summary
  const handleCopy = () => {
    const text = `
🧾 ${invoice.storeName || "SkinCare Co."} TAX INVOICE
Invoice No: ${invoice.id}
Date: ${invoice.date}
Customer: ${customerName} (${customerPhone})
Address: ${customerAddress}
Payment: ${invoice.paymentMethod}
Items: ${invoice.items.length} item(s)
Total Paid: $${invoice.total.toFixed(2)}
Store Hotline: ${storePhone}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-dialog" onClick={(e) => e.stopPropagation()}>

        {/* ── Official Printable Invoice Sheet ── */}
        <div className="invoice-paper" id="invoice-printable-sheet">

          {/* Top Decorative Header */}
          <div className="inv-header">
            <div className="inv-brand">
              <span className="inv-brand-icon">🌿</span>
              <div>
                <h2 className="inv-brand-name">{invoice.storeName || "SkinCare Co."}</h2>
                <p className="inv-brand-info">Phnom Penh, Cambodia • Hotline: {storePhone}</p>
              </div>
            </div>

            <div className="inv-badge-wrap">
              <span className="inv-badge-paid">✓ PAID &amp; CONFIRMED</span>
            </div>
          </div>

          {/* Khmer Official Title Banner */}
          <div className="inv-title-banner">
            <h3 className="inv-title-kh">វិក្កយបត្រផ្លូវការ</h3>
            <span className="inv-title-en">OFFICIAL TAX INVOICE / RECEIPT</span>
          </div>

          {/* Meta Details Grid */}
          <div className="inv-meta-grid">
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">INVOICE NO:</span>
              <strong className="inv-meta-id">{invoice.id}</strong>
            </div>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">DATE &amp; TIME:</span>
              <span>{invoice.date}</span>
            </div>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">PAYMENT METHOD:</span>
              <span className="inv-payment-text">
                {invoice.paymentMethod === "ABA Bank QR" ? "🏦 ABA Bank QR (Paid)" : "💵 Cash on Delivery"}
              </span>
            </div>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">STORE HOTLINE:</span>
              <strong className="inv-phone-text">{storePhone}</strong>
            </div>
          </div>

          {/* Customer & Delivery Information Block */}
          <div className="inv-parties-box">
            <div className="inv-party-col store-party-col">
              <div className="inv-party-header">
                <span className="inv-party-badge">FROM (អ្នកលក់)</span>
                <span className="inv-store-tag">Official Store</span>
              </div>
              <h4 className="inv-party-name">{invoice.storeName || "SkinCare Co."}</h4>
              <p className="inv-party-line">📍 {invoice.storeCity || "Phnom Penh, Cambodia"}</p>
              <p className="inv-party-line">📞 Hotline: <strong>{storePhone}</strong></p>
            </div>

            <div className="inv-party-col customer-party-col">
              <div className="inv-party-header">
                <span className="inv-party-badge customer-badge">DELIVER TO (អតិថិជន)</span>
                <span className="inv-deliver-tag">🚚 Express Delivery</span>
              </div>
              <h4 className="inv-party-name customer-name-title">👤 {customerName}</h4>
              <p className="inv-party-line">📞 Phone: <strong className="customer-phone-highlight">{customerPhone}</strong></p>
              <p className="inv-party-line">
                📍 Address: <span>{customerAddress}</span>
                {customerProvince && <span className="inv-province-pill">{customerProvince}</span>}
              </p>
              {invoice.customer?.notes && (
                <p className="inv-party-notes">📝 Note: {invoice.customer.notes}</p>
              )}
            </div>
          </div>

          {/* Items Purchased Table */}
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th className="th-item">Product Description</th>
                  <th className="th-center">Qty</th>
                  <th className="th-right">Unit Price</th>
                  <th className="th-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="td-item">
                      <div className="inv-item-info">
                        <span className="inv-item-title">{item.productName}</span>
                        <span className="inv-item-vol">{item.volume || "Standard"}</span>
                      </div>
                    </td>
                    <td className="th-center">{item.quantity}</td>
                    <td className="th-right">${item.price.toFixed(2)}</td>
                    <td className="th-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="inv-totals-box">
            <div className="inv-total-row">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="inv-total-row inv-row-discount">
                <span>🏷️ Promo Discount ({invoice.promoCode || "PCHUMBEN20"} -20%):</span>
                <span>−${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="inv-total-row">
              <span>Shipping &amp; Delivery:</span>
              <span>{invoice.shipping === 0 ? "FREE" : `$${invoice.shipping.toFixed(2)}`}</span>
            </div>
            <div className="inv-total-row inv-row-grand">
              <span>TOTAL PAID (USD):</span>
              <span className="inv-grand-amount">${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Blessing & Note */}
          <div className="inv-footer-blessing">
            <p className="inv-kh-blessing">🙏 សូមអរគុណសម្រាប់ការគាំទ្រ និងទំនុកចិត្តមកលើហាងយើងខ្ញុំ!</p>
            <p className="inv-en-blessing">
              Thank you for shopping with SkinCare Co.! Delivery courier will contact <strong>{customerPhone}</strong>.
            </p>
          </div>

        </div>

        {/* ── Action Buttons Bar (Always on screen, hidden during print) ── */}
        <div className="invoice-modal-actions no-print">
          <button className="inv-btn inv-btn-pdf" onClick={handlePrintPdf} title="Print or Save as PDF">
            🖨️ Save as PDF / Print
          </button>
          <button className="inv-btn inv-btn-save" onClick={handleDownloadFile} title="Download text invoice file">
            💾 Download File (.txt)
          </button>
          <button className="inv-btn inv-btn-copy" onClick={handleCopy} title="Copy invoice summary">
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button className="inv-btn inv-btn-close" onClick={onClose}>
            Done
          </button>
        </div>

        {/* Top-Right Close Button */}
        <button className="inv-modal-close-icon no-print" onClick={onClose} aria-label="Close invoice">
          &times;
        </button>

      </div>
    </div>
  );
}
