import { useState } from "react";
import "./TableBookingModal.css";

const PARTY_SIZES = [
  { id: "2", label: "២ នាក់", sub: "គូស្នេហ៍ / មិត្តភក្តិ", icon: "👤👤" },
  { id: "4", label: "៣-៤ នាក់", sub: "គ្រួសារតូច", icon: "👨‍👩‍👦" },
  { id: "6", label: "៥-៨ នាក់", sub: "ក្រុមគ្រួសារ / ជួបជុំ", icon: "👨‍👩‍👧‍👦" },
  { id: "10", label: "៩-១៥ នាក់", sub: "ជប់លៀង / កម្មវិធីធំ", icon: "👥👥" }
];

const SEATING_AREAS = [
  { id: "ac", name: "បន្ទប់ម៉ាស៊ីនត្រជាក់ (Indoor AC)", icon: "❄️", desc: "ត្រជាក់ស្រួល បរិយាកាសស្ងប់ស្ងាត់" },
  { id: "garden", name: "សួនច្បារធម្មជាតិ (Garden Terrace)", icon: "🌿", desc: "ខ្យល់អាកាសធម្មជាតិ មើលឃើញដើមឈើបៃតង" },
  { id: "vip", name: "បន្ទប់ពិសេស VIP (Private Room)", icon: "👑", desc: "បន្ទប់ដាច់ដោយឡែក សមស្របការជជែកការងារ" }
];

const TIME_SLOTS = [
  "11:00 ព្រឹក", "11:30 ព្រឹក", "12:00 ថ្ងៃត្រង់", "12:30 ថ្ងៃត្រង់", "01:00 រសៀល",
  "05:30 ល្ងាច", "06:00 ល្ងាច", "06:30 យប់", "07:00 យប់", "07:30 យប់", "08:00 យប់"
];

