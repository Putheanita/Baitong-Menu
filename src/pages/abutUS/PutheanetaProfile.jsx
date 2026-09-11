import { usePutheanetaProfile } from "./usePutheanetaProfile";
import "./PutheanetaProfile.css";

function PutheanetaProfile({ onBack }) {
  // Destructure logic, states, and callbacks from our restored controller hook
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
        <button onClick={goBack} className="back-btn">
          ← Back
        </button>
        <span className="profile-header-title">About the Founder</span>
      </header>

      {/* Main Content Layout */}
      <div className="profile-container">
        {/* Left Side: Team Tree Sidebar with Stacked Cards */}
        <div className="profile-left-tree-sidebar">
          {/* Card 1: Founder & CEO */}
          <div className="profile-left-card founder-sidebar-card">
            <div className="profile-image-wrapper" onClick={() => setLightboxImage(teamDetails.founder.avatar)} title="Click to view full photo">
              <img
                src={teamDetails.founder.avatar}
                alt={teamDetails.founder.name}
                className="founder-photo"
              />
            </div>
            <h2 className="founder-name">{teamDetails.founder.name}</h2>
            <p className="founder-title">{teamDetails.founder.title}</p>
            <p className="founder-company">{ownerDetails.company}</p>

            <div className="profile-social-links">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook-btn"
              >
                <span>Connect on Facebook</span>
              </a>
            </div>
          </div>

          {/* Tree connection line */}
          <div className="sidebar-tree-branch">
            <div className="sidebar-branch-line"></div>
          </div>

          {/* Card 2: General Manager */}
          <div className="profile-left-card manager-sidebar-card">
            <div className="profile-image-wrapper" onClick={() => setLightboxImage(teamDetails.manager.avatar)} title="Click to view full photo">
              <img
                src={teamDetails.manager.avatar}
                alt={teamDetails.manager.name}
                className="founder-photo"
              />
            </div>
            <h2 className="founder-name">{teamDetails.manager.name}</h2>
            <p className="founder-title">{teamDetails.manager.title}</p>
            <p className="founder-company">{ownerDetails.company}</p>

            <div className="profile-social-links">
              <a
                href={managerFacebookUrl || teamDetails.manager.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook-btn"
              >
                <span>Connect on Facebook</span>
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
            >
              My Story
            </button>
            <button
              className={`tab-btn ${activeTab === "mission" ? "active" : ""}`}
              onClick={() => handleTabChange("mission")}
            >
              Our Mission
            </button>
            <button
              className={`tab-btn ${activeTab === "team" ? "active" : ""}`}
              onClick={() => handleTabChange("team")}
            >
              Our Team
            </button>
            <button
              className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => handleTabChange("contact")}
            >
              Send a Message
            </button>
          </div>

          <div className="tab-content-container">
            {/* Tab: Story */}
            {activeTab === "story" && (
              <div className="tab-pane fade-in">
                <h3>A Note from the Founder</h3>
                <p className="story-text">{ownerDetails.story}</p>
                <blockquote className="founder-quote">
                  "Healthy skin starts with pure ingredients. Our commitment is to bring you nature's best recipes for a clean, natural glow."
                </blockquote>
              </div>
            )}

            {/* Tab: Mission */}
            {activeTab === "mission" && (
              <div className="tab-pane fade-in">
                <h3>Our Core Pillars</h3>
                <div className="pillars-grid">
                  {ownerDetails.missionPoints.map((point, index) => (
                    <div key={index} className="pillar-card">
                      <div className="pillar-number">0{index + 1}</div>
                      <h4>{point.title}</h4>
                      <p>{point.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Team Structure Tree */}
            {activeTab === "team" && (
              <div className="tab-pane fade-in">
                <h3>Organization Structure</h3>
                <div className="team-tree">
                  {/* Top Node: Founder & CEO */}
                  <div className="tree-node founder-node">
                    <div className="node-avatar-wrap">
                      <img src={teamDetails.founder.avatar} alt={teamDetails.founder.name} className="node-avatar" />
                    </div>
                    <div className="node-info">
                      <h4>{teamDetails.founder.name}</h4>
                      <p className="node-title">{teamDetails.founder.title}</p>
                      <p className="node-desc">{teamDetails.founder.desc}</p>
                      <a
                        href={facebookUrl || teamDetails.founder.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tree-social-link"
                      >
                        Facebook Profile ↗
                      </a>
                    </div>
                  </div>

                  {/* Connecting Branch Line */}
                  <div className="tree-branch">
                    <div className="branch-line"></div>
                  </div>

                  {/* Sub Node: General Manager */}
                  <div className="tree-node manager-node">
                    <div className="node-avatar-wrap">
                      <img src={teamDetails.manager.avatar} alt={teamDetails.manager.name} className="node-avatar" />
                    </div>
                    <div className="node-info">
                      <h4>{teamDetails.manager.name}</h4>
                      <p className="node-title">{teamDetails.manager.title}</p>
                      <p className="node-desc">{teamDetails.manager.desc}</p>
                      <a
                        href={managerFacebookUrl || teamDetails.manager.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tree-social-link"
                      >
                        Facebook Profile ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Contact */}
            {activeTab === "contact" && (
              <div className="tab-pane fade-in">
                <h3>Contact {ownerDetails.name}</h3>
                <p style={{ color: "#6b6375", marginBottom: "20px" }}>
                  Have feedback, questions, or ideas? Send a direct message below.
                </p>

                {isSent ? (
                  <div className="message-success-alert">
                    Message sent successfully! Thank you for reaching out. ✨
                  </div>
                ) : (
                  <form onSubmit={handleMessageSubmit} className="message-form">
                    <textarea
                      placeholder="Write your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="message-textarea"
                      rows={5}
                      required
                    ></textarea>
                    <button type="submit" className="send-message-btn">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for profile image */}
      {lightboxImage && (
        <div className="profile-lightbox-overlay" onClick={() => setLightboxImage("")}>
          <span className="profile-lightbox-close">&times;</span>
          <img
            src={lightboxImage}
            alt="Full size view"
            className="profile-lightbox-img"
            onClick={(e) => e.stopPropagation()} // Prevent close on clicking the image itself
          />
        </div>
      )}
    </div>
  );
}

export default PutheanetaProfile;
