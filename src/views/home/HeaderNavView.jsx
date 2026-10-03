export default function HeaderNavView({
  activeMenu,
  onMenuClick,
  isSearchOpen,
  searchTerm,
  onSearchChange,
  onToggleSearch,
  onOpenCart,
  cartItemCount = 0,
  productCount = 0,
  currentUser,
  onOpenCustomerProfile,
  onLogout,
  onOpenLogin,
  onOpenNotifications,
  unreadNotifCount = 0
}) {
  return (
    <header className="main-header">
      <div className="header-left">
        <a href="/" className="logo" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="logo-icon">🌿</span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
            <span style={{ fontFamily: "'Moul', 'Battambang', serif", fontSize: "1.25rem", color: "#1b4332", letterSpacing: "0.5px" }}>
              ផ្ទះបៃតង
            </span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.76rem", color: "#2d6a4f", fontWeight: 700, letterSpacing: "1px" }}>
              BAITONG HOUSE
            </span>
          </div>
        </a>
        <nav className="main-nav">
          <span
            className={`nav-link ${activeMenu === "Shop" ? "active" : ""}`}
            onClick={() => onMenuClick("Shop")}
            style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
          >
            មុខម្ហូប
          </span>
          <span
            className={`nav-link ${activeMenu === "About" ? "active" : ""}`}
            onClick={() => onMenuClick("About")}
            style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
          >
            អំពីយើង
          </span>
          <span
            className={`nav-link ${activeMenu === "Contact" ? "active" : ""}`}
            onClick={() => onMenuClick("Contact")}
            style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
          >
            កក់តុ &amp; ទំនាក់ទំនង
          </span>
        </nav>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className={`search-container ${isSearchOpen ? "search-open" : ""}`}>
          {isSearchOpen && (
            <input
              type="text"
              className="search-input"
              placeholder="ស្វែងរក អាម៉ុក, ឡុកឡាក់, នំបញ្ចុក..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
            />
          )}
          <button
            className="search-btn"
            onClick={onToggleSearch}
            title={isSearchOpen ? "បិទការស្វែងរក" : "ស្វែងរកមុខម្ហូប"}
            aria-label="Search"
            style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
          >
            {isSearchOpen && !searchTerm ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="search-btn-label">ស្វែងរក</span>
              </>
            )}
          </button>
        </div>

        {/* Cart Bag Button */}
        <button
          className="cart-nav-btn"
          onClick={onOpenCart}
          title="មើលកន្ត្រកម្ហូបរបស់អ្នក"
          aria-label="Food Order Tray"
          style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="cart-nav-label">កន្ត្រកម្ហូប</span>
          {cartItemCount > 0 && (
            <span className="cart-nav-badge">{cartItemCount}</span>
          )}
        </button>

        {/* Alerts & Notifications Bell Button */}
        <button
          type="button"
          className="notif-nav-btn"
          onClick={onOpenNotifications}
          title="ការជូនដំណឹង"
          aria-label="Order Alerts"
          style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
        >
          <span className="notif-nav-icon">🔔</span>
          <span className="notif-nav-label">ដំណឹង</span>
          {unreadNotifCount > 0 && (
            <span className="notif-nav-badge">{unreadNotifCount}</span>
          )}
        </button>

        <span className="item-count-badge" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
          {productCount} មុខម្ហូប
        </span>

        {currentUser?.name ? (
          <>
            <button
              type="button"
              className="user-profile-header-btn"
              onClick={onOpenCustomerProfile}
              title="មើលគណនីអតិថិជន"
              style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="user-header-avatar"
                />
              ) : (
                <span className="user-header-avatar-placeholder">👤</span>
              )}
              <span className="user-header-name">{currentUser.name}</span>
              <span className="user-header-chevron">⚙️</span>
            </button>

            {onLogout && (
              <button
                type="button"
                id="header-logout-btn"
                onClick={onLogout}
                className="logout-btn"
                title="ចាកចេញពីគណនី"
                style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
              >
                ចាកចេញ
              </button>
            )}
          </>
        ) : null}
      </div>
    </header>
  );
}