export default function TableBookingModal({ isOpen, onClose }) {
  const [partySize, setPartySize] = useState("4");
  const [seatingArea, setSeatingArea] = useState("garden");
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("12:00 ថ្ងៃត្រង់");
  const [guestName, setGuestName] = useState("ពុធធានីតា ព្រំ");
  const [guestPhone, setGuestPhone] = useState("015 241471");
  const [specialOccasion, setSpecialOccasion] = useState("ជួបជុំគ្រួសារ (Family Gathering)");
  const [specialRequest, setSpecialRequest] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen) return null;

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) return;

    const newBooking = {
      id: `BT-RES-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      partySize: PARTY_SIZES.find(p => p.id === partySize)?.label || `${partySize} នាក់`,
      seatingArea: SEATING_AREAS.find(a => a.id === seatingArea)?.name || seatingArea,
      date: bookingDate,
      time: timeSlot,
      occasion: specialOccasion,
      request: specialRequest.trim(),
      bookedAt: new Date().toLocaleString("km-KH"),
      status: "បានបញ្ជាក់ជោគជ័យ (Confirmed)"
    };

    try {
      const existing = JSON.parse(localStorage.getItem("baitong_table_reservations") || "[]");
      localStorage.setItem("baitong_table_reservations", JSON.stringify([newBooking, ...existing]));
    } catch (err) {
      console.error("Booking save error:", err);
    }

    setConfirmedBooking(newBooking);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="table-booking-overlay" onClick={handleReset}>
      <div className="table-booking-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="booking-modal-header">
          <div className="booking-header-text">
            <span className="booking-leaf-badge">🌿 ផ្ទះបៃតង (Baitong House)</span>
            <h3 className="booking-modal-title">
              {confirmedBooking ? "ប័ណ្ណកក់តុអាហារផ្លូវការ" : "កក់តុអាហារអនឡាញ (Table Booking)"}
            </h3>
          </div>
          <button className="booking-close-btn" onClick={handleReset} aria-label="Close">
            &times;
          </button>
        </div>

        {/* ── View 1: Booking Confirmation Voucher ── */}
        {confirmedBooking ? (
          <div className="booking-voucher-container">
            <div className="booking-success-banner">
              <span className="success-icon">🎉</span>
              <div>
                <h4 className="success-title">តុរបស់អ្នកត្រូវបានកក់ទុកជោគជ័យ!</h4>
                <p className="success-subtitle">ភោជនីយដ្ឋាន ផ្ទះបៃតង បានរៀបចំទុកតុជូនលោកអ្នករួចរាល់។</p>
              </div>
            </div>

            <div className="booking-voucher-slip">
              <div className="voucher-slip-header">
                <span className="voucher-brand">BAITONG HOUSE • ផ្ទះបៃតង</span>
                <span className="voucher-code">លេខកូដកក់: {confirmedBooking.id}</span>
              </div>

              <div className="voucher-grid">
                <div className="voucher-cell">
                  <span className="cell-label">ឈ្មោះអតិថិជន:</span>
                  <span className="cell-value">{confirmedBooking.guestName}</span>
                </div>
                <div className="voucher-cell">
                  <span className="cell-label">លេខទូរស័ព្ទ:</span>
                  <span className="cell-value">{confirmedBooking.guestPhone}</span>
                </div>
                <div className="voucher-cell">
                  <span className="cell-label">កាលបរិច្ឆេទ:</span>
                  <span className="cell-value">📅 {confirmedBooking.date}</span>
                </div>
                <div className="voucher-cell">
                  <span className="cell-label">ម៉ោងមកដល់:</span>
                  <span className="cell-value">🕒 {confirmedBooking.time}</span>
                </div>
                <div className="voucher-cell">
                  <span className="cell-label">ចំនួនភ្ញៀវ:</span>
                  <span className="cell-value">👥 {confirmedBooking.partySize}</span>
                </div>
                <div className="voucher-cell">
                  <span className="cell-label">ទីតាំងតុ:</span>
                  <span className="cell-value">{confirmedBooking.seatingArea}</span>
                </div>
              </div>

              {confirmedBooking.occasion && (
                <div className="voucher-extra">
                  <span className="extra-label">កម្មវិធី:</span> {confirmedBooking.occasion}
                </div>
              )}

              {confirmedBooking.request && (
                <div className="voucher-extra">
                  <span className="extra-label">សំណើពិសេស:</span> "{confirmedBooking.request}"
                </div>
              )}

              <div className="voucher-footer">
                <p className="voucher-note">
                  📍 ភោជនីយដ្ឋាន ផ្ទះបៃតង | រាជធានីភ្នំពេញ កម្ពុជា • 📞 ខ្សែទូរស័ព្ទកក់តុ: <strong>015 241471</strong>
                </p>
                <div className="voucher-qr-tag">
                  <span>✅ CONFIRMED RESERVATION</span>
                </div>
              </div>
            </div>

            <div className="voucher-actions">
              <button className="voucher-print-btn" onClick={handlePrintSlip}>
                🖨️ បោះពុម្ពប័ណ្ណកក់តុ (Print)
              </button>
              <button className="voucher-done-btn" onClick={handleReset}>
                រួចរាល់ &amp; បិទ
              </button>
            </div>
          </div>
        ) : (
          /* ── View 2: Booking Form ── */
          <form className="booking-form" onSubmit={handleSubmitBooking}>
            
            {/* Step 1: Party Size */}
            <div className="booking-field-group">
              <label className="booking-label">
                1. ជ្រើសរើសចំនួនភ្ញៀវ (Party Size) <span className="req">*</span>
              </label>
              <div className="party-sizes-grid">
                {PARTY_SIZES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`party-size-btn ${partySize === p.id ? "active" : ""}`}
                    onClick={() => setPartySize(p.id)}
                  >
                    <span className="party-icon">{p.icon}</span>
                    <span className="party-title">{p.label}</span>
                    <span className="party-sub">{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Seating Area */}
            <div className="booking-field-group">
              <label className="booking-label">
                2. ជ្រើសរើសទីតាំងតុអាហារ (Seating Area) <span className="req">*</span>
              </label>
              <div className="seating-areas-grid">
                {SEATING_AREAS.map((a) => (
                  <div
                    key={a.id}
                    className={`seating-area-card ${seatingArea === a.id ? "active" : ""}`}
                    onClick={() => setSeatingArea(a.id)}
                  >
                    <span className="area-icon">{a.icon}</span>
                    <div className="area-info">
                      <span className="area-name">{a.name}</span>
                      <span className="area-desc">{a.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Date & Time */}
            <div className="booking-row-2col">
              <div className="booking-field-group">
                <label className="booking-label">
                  3. កាលបរិច្ឆេទ (Date) <span className="req">*</span>
                </label>
                <input
                  type="date"
                  className="booking-input"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="booking-field-group">
                <label className="booking-label">
                  4. ម៉ោងមកដល់ (Time Slot) <span className="req">*</span>
                </label>
                <select
                  className="booking-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="booking-row-2col">
              <div className="booking-field-group">
                <label className="booking-label">
                  5. ឈ្មោះអ្នកកក់ <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="booking-input"
                  placeholder="ឧ. ពុធធានីតា ព្រំ"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>

              <div className="booking-field-group">
                <label className="booking-label">
                  6. លេខទូរស័ព្ទទំនាក់ទំនង <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  className="booking-input"
                  placeholder="ឧ. 015 241471"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Occasion & Request */}
            <div className="booking-row-2col">
              <div className="booking-field-group">
                <label className="booking-label">កម្មវិធី (Occasion)</label>
                <select
                  className="booking-select"
                  value={specialOccasion}
                  onChange={(e) => setSpecialOccasion(e.target.value)}
                >
                  <option value="ជួបជុំគ្រួសារ (Family Gathering)">ជួបជុំគ្រួសារ (Family Gathering)</option>
                  <option value="ខួបកំណើត (Birthday Celebration)">ខួបកំណើត (Birthday Celebration)</option>
                  <option value="ការងារជំនួញ (Business Lunch/Dinner)">ការងារជំនួញ (Business Lunch/Dinner)</option>
                  <option value="ពិធីសាច់ញាតិ (Gathering)">ពិធីជួបជុំមិត្តភក្តិ (Friends Gathering)</option>
                  <option value="ញ៉ាំអាហារធម្មតា (Casual Dining)">ញ៉ាំអាហារធម្មតា (Casual Dining)</option>
                </select>
              </div>

              <div className="booking-field-group">
                <label className="booking-label">សំណើពិសេស (ស្រេចចិត្ត)</label>
                <input
                  type="text"
                  className="booking-input"
                  placeholder="ឧ. សុំតុជាប់បង្អួច, កៅអីកូនក្មេង..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="booking-submit-wrap">
              <button type="submit" className="booking-submit-btn">
                🍽️ បញ្ជាក់ការកក់តុឥឡូវនេះ (Confirm Reservation)
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
