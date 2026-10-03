import { usePutheanetaProfile } from "./usePutheanetaProfile";
import "./PutheanetaProfile.css";

function PutheanetaProfile({ onBack }) {
  const {
    activeTab,
    message,
    isSent,
    setMessage,
    handleTabChange,
    handleMessageSubmit,
    goBack,
    facebookUrl,
    managerFacebookUrl,
    ownerDetails,
    lightboxImage,
    setLightboxImage,
    teamDetails
  } = usePutheanetaProfile(onBack);

  return (
    <div className="profile-page">
      {/* Top Header Section */}
      <header className="profile-header">
        <button onClick={goBack} className="back-btn" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
          ← ត្រឡប់ក្រោយ
        </button>
        <span className="profile-header-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
          អំពីម្ចាស់ហាង &amp; ថ្នាក់ដឹកនាំ ផ្ទះបៃតង
        </span>
      </header>

      {/* Main Content Layout */}
      <div className="profile-container">
        {/* Left Side: Team Sidebar Cards */}
        <div className="profile-left-tree-sidebar">
          {/* Card 1: Shop Owner */}
          <div className="profile-left-card founder-sidebar-card">
            <div className="profile-image-wrapper" onClick={() => setLightboxImage(teamDetails.founder.avatar)} title="ចុចដើម្បីមើលរូបភាពពេញ">
              <img
                src={teamDetails.founder.avatar}
                alt={teamDetails.founder.name}
                className="founder-photo"
              />
            </div>
            <h2 className="founder-name" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              {teamDetails.founder.name}
            </h2>
            <p className="founder-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", color: "#2d6a4f", fontWeight: 700 }}>
              {teamDetails.founder.title}
            </p>
            <p className="founder-company" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              {ownerDetails.company}
            </p>

            <div className="profile-social-links">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook-btn"
                style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
              >
                <span>ទាក់ទងតាម Facebook</span>
              </a>
            </div>
          </div>

          {/* Tree connection line */}
          <div className="sidebar-tree-branch">
            <div className="sidebar-branch-line"></div>
          </div>

          {/* Card 2: Website & Operations Manager */}
          <div className="profile-left-card manager-sidebar-card">
            <div className="profile-image-wrapper" onClick={() => setLightboxImage(teamDetails.manager.avatar)} title="ចុចដើម្បីមើលរូបភាពពេញ">
              <img
                src={teamDetails.manager.avatar}
                alt={teamDetails.manager.name}
                className="founder-photo"
              />
            </div>
            <h2 className="founder-name" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              {teamDetails.manager.name}
            </h2>
            <p className="founder-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", color: "#2d6a4f", fontWeight: 700 }}>
              {teamDetails.manager.title}
            </p>
            <p className="founder-company" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              {ownerDetails.company}
            </p>

            <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "#555", fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              <div>✉️ <a href={`mailto:${teamDetails.manager.email}`} style={{ color: "#2d6a4f", textDecoration: "underline" }}>{teamDetails.manager.email}</a></div>
              <div>📞 <strong>{teamDetails.manager.phone}</strong></div>
            </div>

            <div className="profile-social-links" style={{ marginTop: "12px" }}>
              <a
                href={managerFacebookUrl || teamDetails.manager.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook-btn"
                style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
              >
                <span>ទាក់ទងតាម Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Narrative and Tabs */}
        <div className="profile-right-content">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "story" ? "active" : ""}`}
              onClick={() => handleTabChange("story")}
              style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
            >
              រឿងរ៉ាវរបស់យើង
            </button>
            <button
              className={`tab-btn ${activeTab === "mission" ? "active" : ""}`}
              onClick={() => handleTabChange("mission")}
              style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
            >
              បេសកកម្មចម្បង
            </button>
            <button
              className={`tab-btn ${activeTab === "team" ? "active" : ""}`}
              onClick={() => handleTabChange("team")}
              style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
            >
              ថ្នាក់ដឹកនាំ &amp; ក្រុមការងារ
            </button>
            <button
              className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => handleTabChange("contact")}
              style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
            >
              ផ្ញើសារមកកាន់យើង
            </button>
          </div>

          <div className="tab-content-container">
            {/* Tab: Story */}
            {activeTab === "story" && (
              <div className="tab-pane fade-in">
                <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                  សារពីម្ចាស់ហាង ផ្ទះបៃតង
                </h3>
                <p className="story-text" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", lineHeight: "1.8" }}>
                  {ownerDetails.story}
                </p>
                <blockquote className="founder-quote" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", fontStyle: "normal" }}>
                  "ម្ហូបខ្មែរពិតៗ គឺជាការរស់រវើកនៃវប្បធម៌ និងអត្តសញ្ញាណជាតិយើង។ រាល់ចានអាម៉ុក រាល់សម្លឆ្នាំងដី និងរាល់គ្រឿងបុកត្បាល់ថ្ម គឺសុទ្ធតែបង្កប់នូវរឿងរ៉ាវប្រពៃណីដ៏ផូរផង់របស់ដូនតាខ្មែរ។"
                </blockquote>
              </div>
            )}

            {/* Tab: Mission */}
            {activeTab === "mission" && (
              <div className="tab-pane fade-in">
                <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                  សសរស្តម្ភនៃគុណតម្លៃរបស់យើង
                </h3>
                <div className="pillars-grid">
                  {ownerDetails.missionPoints.map((point, index) => (
                    <div key={index} className="pillar-card">
                      <div className="pillar-number">0{index + 1}</div>
                      <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>{point.title}</h4>
                      <p style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>{point.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Team Structure */}
            {activeTab === "team" && (
              <div className="tab-pane fade-in">
                <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                  រចនាសម្ព័ន្ធដឹកនាំហាង
                </h3>
                <div className="team-tree">
                  {/* Top Node: Founder & Owner */}
                  <div className="tree-node founder-node">
                    <div className="node-avatar-wrap">
                      <img src={teamDetails.founder.avatar} alt={teamDetails.founder.name} className="node-avatar" />
                    </div>
                    <div className="node-info">
                      <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>{teamDetails.founder.name}</h4>
                      <p className="node-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", color: "#2d6a4f", fontWeight: 700 }}>
                        {teamDetails.founder.title}
                      </p>
                      <p className="node-desc" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                        {teamDetails.founder.desc}
                      </p>
                      <a
                        href={facebookUrl || teamDetails.founder.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tree-social-link"
                        style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
                      >
                        គណនី Facebook ↗
                      </a>
                    </div>
                  </div>

                  {/* Connecting Branch Line */}
                  <div className="tree-branch">
                    <div className="branch-line"></div>
                  </div>

                  {/* Sub Node: Website & Tech Manager */}
                  <div className="tree-node manager-node">
                    <div className="node-avatar-wrap">
                      <img src={teamDetails.manager.avatar} alt={teamDetails.manager.name} className="node-avatar" />
                    </div>
                    <div className="node-info">
                      <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>{teamDetails.manager.name}</h4>
                      <p className="node-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", color: "#2d6a4f", fontWeight: 700 }}>
                        {teamDetails.manager.title}
                      </p>
                      <p className="node-desc" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                        {teamDetails.manager.desc}
                      </p>
                      <div style={{ margin: "6px 0", fontSize: "0.85rem", fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                        <span>✉️ <a href={`mailto:${teamDetails.manager.email}`} style={{ color: "#2d6a4f" }}>{teamDetails.manager.email}</a></span>
                        <span style={{ marginLeft: "10px" }}>📞 {teamDetails.manager.phone}</span>
                      </div>
                      <a
                        href={managerFacebookUrl || teamDetails.manager.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tree-social-link"
                        style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
                      >
                        គណនី Facebook ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Contact */}
            {activeTab === "contact" && (
              <div className="tab-pane fade-in">
                <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                  ផ្ញើសារមកកាន់យើង
                </h3>
                <p style={{ color: "#40534c", marginBottom: "20px", fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                  មានមតិយោបល់ សំណួរ ឬគំនិតកែលម្អ? សូមផ្ញើសារដោយផ្ទាល់មកកាន់យើងខ្ញុំ។
                </p>

                {isSent ? (
                  <div className="message-success-alert" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                    ✓ សារត្រូវបានផ្ញើដោយជោគជ័យ! សូមអរគុណសម្រាប់ការទាក់ទងមកកាន់ ផ្ទះបៃតង។ ✨
                  </div>
                ) : (
                  <form onSubmit={handleMessageSubmit} className="message-form">
                    <textarea
                      placeholder="សរសេរសារ ឬមតិយោបល់របស់អ្នកនៅទីនេះ..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="message-textarea"
                      rows={5}
                      required
                      style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
                    ></textarea>
                    <button type="submit" className="send-message-btn" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                      ផ្ញើសារឥឡូវនេះ
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for full photo */}
      {lightboxImage && (
        <div className="profile-lightbox-overlay" onClick={() => setLightboxImage("")}>
          <span className="profile-lightbox-close">&times;</span>
          <img
            src={lightboxImage}
            alt="រូបភាពពេញ"
            className="profile-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default PutheanetaProfile;
