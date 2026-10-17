const fs = require('fs');

let html = fs.readFileSync('projects.html', 'utf8');

// 1. Update header and meta
html = html.replace('ALL PROJECTS — 10 VERIFIED BUILDS', 'ALL PROJECTS — 15 VERIFIED BUILDS');
html = html.replace('10 VERIFIED PROJECTS · FULL PORTFOLIO', '15 VERIFIED PROJECTS · FULL PORTFOLIO');
html = html.replace('<span>All Projects (10)</span>', '<span>All Projects (15)</span>');
html = html.replace('ALL 10 PROJECTS VERIFIED', 'ALL 15 PROJECTS VERIFIED');

// 2. Update Card 01: Pawdentify
html = html.replace(
  'id="project-pawdentify" data-repo-url="https://github.com/susatwik/pawdentify"',
  'id="project-pawdentify" data-repo-url="https://github.com/susatwik/pawdentify" data-demo-url="https://pawdentify-frontend.vercel.app"'
);
html = html.replace(
  '<h3 class="project-title"><a href="https://github.com/susatwik/pawdentify" target="_blank" rel="noopener noreferrer">Pawdentify</a></h3>',
  '<h3 class="project-title"><a href="https://pawdentify-frontend.vercel.app" target="_blank" rel="noopener noreferrer">Pawdentify</a></h3>'
);

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

if (html.includes(pawdentifyOldAction)) {
  html = html.replace(pawdentifyOldAction, pawdentifyNewAction);
}

