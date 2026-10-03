import { useState } from "react";
import { formatKhmerDateTime } from "../utils/khmerDate";
import "./InvoiceModal.css";

export default function InvoiceModal({ invoice, isOpen, onClose, onTrackOrder }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !invoice) return null;

  const customerName = invoice.customer?.name || "អតិថិជន ផ្ទះបៃតង";
  const customerPhone = invoice.customer?.phone || "015 241471";
  const customerAddress = invoice.customer?.address || "រាជធានីភ្នំពេញ កម្ពុជា";
  const customerProvince = invoice.customer?.province || "Phnom Penh";
  const storePhone = invoice.storePhone || "015 241471";
  const storeName = invoice.storeName || "ផ្ទះបៃតង (Baitong House)";
  const storeOwner = invoice.storeOwner || "CHUM BUNTHARY (ជុំ ប៊ុនថារី)";
  const storeManager = invoice.storeManager || "Putheanita Prom";
  const displayDate = formatKhmerDateTime(invoice.date || invoice.timestamp || new Date());

  const isDineIn = invoice.orderMode === "dine_in";
  const isTakeaway = invoice.orderMode === "takeaway";

  // 1. Download formatted text receipt file (.txt)
  const handleDownloadFile = () => {
    const invoiceText = `
=====================================================
            ភោជនីយដ្ឋាន ផ្ទះបៃតង (BAITONG HOUSE)
               វិក្កយបត្រម្ហូបអាហារ / RECEIPT
=====================================================
លេខវិក្កយបត្រ:      ${invoice.id}
កាលបរិច្ឆេទ & ម៉ោង: ${displayDate}
ប្រភេទកុម្ម៉ង់:      ${isDineIn ? `ញ៉ាំនៅហាង (${invoice.tableNumber || "តុ ០១"})` : isTakeaway ? "ខ្ចប់យកទៅ (Takeaway)" : "ដឹកជញ្ជូនដល់ផ្ទះ"}
${invoice.chefNotes ? `ចំណាំជូនចុងភៅ:     ${invoice.chefNotes}\n` : ""}វិធីសាស្ត្រទូទាត់:    ${invoice.paymentMethod}
ស្ថានភាព:          ${invoice.status}

-----------------------------------------------------
ព័ត៌មានភោជនីយដ្ឋាន (អ្នកលក់):
ហាង:             ${storeName}
ម្ចាស់ហាង:         ${storeOwner}
អ្នកគ្រប់គ្រងវេបសាយ: ${storeManager}
លេខទូរស័ព្ទ:       ${storePhone}
អ៊ីមែល:           putheanitaprom@gmail.com
ទីតាំង:           ${invoice.storeCity || "រាជធានីភ្នំពេញ កម្ពុជា"}

ព័ត៌មានអតិថិជន:
ឈ្មោះ:            ${customerName}
លេខទូរស័ព្ទ:       ${customerPhone}
${isDineIn ? `ទីតាំងតុ:          ${invoice.tableNumber || "តុ ០១"}` : `អាសយដ្ឋាន:        ${customerAddress} (${customerProvince})`}
=====================================================
មុខម្ហូបដែលបានកុម្ម៉ង់:
-----------------------------------------------------
${invoice.items
  .map(
    (item, index) =>
      `${index + 1}. ${item.productName} (${item.volume || "១ចាន"})
   ចំនួន: ${item.quantity}  x  $${item.price.toFixed(2)}  =  $${(item.price * item.quantity).toFixed(2)}`
  )
  .join("\n-----------------------------------------------------\n")}
=====================================================
តម្លៃសរុបរង:       $${invoice.subtotal.toFixed(2)}
${invoice.discount > 0 ? `បញ្ចុះតម្លៃកូដ (${invoice.promoCode || "BAITONG"}): -$${invoice.discount.toFixed(2)}\n` : ""}សេវាដឹកជញ្ជូន:     ${invoice.shipping === 0 ? "ឥតគិតថ្លៃ" : `$${invoice.shipping.toFixed(2)}`}
-----------------------------------------------------
ទឹកប្រាក់សរុបត្រូវបង់: $${invoice.total.toFixed(2)}
=====================================================
🙏 សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការកុម្ម៉ង់ពី ផ្ទះបៃតង (Baitong House)!
ម្ចាស់ហាង: CHUM BUNTHARY • អ្នកគ្រប់គ្រង: Putheanita Prom
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
🧾 វិក្កយបត្រម្ហូបអាហារ - ${storeName}
លេខវិក្កយបត្រ: ${invoice.id}
កាលបរិច្ឆេទ: ${displayDate}
ប្រភេទ: ${isDineIn ? `ញ៉ាំនៅហាង (${invoice.tableNumber})` : isTakeaway ? "ខ្ចប់យកទៅ" : "ដឹកជញ្ជូន"}
${invoice.chefNotes ? `ចំណាំចុងភៅ: ${invoice.chefNotes}\n` : ""}អតិថិជន: ${customerName} (${customerPhone})
ការទូទាត់: ${invoice.paymentMethod}
ចំនួនមុខម្ហូប: ${invoice.items.length} មុខ
ទឹកប្រាក់សរុប: $${invoice.total.toFixed(2)}
លេខទូរស័ព្ទទាក់ទង: ${storePhone}
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
                <h2 className="inv-brand-name" style={{ fontFamily: "'Moul', 'Battambang', serif" }}>
                  {storeName}
                </h2>
                <p className="inv-brand-info" style={{ fontFamily: "'Battambang', sans-serif" }}>
                  ម្ចាស់ហាង: <strong>{storeOwner}</strong> • ទូរស័ព្ទ: <strong>{storePhone}</strong>
                </p>
                <p className="inv-brand-info" style={{ fontFamily: "'Battambang', sans-serif", fontSize: "0.85rem", opacity: 0.85 }}>
                  អ្នកគ្រប់គ្រងគេហទំព័រ: {storeManager}
                </p>
              </div>
            </div>

            <div className="inv-badge-wrap">
              <span className="inv-badge-paid" style={{ fontFamily: "'Battambang', sans-serif" }}>
                ✓ បានបញ្ជាក់ &amp; កំពុងចម្អិន
              </span>
            </div>
          </div>

          {/* Khmer Official Title Banner */}
          <div className="inv-title-banner">
            <h3 className="inv-title-kh" style={{ fontFamily: "'Moul', 'Battambang', serif" }}>
              វិក្កយបត្រម្ហូបអាហារ
            </h3>
            <span className="inv-title-en" style={{ fontFamily: "'Battambang', sans-serif" }}>
              OFFICIAL FOOD ORDER INVOICE &amp; RECEIPT
            </span>
          </div>

          {/* Meta Details Grid */}
          <div className="inv-meta-grid" style={{ fontFamily: "'Battambang', sans-serif" }}>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">លេខវិក្កយបត្រ:</span>
              <strong className="inv-meta-id">{invoice.id}</strong>
            </div>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">កាលបរិច្ឆេទ &amp; ម៉ោង:</span>
              <span>{displayDate}</span>
            </div>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">ប្រភេទកុម្ម៉ង់:</span>
              <span className="inv-order-mode-pill" style={{ color: "#2d6a4f", fontWeight: 700 }}>
                {isDineIn ? `🍽️ ញ៉ាំនៅហាង (${invoice.tableNumber || "តុ ០១"})` : isTakeaway ? "🥡 ខ្ចប់យកទៅ (Takeaway)" : "🛵 ដឹកជញ្ជូនដល់ផ្ទះ"}
              </span>
            </div>
            <div className="inv-meta-col">
              <span className="inv-meta-lbl">វិធីសាស្ត្រទូទាត់:</span>
              <span className="inv-payment-text">
                {invoice.paymentMethod === "ABA Bank KHQR" ? "🏦 ABA Bank KHQR (ទូទាត់រួច)" : "💵 ទូទាត់ប្រាក់ពេលទទួលម្ហូប"}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Information Block */}
          <div className="inv-parties-box" style={{ fontFamily: "'Battambang', sans-serif" }}>
            <div className="inv-party-col store-party-col">
              <div className="inv-party-header">
                <span className="inv-party-badge">អ្នកលក់ (ភោជនីយដ្ឋាន)</span>
                <span className="inv-store-tag">ផ្ទះបាយផ្លូវការ</span>
              </div>
              <h4 className="inv-party-name">{storeName}</h4>
              <p className="inv-party-line">👤 ម្ចាស់ហាង: <strong>{storeOwner}</strong></p>
              <p className="inv-party-line">📍 ទីតាំង: <span>{invoice.storeCity || "រាជធានីភ្នំពេញ កម្ពុជា"}</span></p>
              <p className="inv-party-line">📞 ទូរស័ព្ទ: <strong>{storePhone}</strong></p>
            </div>

            <div className="inv-party-col customer-party-col">
              <div className="inv-party-header">
                <span className="inv-party-badge customer-badge">
                  {isDineIn ? "កុម្ម៉ង់នៅតុ (អតិថិជន)" : isTakeaway ? "ខ្ចប់យកទៅ (អតិថិជន)" : "ដឹកជញ្ជូនជូន (អតិថិជន)"}
                </span>
                <span className="inv-deliver-tag">
                  {isDineIn ? "🍽️ បម្រើដល់តុ" : isTakeaway ? "🥡 ទទួលនៅបញ្ជរ" : "🚚 ដឹកជញ្ជូនរហ័ស"}
                </span>
              </div>
              <h4 className="inv-party-name customer-name-title">👤 {customerName}</h4>
              <p className="inv-party-line">📞 ទូរស័ព្ទ: <strong className="customer-phone-highlight">{customerPhone}</strong></p>
              {isDineIn ? (
                <p className="inv-party-line">
                  📍 ទីតាំងតុ: <strong>{invoice.tableNumber || "តុ ០១"} (ក្នុងភោជនីយដ្ឋាន)</strong>
                </p>
              ) : isTakeaway ? (
                <p className="inv-party-line">
                  ⏱️ ពេលមកទទួល: <strong>{invoice.takeawayTime || "១៥-២០ នាទី (ឆាប់ៗ)"}</strong>
                </p>
              ) : (
                <p className="inv-party-line">
                  📍 អាសយដ្ឋាន: <span>{customerAddress}</span>
                </p>
              )}
              {invoice.customer?.notes && (
                <p className="inv-party-notes">📝 ចំណាំ: {invoice.customer.notes}</p>
              )}
            </div>
          </div>

          {/* Chef Kitchen Notes if any */}
          {invoice.chefNotes && (
            <div style={{
              background: "#fffbeb",
              border: "1px dashed #f59e0b",
              borderRadius: "10px",
              padding: "10px 14px",
              margin: "12px 0",
              fontFamily: "'Battambang', sans-serif"
            }}>
              <span style={{ fontWeight: 700, color: "#b45309", fontSize: "0.85rem" }}>
                👨‍🍳 ចំណាំពិសេសផ្ញើជូនមេចុងភៅ (Kitchen Request):
              </span>
              <p style={{ margin: "3px 0 0", color: "#78350f", fontStyle: "italic", fontSize: "0.88rem" }}>
                "{invoice.chefNotes}"
              </p>
            </div>
          )}

          {/* Items Purchased Table */}
          <div className="inv-table-wrap">
            <table className="inv-table" style={{ fontFamily: "'Battambang', sans-serif" }}>
              <thead>
                <tr>
                  <th className="th-item">មុខម្ហូបខ្មែរ</th>
                  <th className="th-center">ចំនួន</th>
                  <th className="th-right">តម្លៃរាយ</th>
                  <th className="th-right">តម្លៃសរុប</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="td-item">
                      <div className="inv-item-info">
                        <span className="inv-item-title">{item.productName}</span>
                        <span className="inv-item-vol">{item.volume || "១ចាន"}</span>
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
          <div className="inv-totals-box" style={{ fontFamily: "'Battambang', sans-serif" }}>
            <div className="inv-total-row">
              <span>តម្លៃសរុបរង:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="inv-total-row inv-row-discount">
                <span>🏷️ បញ្ចុះតម្លៃកូដ ({invoice.promoCode || "BAITONG"} -20%):</span>
                <span>−${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="inv-total-row">
              <span>សេវាដឹកជញ្ជូន &amp; ខ្ចប់:</span>
              <span>{invoice.shipping === 0 ? "ឥតគិតថ្លៃ" : `$${invoice.shipping.toFixed(2)}`}</span>
            </div>
            <div className="inv-total-row inv-row-grand">
              <span>ទឹកប្រាក់សរុបត្រូវបង់ (ដុល្លារ):</span>
              <span className="inv-grand-amount">${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Blessing & Note */}
          <div className="inv-footer-blessing">
            <p className="inv-kh-blessing" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              🙏 សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការកុម្ម៉ង់ និងការគាំទ្រម្ហូបខ្មែរនៅ ផ្ទះបៃតង!
            </p>
            <p className="inv-en-blessing" style={{ fontFamily: "'Battambang', sans-serif" }}>
              {isDineIn ? `បុគ្គលិកនឹងលើកម្ហូបជូនដល់ ${invoice.tableNumber || "តុរបស់អ្នក"}។` : `បុគ្គលិកនឹងទាក់ទងមកកាន់លេខ ${customerPhone}។`}
            </p>
          </div>

        </div>

        {/* ── Action Buttons Bar ── */}
        <div className="invoice-modal-actions no-print">
          {onTrackOrder && (
            <button
              className="inv-btn inv-btn-track"
              onClick={() => {
                onClose();
                onTrackOrder(invoice);
              }}
              title="តាមដានស្ថានភាពម្ហូបផ្ទាល់"
              style={{
                fontFamily: "'Battambang', sans-serif",
                background: "#2d6a4f",
                color: "#ffffff",
                fontWeight: 700,
                border: "none",
                boxShadow: "0 4px 12px rgba(45, 106, 79, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              🕒 តាមដានស្ថានភាពម្ហូប (Track Order)
            </button>
          )}
          <button className="inv-btn inv-btn-pdf" onClick={handlePrintPdf} title="បោះពុម្ព ឬរក្សាទុកជា PDF" style={{ fontFamily: "'Battambang', sans-serif" }}>
            🖨️ បោះពុម្ព / PDF
          </button>
          <button className="inv-btn inv-btn-save" onClick={handleDownloadFile} title="ទាញយកឯកសារវិក្កយបត្រ (.txt)" style={{ fontFamily: "'Battambang', sans-serif" }}>
            💾 ទាញយក (.txt)
          </button>
          <button className="inv-btn inv-btn-copy" onClick={handleCopy} title="ចម្លងព័ត៌មានសង្ខេប" style={{ fontFamily: "'Battambang', sans-serif" }}>
            {copied ? "✓ បានចម្លង!" : "📋 ចម្លងព័ត៌មាន"}
          </button>
          <button className="inv-btn inv-btn-close" onClick={onClose} style={{ fontFamily: "'Battambang', sans-serif" }}>
            រួចរាល់
          </button>
        </div>

        {/* Top-Right Close Button */}
        <button className="inv-modal-close-icon no-print" onClick={onClose} aria-label="បិទវិក្កយបត្រ">
          &times;
        </button>

      </div>
    </div>
  );
}
