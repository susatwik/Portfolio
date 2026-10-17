const fs = require('fs');
const path = require('path');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Update filter count in credentials section
indexHtml = indexHtml.replace('<span>All Credentials (8)</span>', '<span>All Credentials (12)</span>');

// Check if achievement cards are already in indexHtml
if (!indexHtml.includes('id="cred-prayatna"')) {
  const prayatnaCard = `          <!-- Card: Hackathon Prayatna 2.0 (Achievements) -->
          <article class="cred-card cred-item card-glow-amber" data-category="achievements" id="cred-prayatna">
            <div class="cred-card-header">
              <div class="cred-card-icon prayatna-logo-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#F59E0B" fill-opacity="0.3" stroke="#F59E0B" stroke-width="1.6"/>
                </svg>
              </div>
              <div class="cred-card-tags">
                <span class="cred-badge badge-award">RUNNER-UP</span>
                <span class="cred-year-tag">50+ TEAMS</span>
              </div>
            </div>

            <h3 class="cred-card-title">Hackathon Prayatna 2.0 — Runner-up</h3>
            <span class="cred-card-issuer">Prayatna 2.0 Hackathon</span>

            <p class="cred-card-desc">
              Secured Runner-up position in Prayatna 2.0, competing across multi-round technical challenges against 50+ participating engineering teams.
            </p>

            <div class="cred-card-badges">
              <span class="mini-tech-tag">Hackathon</span>
              <span class="mini-tech-tag">Runner-up</span>
              <span class="mini-tech-tag">50+ Teams</span>
            </div>

            <div class="cred-card-bottom">
              <span class="cred-verified-pill">● Verified Achievement</span>
            </div>
          </article>

          <!-- Card: IEEE Quiz Competition (Achievements) -->
          <article class="cred-card cred-item card-glow-blue" data-category="achievements" id="cred-ieee-quiz">
            <div class="cred-card-header">
              <div class="cred-card-icon ieee-logo-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="cred-card-tags">
                <span class="cred-badge badge-award">RUNNER-UP</span>
                <span class="cred-year-tag">IEEE</span>
              </div>
            </div>

            <h3 class="cred-card-title">IEEE Quiz Competition — Runner-up</h3>
            <span class="cred-card-issuer">IEEE Quiz Competition</span>

            <p class="cred-card-desc">
              Achieved Runner-up recognition in technical quiz competition organized by IEEE, evaluating engineering fundamentals, algorithms, and technical aptitude.
            </p>

            <div class="cred-card-badges">
              <span class="mini-tech-tag">IEEE</span>
              <span class="mini-tech-tag">Runner-up</span>
              <span class="mini-tech-tag">Technical Quiz</span>
            </div>

            <div class="cred-card-bottom">
              <span class="cred-verified-pill">● Verified Achievement</span>
            </div>
          </article>

          <!-- Card: ACM Hackathon (Leadership & Events) -->
          <article class="cred-card cred-item card-glow-teal" data-category="leadership achievements" id="cred-acm-hackathon">
            <div class="cred-card-header">
              <div class="cred-card-icon acm-hack-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect width="20" height="20" x="2" y="2" rx="4" fill="#0284C7" fill-opacity="0.25" stroke="#38BDF8" stroke-width="1.5"/>
                  <path d="M8 12h8M12 8v8" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="cred-card-tags">
                <span class="cred-badge badge-lead">ORGANIZER</span>
                <span class="cred-year-tag">100+ PARTICIPANTS</span>
              </div>
            </div>

            <h3 class="cred-card-title">ACM Hackathon — Organizer</h3>
            <span class="cred-card-issuer">ACM Hackathon</span>

            <p class="cred-card-desc">
              Organizer for the ACM collegiate hackathon, coordinating problem statements, mentor facilitation, and event operations for over 100 participants.
            </p>

            <div class="cred-card-badges">
              <span class="mini-tech-tag">ACM</span>
              <span class="mini-tech-tag">Organizer</span>
              <span class="mini-tech-tag">100+ Participants</span>
            </div>

            <div class="cred-card-bottom">
              <span class="cred-verified-pill">● Verified Leadership</span>
            </div>
          </article>

          <!-- Card: INSPIRA 2025 (Leadership & Events) -->
          <article class="cred-card cred-item card-glow-violet" data-category="leadership" id="cred-inspira-card">
            <div class="cred-card-header">
              <div class="cred-card-icon inspira-logo-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" fill="#A855F7" fill-opacity="0.2" stroke="#A855F7" stroke-width="1.5"/>
                  <path d="M12 7v5l3 3" stroke="#C084FC" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="cred-card-tags">
                <span class="cred-badge badge-lead">CORPORATE POC</span>
                <span class="cred-year-tag">INSPIRA 2025</span>
              </div>
            </div>

            <h3 class="cred-card-title">INSPIRA 2025 — Corporate Committee Point of Contact</h3>
            <span class="cred-card-issuer">INSPIRA 2025</span>

            <p class="cred-card-desc">
              Served as Corporate Committee Point of Contact for INSPIRA 2025, handling corporate liaisons, sponsor coordination, and institutional committee operations.
            </p>

            <div class="cred-card-badges">
              <span class="mini-tech-tag">INSPIRA 2025</span>
              <span class="mini-tech-tag">Corporate POC</span>
              <span class="mini-tech-tag">Event Operations</span>
            </div>

            <div class="cred-card-bottom">
              <span class="cred-verified-pill">● Event Leadership</span>
            </div>
          </article>\n\n`;

  indexHtml = indexHtml.replace('<div class="cred-subgrid">', '<div class="cred-subgrid">\n\n' + prayatnaCard);
}