// 3. Update Card 02: Certify (remove generic profile link)
html = html.replace(
  'id="project-certify" data-repo-url="https://github.com/susatwik?tab=repositories"',
  'id="project-certify"'
);
html = html.replace(
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

if (html.includes(certifyOldAction)) {
  html = html.replace(certifyOldAction, certifyNewAction);
}

// Also update mockup link on Certify to avoid generic profile
html = html.replace(
  '<a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="Open Certify repository on GitHub">',
  '<div class="mockup-link" aria-label="Certify platform preview">'
);
// replace closing </a> for mockup if followed by </div></div></article>
html = html.replace(
  '                  </div>\n                </div>\n              </a>\n            </div>\n          </div>\n        </article>\n\n        <!-- Card 03: Task Management App',
  '                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </article>\n\n        <!-- Card 03: Task Management App'
);

// 4. Update Card 03: TaskFlow
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

if (html.includes(taskflowOldAction)) {
  html = html.replace(taskflowOldAction, taskflowNewAction);
}

// 5. Update Card 04: Zero Waste Recipe Generator
html = html.replace(
  'id="project-recipe" data-repo-url="https://github.com/susatwik/Zero-Waste-Recipes-Generator"',
  'id="project-recipe" data-repo-url="https://github.com/susatwik/Zero-Waste-Recipes-Generator" data-demo-url="https://recipe-rescue-connect.lovable.app"'
);
html = html.replace(
  '<h3 class="project-title"><a href="https://github.com/susatwik/Zero-Waste-Recipes-Generator" target="_blank" rel="noopener noreferrer">Zero Waste Recipe Generator</a></h3>',
  '<h3 class="project-title"><a href="https://recipe-rescue-connect.lovable.app" target="_blank" rel="noopener noreferrer">Zero Waste Recipe Generator</a></h3>'
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

if (html.includes(recipeOldAction)) {
  html = html.replace(recipeOldAction, recipeNewAction);
}

// 6. Update Card 05: iMentor
const imentorOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/iMentor-Main" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View iMentor repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const imentorNewAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/iMentor-Main" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View iMentor repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (html.includes(imentorOldAction)) {
  html = html.replace(imentorOldAction, imentorNewAction);
}

// 7. Update Card 06: SASI AICTE IDEA Lab CMS (remove generic profile link)
html = html.replace(
  'id="project-idealab" data-repo-url="https://github.com/susatwik?tab=repositories"',
  'id="project-idealab"'
);
html = html.replace(
  '<h3 class="project-title"><a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer">SASI AICTE IDEA Lab Website &amp; CMS</a></h3>',
  '<h3 class="project-title"><span class="project-title-text">SASI AICTE IDEA Lab Website &amp; CMS</span></h3>'
);

const idealabOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View SASI AICTE IDEA Lab CMS on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const idealabNewAction = `<div class="project-action-row">
                <span class="project-status-pill">Institutional Project</span>
              </div>`;

if (html.includes(idealabOldAction)) {
  html = html.replace(idealabOldAction, idealabNewAction);
}

html = html.replace(
  '<a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="View SASI AICTE IDEA Lab CMS on GitHub">',
  '<div class="mockup-link" aria-label="SASI AICTE IDEA Lab CMS Preview">'
);
html = html.replace(
  '                  </div>\n                </div>\n              </a>\n            </div>\n          </div>\n        </article>\n\n        <!-- Card 07: HireScale AI',
  '                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </article>\n\n        <!-- Card 07: HireScale AI'
);

// 8. Update Card 07: HireScale AI
html = html.replace(
  'id="project-hirescale" data-repo-url="https://github.com/susatwik/stateful-interview-system"',
  'id="project-hirescale" data-repo-url="https://github.com/susatwik/stateful-interview-system" data-demo-url="https://stateful-interview-system.vercel.app/"'
);
html = html.replace(
  '<h3 class="project-title"><a href="https://github.com/susatwik/stateful-interview-system" target="_blank" rel="noopener noreferrer">HireScale AI</a></h3>',
  '<h3 class="project-title"><a href="https://stateful-interview-system.vercel.app/" target="_blank" rel="noopener noreferrer">HireScale AI</a></h3>'
);

const hirescaleOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/stateful-interview-system" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View HireScale AI repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const hirescaleNewAction = `<div class="project-action-row">
                <a href="https://stateful-interview-system.vercel.app/" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View HireScale AI Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <a href="https://github.com/susatwik/stateful-interview-system" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View HireScale AI repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (html.includes(hirescaleOldAction)) {
  html = html.replace(hirescaleOldAction, hirescaleNewAction);
}

// 9. Update Card 08: Barcode Attendance System (remove generic profile link)
html = html.replace(
  'id="project-barcode" data-repo-url="https://github.com/susatwik?tab=repositories"',
  'id="project-barcode"'
);
html = html.replace(
  '<h3 class="project-title"><a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer">Barcode Attendance System</a></h3>',
  '<h3 class="project-title"><span class="project-title-text">Barcode Attendance System</span></h3>'
);

const barcodeOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View Barcode Attendance System on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const barcodeNewAction = `<div class="project-action-row">
                <span class="project-status-pill">Institutional Project</span>
              </div>`;

if (html.includes(barcodeOldAction)) {
  html = html.replace(barcodeOldAction, barcodeNewAction);
}

html = html.replace(
  '<a href="https://github.com/susatwik?tab=repositories" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="View Barcode Attendance System on GitHub">',
  '<div class="mockup-link" aria-label="Barcode Attendance Scanner Preview">'
);
html = html.replace(
  '                  </div>\n                </div>\n              </a>\n            </div>\n          </div>\n        </article>\n\n        <!-- Card 09: Smart Quiz',
  '                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </article>\n\n        <!-- Card 09: Smart Quiz'
);

// 10. Update Card 09: Smart Quiz
const quizOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/tcs-nqt-prep-platform" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View Smart Quiz &amp; Gamification repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const quizNewAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/tcs-nqt-prep-platform" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View Smart Quiz repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (html.includes(quizOldAction)) {
  html = html.replace(quizOldAction, quizNewAction);
}

// 11. Update Card 10: Modern E-Commerce Store
const ecomOldAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/ecommerce-platform" target="_blank" rel="noopener noreferrer" class="project-circle-btn" aria-label="View Modern E-Commerce Store repository on GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>`;

const ecomNewAction = `<div class="project-action-row">
                <a href="https://github.com/susatwik/ecommerce-platform" target="_blank" rel="noopener noreferrer" class="project-action-btn project-repo-btn" aria-label="View Modern E-Commerce Store repository on GitHub">
                  <span>Source Code</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>`;

if (html.includes(ecomOldAction)) {
  html = html.replace(ecomOldAction, ecomNewAction);
}

// 12. Append Cards 11 to 15 if not already added
if (!html.includes('id="project-recovermate"')) {
  const newCards = `
        <!-- Card 11: RecoverMate (AI / WhatsApp Invoice Recovery) -->
        <article class="project-card card-glow-emerald" data-category="ai-ml web-apps backend" id="project-recovermate" data-demo-url="https://recovermate-web.onrender.com">
          <div class="project-card-inner">
            <div class="project-content">
              <div class="project-meta-row">
                <span class="project-num">11</span>
                <span class="project-cat cat-teal">AI / RAG</span>
              </div>
              <h3 class="project-title"><a href="https://recovermate-web.onrender.com" target="_blank" rel="noopener noreferrer">RecoverMate</a></h3>
              <p class="project-desc">
                AI-assisted invoice recovery and dispute handling over WhatsApp, with intent classification, RAG-based dispute support, invoice extraction, and an operational dashboard.
              </p>
              <div class="project-action-row">
                <a href="https://recovermate-web.onrender.com" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View RecoverMate Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <span class="project-status-pill">Private Repository</span>
              </div>
              <div class="project-tech-badges">
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11.91 2c-5.09 0-4.78 2.21-4.78 2.21l.01 2.29h4.87v.69H5.13S2 6.82 2 11.93c0 5.12 2.73 4.94 2.73 4.94h1.63v-2.3s-.09-2.73 2.68-2.73h4.63s2.58.04 2.58-2.52V4.52S16.99 2 11.91 2zm-2.6 1.54a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76z" fill="#3776AB"/><path d="M12.09 22c5.09 0 4.78-2.21 4.78-2.21l-.01-2.29h-4.87v-.69h6.88s3.13.37 3.13-4.74c0-5.12-2.73-4.94-2.73-4.94h-1.63v2.3s.09 2.73-2.68 2.73H10.34s-2.58-.04-2.58 2.52v4.8s-.75 2.52 4.33 2.52zm2.6-1.54a.88.88 0 1 1 0-1.76.88.88 0 0 1 0 1.76z" fill="#FFD438"/></svg></span>
                  <span>Python</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#009688"/><path d="M12 6v6l4 2" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/></svg></span>
                  <span>FastAPI</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.61-.91-2.2-.25-.59-.5-.51-.67-.52-.18-.01-.38-.01-.57-.01-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.72.22 1.36.19 1.88.11.57-.08 1.75-.71 2-1.41.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35z" fill="#25D366"/></svg></span>
                  <span>WhatsApp API</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h3a4 4 0 0 1 4 4v1.5c1.2.7 2 2 2 3.5a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.5V15h-4v1.5c1.2.7 2 2 2 3.5a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.5V15H7a4 4 0 0 1-4-4v-1.5c-1.2-.7-2-2-2-3.5a4 4 0 0 1 8 0c0 1.5-.8 2.8-2 3.5V11h3V9.5C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z" fill="#34D399"/></svg></span>
                  <span>RAG</span>
                </span>
              </div>
            </div>

            <div class="project-visual-wrapper">
              <a href="https://recovermate-web.onrender.com" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="Open RecoverMate Live Demo">
                <div class="mockup-stage mockup-recovermate">
                  <div class="mockup-chat-window">
                    <div class="chat-window-top">
                      <span class="chat-agent-title">● RecoverMate WhatsApp</span>
                      <span class="chat-status-pill">RAG Active</span>
                    </div>
                    <div class="chat-bubble-user">
                      Invoice #4029 dispute: Items received were damaged during transit.
                    </div>
                    <div class="chat-bubble-agent">
                      I've cross-referenced your carrier claim SLA. A revised settlement with 20% discount is available below.
                    </div>
                    <div class="chat-invoice-card">
                      <span class="invoice-sum">$4,850.00 Overdue</span>
                      <span class="invoice-badge">Link Sent ✓</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>

        <!-- Card 12: RestaurantFlow (Full Stack / Restaurant Operations) -->
        <article class="project-card card-glow-amber" data-category="web-apps backend tools" id="project-restaurantflow" data-demo-url="https://restaurant-ordering-kitchen.vercel.app/">
          <div class="project-card-inner">
            <div class="project-content">
              <div class="project-meta-row">
                <span class="project-num">12</span>
                <span class="project-cat cat-amber">Full Stack</span>
              </div>
              <h3 class="project-title"><a href="https://restaurant-ordering-kitchen.vercel.app/" target="_blank" rel="noopener noreferrer">RestaurantFlow</a></h3>
              <p class="project-desc">
                Restaurant operations and order lifecycle management orchestrating customer ordering, kitchen display, server dispatch, and administrator workflows.
              </p>
              <div class="project-action-row">
                <a href="https://restaurant-ordering-kitchen.vercel.app/" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View RestaurantFlow Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <span class="project-status-pill">Private Repository</span>
              </div>
              <div class="project-tech-badges">
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2" transform="rotate(120 12 12)"/></svg></span>
                  <span>React</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#5FA04E"/><path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="#FFFFFF" stroke-width="1.2"/></svg></span>
                  <span>Node.js</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 12h16M12 4v16" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg></span>
                  <span>WebSockets</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="3" fill="#336791" fill-opacity="0.3" stroke="#336791" stroke-width="1.5"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#336791" stroke-width="1.5"/><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#336791" stroke-width="1.5"/></svg></span>
                  <span>PostgreSQL</span>
                </span>
              </div>
            </div>

            <div class="project-visual-wrapper">
              <a href="https://restaurant-ordering-kitchen.vercel.app/" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="Open RestaurantFlow Live Demo">
                <div class="mockup-stage mockup-restaurantflow">
                  <div class="mockup-rest-window">
                    <div class="rest-window-top">
                      <span class="rest-title">Kitchen Display · 4 Tickets</span>
                      <span class="rest-badge">Live Orders</span>
                    </div>
                    <div class="rest-tickets-row">
                      <div class="rest-ticket">
                        <div class="ticket-head"><span>T-14</span><span class="ticket-status-prep">PREP</span></div>
                        <span class="ticket-items">Truffle Pasta x2<br />Crispy Calamari</span>
                      </div>
                      <div class="rest-ticket">
                        <div class="ticket-head"><span>T-08</span><span class="ticket-status-ready">READY</span></div>
                        <span class="ticket-items">Ribeye Steak x1<br />House Caesar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>

        <!-- Card 13: StockEase (Inventory & Prediction Hub) -->
        <article class="project-card card-glow-cyan" data-category="web-apps tools backend" id="project-stockease" data-demo-url="https://codecrafters-stock-control-hub.lovable.app">
          <div class="project-card-inner">
            <div class="project-content">
              <div class="project-meta-row">
                <span class="project-num">13</span>
                <span class="project-cat cat-cyan">Tools</span>
              </div>
              <h3 class="project-title"><a href="https://codecrafters-stock-control-hub.lovable.app" target="_blank" rel="noopener noreferrer">StockEase</a></h3>
              <p class="project-desc">
                Modern inventory management and intelligent stock prediction system providing real-time inventory tracking, low-stock alerts, and predictive replenishment analytics.
              </p>
              <div class="project-action-row">
                <a href="https://codecrafters-stock-control-hub.lovable.app" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View StockEase Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <span class="project-status-pill">Private Repository</span>
              </div>
              <div class="project-tech-badges">
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2" transform="rotate(120 12 12)"/></svg></span>
                  <span>React</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M4.5 10.5h6v1.8H8.5v6.2h-2v-6.2H4.5v-1.8zm7.5 7.9c.9.5 2 .8 3.1.8 1.8 0 2.8-.9 2.8-2.2 0-1.3-.8-1.9-2.2-2.5-.9-.4-1.3-.7-1.3-1.2 0-.5.4-.9 1.2-.9.8 0 1.5.3 2 .6l.6-1.5c-.6-.4-1.5-.6-2.5-.6-1.8 0-2.8 1-2.8 2.2 0 1.2.8 1.9 2.2 2.5 1 .4 1.3.8 1.3 1.3 0 .6-.5 1-1.4 1-.9 0-1.8-.4-2.4-.8l-.6 1.3z" fill="#FFFFFF"/></svg></span>
                  <span>TypeScript</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 6c-3.6 0-5.8 1.8-6.6 5.4 1.4-1.8 3.1-2.5 5.1-2 1.15.28 2 1.15 2.9 2.1 1.5 1.55 3.3 3.4 7.1 3.4 3.6 0 5.8-1.8 6.6-5.4-1.4 1.8-3.1 2.5-5.1 2-1.15-.28-2-1.15-2.9-2.1C17.6 7.85 15.8 6 12 6zM5.4 13.5C1.8 13.5-.4 15.3-1.2 18.9c1.4-1.8 3.1-2.5 5.1-2 1.15.28 2 1.15 2.9 2.1 1.5 1.55 3.3 3.4 7.1 3.4z" transform="scale(0.85) translate(2, 0)" fill="#06B6D4"/></svg></span>
                  <span>Tailwind</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect width="20" height="16" x="2" y="4" rx="2" stroke="#38BDF8" stroke-width="1.5"/><path d="M6 12h4m4 0h4" stroke="#38BDF8" stroke-width="2"/></svg></span>
                  <span>REST APIs</span>
                </span>
              </div>
            </div>

            <div class="project-visual-wrapper">
              <a href="https://codecrafters-stock-control-hub.lovable.app" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="Open StockEase Live Demo">
                <div class="mockup-stage mockup-stockease">
                  <div class="mockup-stock-window">
                    <div class="stock-window-top">
                      <span class="stock-title">Stock Intelligence</span>
                      <span class="stock-health-badge">94% Healthy</span>
                    </div>
                    <div class="stock-item-row">
                      <div class="stock-item-header"><span>SKU-104 Components</span><span>88%</span></div>
                      <div class="stock-bar-wrap"><div class="stock-bar-fill" style="width: 88%;"></div></div>
                    </div>
                    <div class="stock-item-row">
                      <div class="stock-item-header"><span>SKU-892 Microcontrollers</span><span>14% Warn</span></div>
                      <div class="stock-bar-wrap"><div class="stock-bar-warning" style="width: 14%;"></div></div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>

        <!-- Card 14: Diabetes Prediction (Machine Learning / Streamlit) -->
        <article class="project-card card-glow-rose" data-category="ai-ml tools" id="project-diabetes" data-demo-url="https://diabetes-prediction-app0704.streamlit.app">
          <div class="project-card-inner">
            <div class="project-content">
              <div class="project-meta-row">
                <span class="project-num">14</span>
                <span class="project-cat cat-rose">AI / ML</span>
              </div>
              <h3 class="project-title"><a href="https://diabetes-prediction-app0704.streamlit.app" target="_blank" rel="noopener noreferrer">Diabetes Prediction</a></h3>
              <p class="project-desc">
                A clinical machine-learning prediction application deployed with Streamlit, evaluating diagnostic risk indicators through supervised classification models.
              </p>
              <div class="project-action-row">
                <a href="https://diabetes-prediction-app0704.streamlit.app" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View Diabetes Prediction Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <span class="project-status-pill">Private Repository</span>
              </div>
              <div class="project-tech-badges">
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11.91 2c-5.09 0-4.78 2.21-4.78 2.21l.01 2.29h4.87v.69H5.13S2 6.82 2 11.93c0 5.12 2.73 4.94 2.73 4.94h1.63v-2.3s-.09-2.73 2.68-2.73h4.63s2.58.04 2.58-2.52V4.52S16.99 2 11.91 2zm-2.6 1.54a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76z" fill="#3776AB"/><path d="M12.09 22c5.09 0 4.78-2.21 4.78-2.21l-.01-2.29h-4.87v-.69h6.88s3.13.37 3.13-4.74c0-5.12-2.73-4.94-2.73-4.94h-1.63v2.3s.09 2.73-2.68 2.73H10.34s-2.58-.04-2.58 2.52v4.8s-.75 2.52 4.33 2.52zm2.6-1.54a.88.88 0 1 1 0-1.76.88.88 0 0 1 0 1.76z" fill="#FFD438"/></svg></span>
                  <span>Python</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F7931E"/><path d="M8 12l3 3 5-5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg></span>
                  <span>Scikit-Learn</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polygon points="12 2 22 22 2 22" fill="#FF4B4B"/><line x1="12" y1="8" x2="12" y2="16" stroke="#FFFFFF" stroke-width="2"/></svg></span>
                  <span>Streamlit</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect width="18" height="18" x="3" y="3" rx="3" fill="#150458"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#FFFFFF" stroke-width="1.5"/></svg></span>
                  <span>Pandas</span>
                </span>
              </div>
            </div>

            <div class="project-visual-wrapper">
              <a href="https://diabetes-prediction-app0704.streamlit.app" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="Open Diabetes Prediction Live Demo">
                <div class="mockup-stage mockup-diabetes">
                  <div class="mockup-ml-window">
                    <div class="ml-window-top">
                      <span class="ml-title">Streamlit ML Model</span>
                      <span class="ml-badge">Supervised</span>
                    </div>
                    <div class="ml-metrics-grid">
                      <div class="ml-metric-box"><div class="metric-val">128</div><div class="metric-lbl">GLUCOSE</div></div>
                      <div class="ml-metric-box"><div class="metric-val">26.8</div><div class="metric-lbl">BMI</div></div>
                      <div class="ml-metric-box"><div class="metric-val">5.8%</div><div class="metric-lbl">HBA1C</div></div>
                    </div>
                    <div class="ml-result-banner">
                      <span class="result-status">● Low Risk Indicator</span>
                      <span class="result-conf">89.2% Conf</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>

        <!-- Card 15: Learn Spark Academy (Voice / Educational Platform) -->
        <article class="project-card card-glow-violet" data-category="ai-ml web-apps tools" id="project-learnspark" data-demo-url="https://learn-spark-academy-voice.lovable.app">
          <div class="project-card-inner">
            <div class="project-content">
              <div class="project-meta-row">
                <span class="project-num">15</span>
                <span class="project-cat cat-violet">Voice AI</span>
              </div>
              <h3 class="project-title"><a href="https://learn-spark-academy-voice.lovable.app" target="_blank" rel="noopener noreferrer">Learn Spark Academy</a></h3>
              <p class="project-desc">
                Voice-enabled interactive educational learning platform integrating speech synthesis, conversational comprehension, and adaptive student modules.
              </p>
              <div class="project-action-row">
                <a href="https://learn-spark-academy-voice.lovable.app" target="_blank" rel="noopener noreferrer" class="project-action-btn project-demo-btn" aria-label="View Learn Spark Academy Live Demo">
                  <span>Live Demo</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <span class="project-status-pill">Private Repository</span>
              </div>
              <div class="project-tech-badges">
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" stroke-width="1.2" transform="rotate(120 12 12)"/></svg></span>
                  <span>React</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#C084FC"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="#C084FC" stroke-width="1.5"/></svg></span>
                  <span>Speech API</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#A855F7" stroke-width="1.5"/><path d="M9 10a3 3 0 0 1 6 0c0 2-3 3-3 3m0 3.5h.01" stroke="#A855F7" stroke-width="1.8"/></svg></span>
                  <span>Voice Synth</span>
                </span>
                <span class="project-badge">
                  <span class="badge-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 6c-3.6 0-5.8 1.8-6.6 5.4 1.4-1.8 3.1-2.5 5.1-2 1.15.28 2 1.15 2.9 2.1 1.5 1.55 3.3 3.4 7.1 3.4 3.6 0 5.8-1.8 6.6-5.4-1.4 1.8-3.1 2.5-5.1 2-1.15-.28-2-1.15-2.9-2.1C17.6 7.85 15.8 6 12 6zM5.4 13.5C1.8 13.5-.4 15.3-1.2 18.9c1.4-1.8 3.1-2.5 5.1-2 1.15.28 2 1.15 2.9 2.1 1.5 1.55 3.3 3.4 7.1 3.4z" transform="scale(0.85) translate(2, 0)" fill="#06B6D4"/></svg></span>
                  <span>Tailwind</span>
                </span>
              </div>
            </div>

            <div class="project-visual-wrapper">
              <a href="https://learn-spark-academy-voice.lovable.app" target="_blank" rel="noopener noreferrer" class="mockup-link" aria-label="Open Learn Spark Academy Live Demo">
                <div class="mockup-stage mockup-learnspark">
                  <div class="mockup-voice-window">
                    <div class="voice-window-top">
                      <span class="voice-title">Adaptive Voice Agent</span>
                      <span class="voice-status-pill">Speaking</span>
                    </div>
                    <div class="voice-wave-container">
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                    </div>
                    <div class="voice-transcript-box">
                      "Exploring transformer self-attention mechanisms..."
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>
`;

  // Insert before closing </div> of work-grid
  html = html.replace('      </div>\n\n      <!-- Bottom Navigation / Return CTA -->', newCards + '\n      </div>\n\n      <!-- Bottom Navigation / Return CTA -->');
}

fs.writeFileSync('projects.html', html, 'utf8');
console.log('projects.html updated successfully.');
