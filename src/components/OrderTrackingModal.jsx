import { useState, useEffect } from "react";
import "./OrderTrackingModal.css";

export default function OrderTrackingModal({ isOpen, onClose, activeOrder }) {
  // If no specific activeOrder passed, look in localStorage for the latest invoice
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Received, 2: Cooking, 3: Ready/Delivery, 4: Done
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes countdown in seconds

  useEffect(() => {
    if (activeOrder) {
      setOrder(activeOrder);
    } else {
      try {
        const invoices = JSON.parse(localStorage.getItem("skincare_invoices") || "[]");
        if (invoices.length > 0) {
          setOrder(invoices[0]);
        }
      } catch (e) {
        console.error("Error reading past invoices:", e);
      }
    }
  }, [activeOrder, isOpen]);

  // Simulate realistic kitchen progress over time or manual progress
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto-advance step simulation (Step 1 -> Step 2 after 15s)
    const stepTimer = setTimeout(() => {
      if (currentStep === 1) setCurrentStep(2);
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(stepTimer);
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isDineIn = order?.orderMode === "dine_in";
  const isTakeaway = order?.orderMode === "takeaway";

  const steps = [
    {
      id: 1,
      icon: "📝",
      title: "បានទទួលការកុម្ម៉ង់",
      desc: "ភោជនីយដ្ឋានបានទទួលការកុម្ម៉ង់របស់អ្នករួចរាល់",
      badge: "បញ្ជាក់រួច"
    },
    {
      id: 2,
      icon: "👨‍🍳",
      title: "កំពុងចម្អិនក្នុងផ្ទះបាយ",
      desc: "មេចុងភៅ ជុំ ប៊ុនថារី កំពុងចម្អិនម្ហូបស្រស់ៗថ្មីៗ",
      badge: "កំពុងចម្អិន"
    },
    {
      id: 3,
      icon: isDineIn ? "🍽️" : isTakeaway ? "🥡" : "🛵",
      title: isDineIn ? "កំពុងរៀបចំលើកជូនតុ" : isTakeaway ? "រួចរាល់សម្រាប់មកយក" : "កំពុងដឹកជញ្ជូន",
      desc: isDineIn
        ? `បុគ្គលិកកំពុងលើកម្ហូបជូននៅ ${order?.tableNumber || "តុរបស់អ្នក"}`
        : isTakeaway
        ? "ម្ហូបបានខ្ចប់រួចរាល់ អាចមកទទួលនៅបញ្ជរបាន"
        : "អ្នកដឹកជញ្ជូនកំពុងធ្វើដំណើរទៅកាន់អាសយដ្ឋានរបស់អ្នក",
      badge: isDineIn ? "លើកជូន" : isTakeaway ? "មកយក" : "លើផ្លូវ"
    },
    {
      id: 4,
      icon: "✅",
      title: "ទទួលបានជោគជ័យ",
      desc: "សូមពិសារអាហារខ្មែរឱ្យបានឆ្ងាញ់ពិសាពី ផ្ទះបៃតង!",
      badge: "រួចរាល់"
    }
  ];

  return (
    <div className="order-tracker-overlay" onClick={onClose}>
      <div className="order-tracker-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="tracker-header">
          <div className="tracker-header-left">
            <span className="tracker-live-pulse"></span>
            <div>
              <h3 className="tracker-title">តាមដានស្ថានភាពម្ហូបអាហារ (Live Tracker)</h3>
              <p className="tracker-order-id">
                លេខវិក្កយបត្រ: <strong>{order?.id || "INV-BT-LIVE"}</strong>
              </p>
            </div>
          </div>
          <button className="tracker-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Estimated Time & Dining Mode Banner */}
        <div className="tracker-eta-banner">
          <div className="eta-block">
            <span className="eta-label">⏱️ រយៈពេលប៉ាន់ស្មាន:</span>
            <span className="eta-time">{formatSeconds(timeRemaining)} នាទី</span>
          </div>

          <div className="mode-badge">
            {isDineIn ? (
              <span className="badge-dine-in">🍽️ ញ៉ាំនៅហាង: {order?.tableNumber || "តុ ០១"}</span>
            ) : isTakeaway ? (
              <span className="badge-takeaway">🥡 ខ្ចប់យកទៅផ្ទះ (Pickup)</span>
            ) : (
              <span className="badge-delivery">🛵 ដឹកជញ្ជូនដល់ផ្ទះ</span>
            )}
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="tracker-timeline">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`timeline-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="timeline-node">
                  <div className="timeline-icon-box">
                    <span className="timeline-icon">{step.icon}</span>
                  </div>
                  {step.id < 4 && <div className="timeline-line"></div>}
                </div>

                <div className="timeline-content">
                  <div className="timeline-title-row">
                    <span className="timeline-step-title">{step.title}</span>
                    {isCurrent && <span className="step-live-tag">កំពុងដំណើរការ</span>}
                    {isCompleted && <span className="step-done-tag">✓ រួចរាល់</span>}
                  </div>
                  <p className="timeline-step-desc">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chef Notes Display if present */}
        {order?.chefNotes && (
          <div className="tracker-chef-notes">
            <span className="chef-notes-title">👨‍🍳 ចំណាំពិសេសផ្ញើជូនមេចុងភៅ:</span>
            <p className="chef-notes-text">"{order.chefNotes}"</p>
          </div>
        )}

        {/* Order Items Summary */}
        {order?.items && order.items.length > 0 && (
          <div className="tracker-items-box">
            <h4 className="tracker-items-heading">ម្ហូបដែលបានកុម្ម៉ង់ ({order.items.length} មុខ):</h4>
            <div className="tracker-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="tracker-item-row">
                  <span className="tracker-item-name">
                    • {item.productName} <span className="tracker-item-qty">x{item.quantity}</span>
                  </span>
                  <span className="tracker-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="tracker-total-row">
              <span>ទឹកប្រាក់សរុប:</span>
              <strong className="tracker-total-amount">${order.total ? order.total.toFixed(2) : "0.00"}</strong>
            </div>
          </div>
        )}

        {/* Interactive Kitchen Test Buttons */}
        <div className="tracker-step-controls">
          <span className="step-ctrl-label">សាកល្បងប្តូរដំណាក់កាល:</span>
          <div className="step-ctrl-btns">
            <button
              className={`ctrl-btn ${currentStep === 1 ? "active" : ""}`}
              onClick={() => setCurrentStep(1)}
            >
              1. ទទួល
            </button>
            <button
              className={`ctrl-btn ${currentStep === 2 ? "active" : ""}`}
              onClick={() => setCurrentStep(2)}
            >
              2. ចម្អិន
            </button>
            <button
              className={`ctrl-btn ${currentStep === 3 ? "active" : ""}`}
              onClick={() => setCurrentStep(3)}
            >
              3. លើក/ដឹក
            </button>
            <button
              className={`ctrl-btn ${currentStep === 4 ? "active" : ""}`}
              onClick={() => setCurrentStep(4)}
            >
              4. ជោគជ័យ
            </button>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="tracker-footer">
          <a href="tel:015241471" className="tracker-call-btn">
            📞 ទូរស័ព្ទទៅកាន់ផ្ទះបាយ (015 241471)
          </a>
          <button className="tracker-ok-btn" onClick={onClose}>
            យល់ព្រម
          </button>
        </div>

      </div>
    </div>
  );
}