// Update featured Pawdentify in index.html to have data-demo-url and Demo button
indexHtml = indexHtml.replace(
  'id="project-pawdentify" data-repo-url="https://github.com/susatwik/pawdentify"',
  'id="project-pawdentify" data-repo-url="https://github.com/susatwik/pawdentify" data-demo-url="https://pawdentify-frontend.vercel.app"'
);

// Update Pawdentify action row in index.html
const pawdentifyOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/pawdentify" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View Pawdentify repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const pawdentifyNewAction = `<div class="project-action-row">
                <a href="https://pawdentify-frontend.vercel.app" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View Pawdentify Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <a href="https://github.com/susatwik/pawdentify" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View Pawdentify repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (indexHtml.includes(pawdentifyOldAction)) {
  indexHtml = indexHtml.replace(pawdentifyOldAction, pawdentifyNewAction);
}

// Update Certify in index.html to remove generic profile repo
indexHtml = indexHtml.replace(
  'id="project-certify" data-repo-url="https://github.com/susatwik?tab=repositories"',
  'id="project-certify"'
);
indexHtml = indexHtml.replace(
  '<h3 class="project-title"><a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer">Certify</a></h3>',
  '<h3 class="project-title"><span class="project-title-text">Certify</span></h3>'
);

const certifyOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View Certify repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const certifyNewAction = `<div class="project-action-row">
                <span class="project-status-pill">Private Repository</span>
              </div>`;

if (indexHtml.includes(certifyOldAction)) {
  indexHtml = indexHtml.replace(certifyOldAction, certifyNewAction);
}

// Update TaskFlow in index.html
const taskflowOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/taskpilot-ai" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View TaskFlow repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const taskflowNewAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/taskpilot-ai" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View TaskFlow repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (indexHtml.includes(taskflowOldAction)) {
  indexHtml = indexHtml.replace(taskflowOldAction, taskflowNewAction);
}

// Update Zero Waste Recipe Generator in index.html
indexHtml = indexHtml.replace(
  'id="project-recipe" data-repo-url="https://github.com/susatwik/Zero-Waste-Recipes-Generator"',
  'id="project-recipe" data-repo-url="https://github.com/susatwik/Zero-Waste-Recipes-Generator" data-demo-url="https://recipe-rescue-connect.lovable.app"'
);

const recipeOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/Zero-Waste-Recipes-Generator" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View Zero Waste Recipe Generator repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const recipeNewAction = `<div class="project-action-row">
                <a href="https://recipe-rescue-connect.lovable.app" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View Zero Waste Recipe Generator Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <a href="https://github.com/susatwik/Zero-Waste-Recipes-Generator" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View Zero Waste Recipe Generator repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (indexHtml.includes(recipeOldAction)) {
  indexHtml = indexHtml.replace(recipeOldAction, recipeNewAction);
}

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html updated successfully.');
