/**
 * Comprehensive Automated Test Suite for Susatwik Manuri Portfolio
 * Tests HTML, CSS, JavaScript, and Serverless API endpoint.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const projectsHtml = fs.readFileSync(path.join(rootDir, 'projects.html'), 'utf8');
const css = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');
const handler = require(path.join(rootDir, 'api/contact.js'));

let passed = 0;
let total = 0;

function test(desc, condition) {
  total++;
  const ok = typeof condition === 'function' ? condition() : Boolean(condition);
  if (ok) {
    console.log(`✓ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${desc}`);
  }
}

async function runAll() {
  console.log('\n--- FRONTEND STRUCTURE & DESIGN TESTS ---');

  // 1. Identity & Visual Style
  test('Page retains Susatwik Manuri identity and sathwvikmanuri@gmail.com email',
    html.includes('SUSATWIK MANURI') && html.includes('sathwvikmanuri@gmail.com'));

  test('Contact section has two-column contact-grid container',
    html.includes('class="contact-grid"') && html.includes('contact-intro-col') && html.includes('contact-form-col'));

  test('Headline matches: "Let’s build something meaningful."',
    html.includes('Let’s build') && html.includes('something meaningful.'));

  test('Contact channels layout contains Row 1 social buttons (LinkedIn, WhatsApp, GitHub) and Row 2 full-width Email button',
    html.includes('contact-actions-group') &&
    html.includes('contact-social-row') &&
    html.includes('https://www.linkedin.com/in/susatwik/') &&
    html.includes('linkedin-icon') &&
    html.includes('wa.me/919390174748') &&
    html.includes('whatsapp-icon') &&
    html.includes('href="https://github.com/susatwik"') &&
    html.includes('github-icon') &&
    html.includes('contact-email-btn') &&
    html.includes('href="mailto:sathwvikmanuri@gmail.com"') &&
    html.includes('EMAIL ME') &&
    html.includes('sathwvikmanuri@gmail.com') &&
    css.includes('.contact-social-row') &&
    css.includes('.contact-email-btn'));

  test('Redundant contact details card is completely removed from HTML',
    !html.includes('contact-details-card') && !html.includes('detail-row'));

  test('WhatsApp action button includes official WhatsApp brand mark SVG with .whatsapp-icon',
    html.includes('whatsapp-icon') && html.includes('M17.472 14.382') && css.includes('.whatsapp-icon'));

  test('WhatsApp link contains prefilled encoded message',
    html.includes('Hi%20Susatwik%2C%20I%20visited%20your%20portfolio'));

  test('LinkedIn and GitHub profile links are verified',
    html.includes('https://www.linkedin.com/in/susatwik/') && html.includes('https://github.com/susatwik/'));

  test('Social buttons have platform data attributes in contact section',
    html.includes('data-platform="linkedin"') &&
    html.includes('data-platform="whatsapp"') &&
    html.includes('data-platform="github"'));

  test('LinkedIn social button uses official blue #0A66C2 for hover border, icon, tint, glow, and focus',
    css.includes('#0A66C2') &&
    css.includes('.btn-linkedin:hover') &&
    css.includes('rgba(10, 102, 194, 0.14)') &&
    css.includes('rgba(10, 102, 194, 0.38)') &&
    css.includes('.btn-linkedin:focus-visible'));

  test('WhatsApp social button uses official green #25D366 for hover border, icon, tint, glow, and focus',
    css.includes('#25D366') &&
    css.includes('.btn-whatsapp:hover') &&
    css.includes('rgba(37, 211, 102, 0.14)') &&
    css.includes('rgba(37, 211, 102, 0.38)') &&
    css.includes('.btn-whatsapp:focus-visible'));

  test('GitHub social button uses dark-theme white / neutral style for hover border, icon, tint, glow, and focus',
    css.includes('.btn-github:hover') &&
    css.includes('rgba(255, 255, 255, 0.08)') &&
    css.includes('rgba(255, 255, 255, 0.22)') &&
    css.includes('.btn-github:focus-visible'));

  test('Shared hover rule turning all social buttons green/cyan (#5CE1E6) is removed',
    !css.includes('.social-btn:hover .linkedin-icon,\n.social-btn:hover .whatsapp-icon,\n.social-btn:hover .github-icon {\n  color: #5CE1E6;') &&
    !css.includes('.action-secondary:hover .whatsapp-icon,\n.action-secondary:hover .github-icon {\n  color: #5CE1E6;'));

  test('Footer social links include brand-specific hover and focus styling for LinkedIn, WhatsApp, and GitHub',
    html.includes('footer-linkedin') &&
    html.includes('footer-whatsapp') &&
    html.includes('footer-github') &&
    css.includes('.footer-links-col nav a.footer-linkedin:hover') &&
    css.includes('.footer-links-col nav a.footer-whatsapp:hover') &&
    css.includes('.footer-links-col nav a.footer-github:hover'));

  test('Form contains all 6 required fields and honeypot',
    html.includes('id="contact-name"') &&
    html.includes('id="contact-email"') &&
    html.includes('id="contact-reason"') &&
    html.includes('id="contact-subject"') &&
    html.includes('id="contact-message"') &&
    html.includes('id="contact-url"') &&
    html.includes('id="contact-bot-trap"'));

  test('Reason dropdown contains all required categories',
    html.includes('Job opportunity') &&
    html.includes('Internship opportunity') &&
    html.includes('Freelance project') &&
    html.includes('Full-stack development') &&
    html.includes('AI/ML collaboration') &&
    html.includes('Technical discussion') &&
    html.includes('Hackathon or community collaboration') &&
    html.includes('Other'));

  test('Form includes character counter and consent notice',
    html.includes('id="char-count"') && html.includes('form-consent'));

  test('Form includes accessible status banner and success card',
    html.includes('id="form-status"') && html.includes('id="form-success-card"'));

  test('Availability badge displays "OPEN TO COLLABORATE · 2026"',
    html.includes('OPEN TO COLLABORATE · 2026'));

  test('Contact form contains custom accessible dropdown with ARIA attributes',
    html.includes('id="custom-reason-select"') &&
    html.includes('id="custom-select-trigger"') &&
    html.includes('aria-haspopup="listbox"') &&
    html.includes('id="custom-select-options"') &&
    html.includes('role="listbox"') &&
    html.includes('role="option"'));

  test('Contact section includes centered success celebration modal with required copy',
    html.includes('id="contact-success-modal"') &&
    html.includes('Thank You for Reaching Out!') &&
    html.includes('Your message has been submitted successfully. Thank you for taking the time to connect with me. I appreciate your interest and will review your message and get back to you as soon as possible.') &&
    html.includes('I aim to respond within 24–48 working hours.') &&
    html.includes('Looking forward to connecting with you.') &&
    html.includes('id="modal-btn-close"') &&
    html.includes('CLOSE') &&
    html.includes('placeholder="What would you like to discuss?"') &&
    html.includes('placeholder="Tell me a little about your inquiry, project, or opportunity..."'));

  test('Footer contains 4-column modern layout with dynamic year element',
    html.includes('class="footer-top"') && html.includes('id="current-year"'));

  // 2. About Section & Portrait Verification
  console.log('\n--- ABOUT SECTION & PORTRAIT TESTS ---');
  test('About section displays eyebrow "01 — ABOUT ME"',
    html.includes('01 — ABOUT ME'));

  test('About section embeds real portrait asset assets/susatwik-portrait.png',
    fs.existsSync(path.join(rootDir, 'assets/susatwik-portrait.png')) &&
    html.includes('src="assets/susatwik-portrait.png"'));

  test('About section has two-column editorial layout (portrait col & copy col)',
    html.includes('about-portrait-col') && html.includes('about-copy-col') && html.includes('about-portrait-card'));

  test('About headline contains "Curiosity is where ideas become reality."',
    html.includes('Curiosity is where') && html.includes('ideas become') && html.includes('reality.'));

  test('About body contains new editorial paragraphs with full fidelity', () => {
    const textOnly = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    return textOnly.includes('focused on full-stack development, software engineering, and AI/ML') &&
      textOnly.includes('dependable backend systems and intelligent applications');
  });

  test('About action links include "Explore my work" and "Let’s connect"',
    html.includes('href="#work"') && html.includes('Explore my work') &&
    html.includes('href="#contact"') && html.includes('Let’s connect'));

  // 3. The Stack (Skills) 4-Row Infinite Alternating Logo Carousel Tests
  console.log('\n--- THE STACK 4-ROW INFINITE LOGO CAROUSEL TESTS ---');
  test('Skills section displays eyebrow "02 — THE STACK"',
    html.includes('02 — THE STACK'));

  test('Marquee container contains 4 alternating rows (LTR, RTL, LTR, RTL)', () => {
    const rowCount = (html.match(/class="marquee-row"/g) || []).length;
    return html.includes('class="marquee-container"') &&
      rowCount === 4 &&
      html.includes('track-ltr-1') &&
      html.includes('track-rtl-1') &&
      html.includes('track-ltr-2') &&
      html.includes('track-rtl-2');
  });

  test('Row 1 (LTR) includes core languages & foundations (Python, Java, C, C++, JS, TS, SQL, HTML5, CSS3, Vite)',
    html.includes('track-ltr-1') &&
    html.includes('Python') &&
    html.includes('Java') &&
    html.includes('C++') &&
    html.includes('JavaScript') &&
    html.includes('TypeScript') &&
    html.includes('SQL') &&
    html.includes('HTML5') &&
    html.includes('CSS3') &&
    html.includes('Vite'));

  test('Row 2 (RTL) includes frontend & UI architecture (React, Next.js, Tailwind CSS, Framer Motion, Figma)',
    html.includes('track-rtl-1') &&
    html.includes('React') &&
    html.includes('Next.js') &&
    html.includes('Tailwind CSS') &&
    html.includes('Framer Motion') &&
    html.includes('Figma') &&
    html.includes('GraphQL') &&
    html.includes('WebSockets'));

  test('Row 3 (LTR) includes backend, APIs & databases (Node.js, Express.js, FastAPI, REST APIs, PostgreSQL, Redis, MongoDB)',
    html.includes('track-ltr-2') &&
    html.includes('Node.js') &&
    html.includes('Express.js') &&
    html.includes('FastAPI') &&
    html.includes('REST APIs') &&
    html.includes('PostgreSQL') &&
    html.includes('Redis') &&
    html.includes('MongoDB') &&
    html.includes('Supabase'));

  test('Row 4 (RTL) includes AI / ML, agent frameworks & DevOps (OpenAI, LangChain, LangGraph, LangSmith, Docker, AWS)',
    html.includes('track-rtl-2') &&
    html.includes('OpenAI') &&
    html.includes('LangChain') &&
    html.includes('LangGraph') &&
    html.includes('LangSmith') &&
    html.includes('Hugging Face') &&
    html.includes('Deep Learning') &&
    html.includes('Docker') &&
    html.includes('AWS') &&
    html.includes('Kubernetes'));

  test('Every skill badge contains authentic official vector SVG icon inside .skill-icon-wrap', () => {
    const badges = (html.match(/class="marquee-pill skill-badge"/g) || []).length;
    const iconWraps = (html.match(/class="skill-icon-wrap"/g) || []).length;
    return badges > 0 && badges === iconWraps;
  });

  test('Marquee tracks contain duplicated groups with aria-hidden="true" for seamless infinite looping', () => {
    const hiddenGroups = (html.match(/class="marquee-group" aria-hidden="true"/g) || []).length;
    return hiddenGroups === 4;
  });

  // 4. My Journey Animated Timeline Tests
  console.log('\n--- MY JOURNEY ANIMATED TIMELINE TESTS ---');
  test('Journey section has scroll track container #journey with .journey-scroll-track',
    html.includes('id="journey"') && html.includes('class="journey-scroll-track"'));

  test('Journey header includes section index "03 — THE JOURNEY", "EXPERIENCE & GROWTH" and title "From Curiosity to Impact."',
    html.includes('03 — THE JOURNEY') &&
    html.includes('EXPERIENCE &amp; GROWTH') &&
    html.includes('From Curiosity') && html.includes('Impact.'));

  test('Journey header matches Section 02 structure with .section-head, .eyebrow, .section-rule, and .section-aside',
    html.includes('<div class="section-head">\n              <span class="eyebrow">03 — THE JOURNEY</span>\n              <span class="section-rule"></span>\n              <span class="section-aside">EXPERIENCE &amp; GROWTH</span>\n            </div>'));

  test('Navigation links in header and footer include #journey',
    html.includes('href="#journey">Journey</a>'));

  test('Journey section contains sticky container and ambient particles canvas',
    html.includes('class="journey-sticky"') && html.includes('id="journey-ambient-canvas"'));

  test('Journey section contains SVG curved trajectory with core and glow paths',
    html.includes('class="journey-svg"') &&
    html.includes('id="journey-path-glow"') &&
    html.includes('id="journey-path-core"'));

  test('Journey section contains all 6 milestone nodes along the trajectory', () => {
    const nodeCount = (html.match(/class="journey-node-group/g) || []).length;
    return nodeCount === 6;
  });

  test('Milestone 1: 2021 — Intermediate (MPC) with Education badge',
    html.includes('Intermediate') &&
    html.includes('MPC') &&
    html.includes('2021') &&
    html.includes('badge-education'));

  test('Milestone 2: 2023 — B.Tech in CSE at SASI Institute of Technology & Engineering',
    html.includes('B.Tech in CSE') &&
    html.includes('SASI Institute of Tech') &&
    html.includes('2023'));

  test('Milestone 3: 2024 — Infosys Springboard internship',
    html.includes('Springboard') &&
    html.includes('Infosys Springboard') &&
    html.includes('2024') &&
    html.includes('badge-internship'));

  test('Milestone 4: 2026 — NIT Andhra Pradesh Lead Socratic Agent Developer',
    html.includes('NITAP Internship') &&
    html.includes('NIT Andhra Pradesh') &&
    html.includes('Lead Socratic Agent Developer') &&
    html.includes('2026'));

  test('Milestone 5: 2026 — Machine Learning & AI / Amazon ML Summer School',
    html.includes('Machine Learning &amp; AI') &&
    html.includes('Amazon ML Summer School \'26') &&
    html.includes('2026'));

  test('Milestone 6: NOW / ONGOING — Building What\'s Next',
    html.includes('Building What\'s Next') &&
    html.includes('Full-Stack · AI/ML') &&
    html.includes('ONGOING'));

  test('Journey milestone descriptions are complete, untruncated, and professional',
    html.includes('Built a foundation in mathematics, physics, analytical thinking, and problem-solving.') &&
    html.includes('Developing expertise in software engineering, full-stack development, AI/ML, and building practical applications.') &&
    html.includes('Gained practical software-development experience and strengthened programming and application-development fundamentals through internship and learning activities.') &&
    html.includes('Worked as a Lead Socratic Agent Developer, contributing to AI-agent systems and research-oriented development using the technologies documented in my portfolio.') &&
    html.includes('Selected for Amazon ML Summer School 2026, with learning focused on machine learning and related AI concepts.') &&
    html.includes('Continuing to develop full-stack applications, explore AI/ML systems, and build useful products that address real-world problems.'));

  test('Journey bottom statistics panel contains 4 metrics',
    html.includes('id="journey-stats-bar"') &&
    html.includes('Years of Learning') &&
    html.includes('Internships') &&
    html.includes('Projects Built') &&
    html.includes('More to Explore'));

  // 5. Selected Work (Projects) 2x2 Grid Tests
  console.log('\n--- SELECTED WORK (PROJECTS) 2x2 GRID TESTS ---');
  test('Projects section has anchor #work with class .work',
    html.includes('id="work"') && (html.includes('class="work section"') || html.includes('class="work-section"')));

  test('Work header includes eyebrow "04 — SELECTED WORK" and "A FEW THINGS I’VE BUILT"',
    html.includes('04 — SELECTED WORK') && html.includes('A FEW THINGS I’VE BUILT'));

  test('Work headline matches "Ideas, built into reality." with glowing highlight',
    html.includes('Ideas,') &&
    html.includes('built into <span class="work-highlight">reality.</span>'));

  test('Work section controls bar has all 6 category filters with icons',
    html.includes('data-filter="all"') &&
    html.includes('data-filter="web-apps"') &&
    html.includes('data-filter="ai-ml"') &&
    html.includes('data-filter="backend"') &&
    html.includes('data-filter="tools"') &&
    html.includes('data-filter="mobile"'));

  test('View All Projects button links to projects.html',
    html.includes('href="projects.html"') &&
    html.includes('work-view-all-btn'));

  test('Index page work grid displays exactly 4 featured project cards in 2x2 layout', () => {
    const cardCount = (html.match(/class="project-card /g) || []).length;
    return cardCount === 4;
  });

  test('Index page includes prominent "View All Projects (15) →" button linking to projects.html',
    html.includes('class="work-view-more-cta"') &&
    html.includes('class="work-view-all-full-btn"') &&
    html.includes('href="projects.html"') &&
    html.includes('View All Projects (15)'));

  test('Index page 4 featured projects are Pawdentify, Certify, TaskFlow, and Zero Waste Recipe Generator',
    html.includes('Pawdentify') &&
    html.includes('Certify') &&
    html.includes('TaskFlow') &&
    html.includes('Zero Waste Recipe Generator'));

  test('Dedicated projects.html exists and contains all 15 verified project cards in 2x2 layout', () => {
    const cardCount = (projectsHtml.match(/class="project-card /g) || []).length;
    return cardCount === 15;
  });

  test('Dedicated projects.html includes "← Back to Portfolio" buttons returning to portfolio',
    projectsHtml.includes('id="back-to-portfolio-btn"') &&
    projectsHtml.includes('class="back-to-portfolio-btn"') &&
    projectsHtml.includes('href="index.html#work"') &&
    projectsHtml.includes('Back to Portfolio') &&
    projectsHtml.includes('class="back-to-portfolio-bottom-btn"'));

  test('Projects Page Card 01: Pawdentify with AI/ML category, blue glow, authentic tech badges, and mockup',
    projectsHtml.includes('Pawdentify') &&
    projectsHtml.includes('01') &&
    projectsHtml.includes('card-glow-blue') &&
    projectsHtml.includes('mockup-pawdentify') &&
    projectsHtml.includes('PyTorch') &&
    projectsHtml.includes('OpenCV'));

  test('Projects Page Card 02: Certify with Web App category, violet glow, authentic tech badges, and certificate mockup',
    projectsHtml.includes('Certify') &&
    projectsHtml.includes('02') &&
    projectsHtml.includes('card-glow-violet') &&
    projectsHtml.includes('mockup-certify') &&
    projectsHtml.includes('Next.js') &&
    projectsHtml.includes('Supabase'));

  test('Projects Page Card 03: TaskFlow (Task Management App) with Full Stack category, teal glow, and kanban mockup',
    projectsHtml.includes('TaskFlow') &&
    projectsHtml.includes('03') &&
    projectsHtml.includes('card-glow-teal') &&
    projectsHtml.includes('mockup-taskflow') &&
    projectsHtml.includes('PostgreSQL') &&
    projectsHtml.includes('Express.js'));

  test('Projects Page Card 04: Zero Waste Recipe Generator with AI/RAG category, indigo glow, and RAG query mockup',
    projectsHtml.includes('Zero Waste Recipe Generator') &&
    projectsHtml.includes('04') &&
    projectsHtml.includes('card-glow-indigo') &&
    projectsHtml.includes('mockup-knowledge') &&
    projectsHtml.includes('LangChain') &&
    projectsHtml.includes('LangGraph'));

  test('Projects Page Card 05: iMentor Socratic AI Agent with AI/ML category, cyan glow, and Socratic dialog mockup',
    projectsHtml.includes('iMentor') &&
    projectsHtml.includes('05') &&
    projectsHtml.includes('card-glow-cyan') &&
    projectsHtml.includes('mockup-imentor') &&
    projectsHtml.includes('LangChain') &&
    projectsHtml.includes('FastAPI'));

  test('Projects Page Card 06: SASI AICTE IDEA Lab CMS with Web App category, amber glow, and lab mockup',
    projectsHtml.includes('SASI AICTE IDEA Lab') &&
    projectsHtml.includes('06') &&
    projectsHtml.includes('card-glow-amber') &&
    projectsHtml.includes('mockup-idealab') &&
    projectsHtml.includes('MongoDB') &&
    projectsHtml.includes('Node.js'));

  test('Projects Page Card 07: HireScale AI with AI/ML category, violet glow, and interview evaluation matrix mockup',
    projectsHtml.includes('HireScale AI') &&
    projectsHtml.includes('07') &&
    projectsHtml.includes('card-glow-violet') &&
    projectsHtml.includes('mockup-hirescale') &&
    projectsHtml.includes('FastAPI') &&
    projectsHtml.includes('PostgreSQL'));

  test('Projects Page Card 08: SASI AICTE IDEA Lab Attendance System with Backend category, teal glow, and laser scanner mockup',
    (projectsHtml.includes('SASI AICTE IDEA Lab Attendance System') || projectsHtml.includes('Barcode Attendance System')) &&
    projectsHtml.includes('08') &&
    projectsHtml.includes('card-glow-teal') &&
    projectsHtml.includes('mockup-barcode') &&
    projectsHtml.includes('Java') &&
    projectsHtml.includes('REST APIs'));

  test('Projects Page Card 09: Smart Quiz & Gamification with Web App category, rose glow, and streak multiplier mockup',
    projectsHtml.includes('Smart Quiz') &&
    projectsHtml.includes('09') &&
    projectsHtml.includes('card-glow-rose') &&
    projectsHtml.includes('mockup-quiz') &&
    projectsHtml.includes('WebSockets') &&
    projectsHtml.includes('Redis'));

  test('Projects Page Card 10: Modern E-Commerce Platform with Web App category, blue glow, and storefront mockup',
    projectsHtml.includes('Modern E-Commerce Store') &&
    projectsHtml.includes('10') &&
    projectsHtml.includes('card-glow-blue') &&
    projectsHtml.includes('mockup-ecommerce') &&
    projectsHtml.includes('Stripe') &&
    projectsHtml.includes('MongoDB'));

  test('Projects Page Card 11: RecoverMate with AI/RAG category, emerald glow, and WhatsApp invoice recovery demo',
    projectsHtml.includes('RecoverMate') &&
    projectsHtml.includes('11') &&
    projectsHtml.includes('card-glow-emerald') &&
    projectsHtml.includes('mockup-recovermate') &&
    projectsHtml.includes('https://recovermate-web.onrender.com'));

  test('Projects Page Card 12: RestaurantFlow with Full Stack category, amber glow, and kitchen workflow demo',
    projectsHtml.includes('RestaurantFlow') &&
    projectsHtml.includes('12') &&
    projectsHtml.includes('card-glow-amber') &&
    projectsHtml.includes('mockup-restaurantflow') &&
    projectsHtml.includes('https://restaurant-ordering-kitchen.vercel.app/'));

  test('Projects Page Card 13: StockEase with Tools category, cyan glow, and inventory prediction demo',
    projectsHtml.includes('StockEase') &&
    projectsHtml.includes('13') &&
    projectsHtml.includes('card-glow-cyan') &&
    projectsHtml.includes('mockup-stockease') &&
    projectsHtml.includes('https://codecrafters-stock-control-hub.lovable.app'));

  test('Projects Page Card 14: Diabetes Prediction with AI/ML category, rose glow, and Streamlit prediction demo',
    projectsHtml.includes('Diabetes Prediction') &&
    projectsHtml.includes('14') &&
    projectsHtml.includes('card-glow-rose') &&
    projectsHtml.includes('mockup-diabetes') &&
    projectsHtml.includes('https://diabetes-prediction-app0704.streamlit.app'));

  test('Projects Page Card 15: Learn Spark Academy with Voice AI category, violet glow, and voice demo',
    projectsHtml.includes('Learn Spark Academy') &&
    projectsHtml.includes('15') &&
    projectsHtml.includes('card-glow-violet') &&
    projectsHtml.includes('mockup-learnspark') &&
    projectsHtml.includes('https://learn-spark-academy-voice.lovable.app'));

  test('All project cards have verified actions, clickable mockups, and no placeholder # links', () => {
    const noHashInProjects = !projectsHtml.includes('href="#"');
    const noHashInIndex = !html.includes('href="#"');
    const hasDemoBtns = projectsHtml.includes('project-demo-btn');
    return noHashInProjects && noHashInIndex && hasDemoBtns;
  });

  test('Verified project repository URLs match authentic GitHub repositories across both pages', () => {
    return projectsHtml.includes('https://github.com/susatwik/pawdentify') &&
      projectsHtml.includes('https://github.com/susatwik/taskpilot-ai') &&
      projectsHtml.includes('https://github.com/susatwik/Zero-Waste-Recipes-Generator') &&
      projectsHtml.includes('https://github.com/susatwik/iMentor-Main') &&
      projectsHtml.includes('https://github.com/susatwik/stateful-interview-system') &&
      projectsHtml.includes('https://github.com/susatwik/tcs-nqt-prep-platform') &&
      projectsHtml.includes('https://github.com/susatwik/ecommerce-platform');
  });

  test('Supplied live demo URLs match authentic deployed applications across both pages', () => {
    return projectsHtml.includes('https://stateful-interview-system.vercel.app/') &&
      projectsHtml.includes('https://recovermate-web.onrender.com') &&
      projectsHtml.includes('https://restaurant-ordering-kitchen.vercel.app/') &&
      projectsHtml.includes('https://pawdentify-frontend.vercel.app') &&
      projectsHtml.includes('https://codecrafters-stock-control-hub.lovable.app') &&
      projectsHtml.includes('https://diabetes-prediction-app0704.streamlit.app') &&
      projectsHtml.includes('https://learn-spark-academy-voice.lovable.app') &&
      projectsHtml.includes('https://recipe-rescue-connect.lovable.app') &&
      projectsHtml.includes('https://site-certificate-generator.vercel.app/') &&
      projectsHtml.includes('https://sasi-idea-lab.vercel.app/') &&
      projectsHtml.includes('https://sasi-aicte-idea-lab-attendance.vercel.app/') &&
      projectsHtml.includes('https://61.0.228.124/');
  });

  test('SASI AICTE IDEA Lab CMS description contains verified functionality without grant or funding claims', () => {
    const idealabDesc = projectsHtml.includes('A web-based management platform for the SASI AICTE IDEA Lab, supporting information management and access to lab resources.');
    const noGrantClaim = !projectsHtml.includes('₹1.1 Cr AICTE Grant') && !projectsHtml.includes('₹1.1 crore');
    return idealabDesc && noGrantClaim;
  });

  test('Certify live demo is integrated on both index.html and projects.html', () => {
    return html.includes('https://site-certificate-generator.vercel.app/') &&
      projectsHtml.includes('https://site-certificate-generator.vercel.app/') &&
      html.includes('A digital certificate generation, management, and verification platform') &&
      projectsHtml.includes('A digital certificate generation, management, and verification platform');
  });

  test('SASI AICTE IDEA Lab CMS live demo is integrated with factual description', () => {
    return projectsHtml.includes('https://sasi-idea-lab.vercel.app/') &&
      projectsHtml.includes('A web-based management platform for the SASI AICTE IDEA Lab, supporting information management and access to lab resources.');
  });

  test('SASI AICTE IDEA Lab Attendance System live demo is integrated with verified action', () => {
    return projectsHtml.includes('https://sasi-aicte-idea-lab-attendance.vercel.app/') &&
      projectsHtml.includes('SASI AICTE IDEA Lab Attendance System');
  });

  test('iMentor Socratic AI Agent live demo is integrated with verified source code link', () => {
    return projectsHtml.includes('https://61.0.228.124/') &&
      projectsHtml.includes('https://github.com/susatwik/iMentor-Main') &&
      projectsHtml.includes('An AI-powered pedagogical system supporting Socratic inquiry, reasoning, and learning through LLM orchestration.');
  });

  test('CSS defines 2x2 responsive work grid, glow accents, and dedicated projects page styling',
    css.includes('.work-grid') &&
    css.includes('grid-template-columns: repeat(2, 1fr)') &&
    css.includes('.card-glow-blue') &&
    css.includes('.card-glow-violet') &&
    css.includes('.card-glow-teal') &&
    css.includes('.card-glow-indigo') &&
    css.includes('.card-glow-amber') &&
    css.includes('.card-glow-rose') &&
    css.includes('.card-glow-cyan') &&
    css.includes('.work-view-more-cta') &&
    css.includes('.work-view-all-full-btn') &&
    css.includes('body.projects-page') &&
    css.includes('.back-to-portfolio-btn'));

  test('CSS defines clickable project card styles and title hover effects',
    css.includes('.project-card') &&
    css.includes('cursor: pointer') &&
    css.includes('.project-title a') &&
    css.includes('.mockup-link'));

  test('JS includes setupProjectFilters and setupProjectsNavigation controllers',
    js.includes('function setupProjectFilters()') &&
    js.includes('setupProjectFilters();') &&
    js.includes('function setupProjectsNavigation()') &&
    js.includes('setupProjectsNavigation();') &&
    js.includes('data-repo-url') &&
    js.includes('updateCardVisibility'));

  // 6. Achievements, Leadership & Certifications Section Tests
  console.log('\n--- ACHIEVEMENTS, LEADERSHIP & CERTIFICATIONS TESTS ---');
  test('Credentials section exists with id="credentials" immediately before contact',
    html.includes('id="credentials"') &&
    html.includes('class="credentials-section') &&
    html.indexOf('id="credentials"') < html.indexOf('id="contact"'));

  test('Credentials section eyebrow is "05 — ACHIEVEMENTS & LEADERSHIP" and contact is "06 — CONTACT"',
    html.includes('05 — ACHIEVEMENTS &amp; LEADERSHIP') &&
    html.includes('06 — CONTACT'));

  test('Navbar and footer navigation include #credentials Leadership links',
    html.includes('href="#credentials">Leadership</a>') &&
    projectsHtml.includes('href="index.html#credentials">Leadership</a>'));

  test('Credentials controls bar has all 5 category filters (All, Leadership, Achievements, Internships, Certifications)',
    html.includes('class="credentials-filters"') &&
    html.includes('data-filter="all"') &&
    html.includes('data-filter="leadership"') &&
    html.includes('data-filter="achievements"') &&
    html.includes('data-filter="internships"') &&
    html.includes('data-filter="certifications"'));

  test('Featured Leadership card exists for SITE ACM Student Chapter Chair at SASI Institute of Tech',
    html.includes('id="cred-acm-chair"') &&
    html.includes('Chapter Chair — SITE ACM Student Chapter') &&
    html.includes('SASI INSTITUTE OF TECHNOLOGY') &&
    html.includes('Association for Computing Machinery') &&
    html.includes('badge-featured') &&
    html.includes('2024 – PRESENT'));

  test('Featured Leadership card includes INSPIRA 2025, Anveshna 2026, and Smart India Hackathon 2026 coordination',
    html.includes('INSPIRA 2025') &&
    html.includes('Corporate Committee POC &amp; 24-Hour Hackathon Coordinator') &&
    html.includes('ANVESHNA 2026') &&
    html.includes('Sponsorship &amp; Partner Coordinator') &&
    html.includes('SMART INDIA HACKATHON') &&
    html.includes('Internal Screening &amp; Nomination Coordinator'));

  test('Achievements card exists for Amazon ML Summer School 2026 selection',
    html.includes('id="cred-amazon-ml"') &&
    html.includes('Amazon ML Summer School \'26 Selection') &&
    html.includes('Amazon Science &amp; Engineering') &&
    html.includes('badge-merit'));

  test('Achievements card exists for Hackathon Prayatna 2.0 (Runner-up, 50+ teams)',
    html.includes('id="cred-prayatna"') &&
    html.includes('Hackathon Prayatna 2.0 — Runner-up') &&
    html.includes('50+ TEAMS'));

  test('Achievements card exists for IEEE Quiz Competition (Runner-up)',
    html.includes('id="cred-ieee-quiz"') &&
    html.includes('IEEE Quiz Competition — Runner-up'));

  test('Leadership card exists for ACM Hackathon (Organizer, 100+ participants)',
    html.includes('id="cred-acm-hackathon"') &&
    html.includes('ACM Hackathon — Organizer') &&
    html.includes('100+ PARTICIPANTS'));

  test('Leadership card exists for INSPIRA 2025 Corporate Committee Point of Contact',
    html.includes('id="cred-inspira-card"') &&
    html.includes('INSPIRA 2025 — Corporate Committee Point of Contact'));

  test('Internship cards exist for NIT Andhra Pradesh (iMentor) and Infosys Springboard',
    html.includes('id="cred-nit-ap"') &&
    html.includes('National Institute of Technology (NIT) Andhra Pradesh') &&
    html.includes('Lead Socratic Agent Developer (iMentor)') &&
    html.includes('id="cred-infosys"') &&
    html.includes('Software Engineering Intern') &&
    html.includes('Infosys Springboard'));

  test('Certification cards exist for Generative AI, Deep Learning, Database/SQL, and Full-Stack Engineering',
    html.includes('id="cred-genai"') &&
    html.includes('Generative AI &amp; LLM Agent Architecture') &&
    html.includes('id="cred-ml-cv"') &&
    html.includes('Machine Learning &amp; Computer Vision') &&
    html.includes('id="cred-db-sql"') &&
    html.includes('Database Architecture &amp; Advanced SQL') &&
    html.includes('id="cred-fullstack"') &&
    html.includes('Full-Stack Application Engineering'));

  test('Credentials cards link only to verified external URLs without fake certificate IDs',
    html.includes('https://github.com/susatwik/iMentor-Main') &&
    html.includes('https://github.com/susatwik/Zero-Waste-Recipes-Generator') &&
    html.includes('https://github.com/susatwik/pawdentify') &&
    html.includes('https://github.com/susatwik/taskpilot-ai') &&
    html.includes('https://github.com/susatwik/ecommerce-platform') &&
    html.includes('https://www.linkedin.com/in/susatwik/'));

  test('CSS defines .credentials-section, .cred-featured-card, .cred-subgrid, and .cred-card styles',
    css.includes('.credentials-section') &&
    css.includes('.cred-featured-card') &&
    css.includes('.cred-subgrid') &&
    css.includes('.cred-card') &&
    css.includes('.cred-filter-btn.is-active'));

  test('JS includes setupCredentialFilters controller with live filtering',
    js.includes('function setupCredentialFilters()') &&
    js.includes('setupCredentialFilters();') &&
    js.includes('.cred-filter-btn') &&
    js.includes('.cred-item'));

  // 7. CSS Rules
  console.log('\n--- CSS DESIGN & RESPONSIVE RULES ---');
  test('CSS defines .about-portrait-card with radial backdrop, border-radius, and aspect ratio',
    css.includes('.about-portrait-card') && css.includes('aspect-ratio: 4 / 5') && css.includes('border-radius: 16px'));

  test('CSS defines infinite marquee animations @keyframes marqueeLTR and marqueeRTL',
    css.includes('@keyframes marqueeLTR') && css.includes('@keyframes marqueeRTL'));

  test('CSS defines marquee edge fade mask and pause on hover',
    css.includes('mask-image: linear-gradient') && css.includes('.marquee-row:hover .marquee-track'));

  test('CSS defines reduced motion fallback for marquee',
    css.includes('@media (prefers-reduced-motion: reduce)') && css.includes('.marquee-track'));

  test('CSS defines .marquee-pill and .skill-badge with pill geometry, backdrop blur, and smooth transitions',
    css.includes('.skill-badge') &&
    css.includes('.marquee-pill') &&
    css.includes('border-radius: 9999px') &&
    css.includes('backdrop-filter: blur') &&
    css.includes('.skill-icon-wrap'));

  test('CSS defines .skill-badge:hover with electric-blue glow and elevation',
    css.includes('.skill-badge:hover') &&
    css.includes('transform: translateY') &&
    css.includes('rgba(79, 140, 255'));

  test('CSS defines .contact with single-viewport desktop height constraint min-height: calc(100svh - 72px)',
    css.includes('.contact') && css.includes('min-height: calc(100svh - 72px)'));

  test('CSS defines .contact-form-card with dark glassmorphism and internal overflow scrollbar',
    css.includes('.contact-form-card') && css.includes('backdrop-filter: blur') && css.includes('overflow-y: auto'));

  test('CSS defines custom accessible dropdown and option styles',
    css.includes('.custom-select') &&
    css.includes('.custom-select-trigger') &&
    css.includes('.custom-select-options') &&
    css.includes('.custom-select-option'));

  test('CSS defines .submit-btn with loading spinner and is-success celebration states',
    css.includes('.submit-btn.is-loading .btn-spinner') &&
    css.includes('.submit-btn.is-success') &&
    css.includes('animation: spin'));

  test('CSS defines .contact-modal-backdrop and .contact-modal-card with entrance animations',
    css.includes('.contact-modal-backdrop') &&
    css.includes('.contact-modal-card') &&
    css.includes('@keyframes modalScaleUp'));

  test('CSS defines .journey-scroll-track with 380vh scroll track and sticky container',
    css.includes('.journey-scroll-track') && css.includes('height: 380vh') && css.includes('position: sticky'));

  test('CSS defines .hero-portrait-fallback enlarged to 85vw/860px with foreground PORTFOLIO at z-index 4',
    css.includes('.hero-portrait-fallback') && css.includes('width: min(85vw, 860px)') &&
    css.includes('.hero-portfolio-word') && css.includes('z-index: 4'));

  test('CSS defines enlarged .brand wordmark with weight 800 and clamp(17px, 1.35vw, 21px)',
    css.includes('.brand') && css.includes('clamp(17px, 1.35vw, 21px)') && css.includes('font-weight: 800'));

  test('CSS defines boldest PORTFOLIO typography with weight 900 and fluid safe clamp',
    css.includes('.hero-portfolio-word') && css.includes('font-weight: 900') && css.includes('clamp(2.8rem, 15.2vw, 13.8rem)'));

  test('CSS defines persistent .hero-caption with opacity 1 and transform none to avoid scroll disappearing',
    css.includes('.hero-caption') && css.includes('opacity: 1;') && css.includes('transform: none;'));

  test('CSS defines refined .hero-name with clamp(24px, 2.4vw, 32px) and weight 800',
    css.includes('.hero-name') && css.includes('clamp(24px, 2.4vw, 32px)') && css.includes('font-weight: 800'));

  test('CSS defines .journey-header with top offset clamp(22px, 2.8vh, 28px) to clear navbar',
    css.includes('.journey-header') && css.includes('top: clamp(22px, 2.8vh, 28px)'));

  test('CSS defines .journey-header visible by default with opacity: 1 and transform: none',
    css.includes('.journey-header') && css.includes('opacity: 1;') && css.includes('transform: none;'));

  test('CSS defines .journey-scroll-track with scroll-margin-top: 80px for direct anchor navigation',
    css.includes('.journey-scroll-track') && css.includes('scroll-margin-top: 80px'));

  test('CSS defines .journey-card with dark glassmorphism and luminous borders',
    css.includes('.journey-card') && css.includes('backdrop-filter: blur(14px)'));

  test('CSS defines .journey-card with translate3d(-50%, var(--card-y-offset, 0px), 0) preserving horizontal alignment',
    css.includes('.journey-card') && css.includes('transform: translate3d(-50%, var(--card-y-offset, 0px), 0)'));

  test('CSS defines .journey-stats-bar with 4-column glass container',
    css.includes('.journey-stats-bar') && css.includes('grid-template-columns: repeat(4, 1fr)'));

  test('CSS defines responsive mobile vertical timeline for journey at <= 768px',
    css.includes('@media (max-width: 768px)') &&
    css.includes('.journey-scroll-track') &&
    css.includes('.journey-card::before'));

  test('CSS defines accessible reduced motion fallback for journey timeline',
    css.includes('@media (prefers-reduced-motion: reduce)') &&
    css.includes('.journey-path-core') &&
    css.includes('.journey-card'));

  // 6. Client JS Logic
  console.log('\n--- CLIENT JAVASCRIPT LOGIC ---');
  test('JS includes enlarged portrait scale targeting 78-90% usable hero height',
    js.includes('height * 0.88') && js.includes('frameSize * (86 / 1254)'));

  test('JS maintains hero identity block 100% visible on scroll with --caption-opacity set to 1',
    js.includes("heroTrack.style.setProperty('--caption-opacity', '1')") &&
    js.includes("heroTrack.style.setProperty('--caption-offset-y', '0px')"));

  test('JS defines fitPortfolioHeading with dynamic Canvas measurement to fit 88-92% width',
    js.includes('function fitPortfolioHeading()') &&
    js.includes('heroTitle.style.setProperty(\x27--portfolio-size\x27'));

  test('JS includes updateJourney scroll controller with JOURNEY_NODE_FRACTIONS lockstep synchronization',
    js.includes('function updateJourney(p)') &&
    js.includes('JOURNEY_NODE_FRACTIONS') &&
    js.includes('0.080') &&
    js.includes('class JourneyAmbientCanvas'));

  test('JS includes journey SVG strokeDashoffset and element initialization',
    js.includes('journeyPathCore.getTotalLength()') &&
    js.includes('journeyPathCore.style.strokeDasharray') &&
    js.includes('journeyNodes = Array.from'));

  test('JS includes setupContactForm controller',
    js.includes('function setupContactForm()') && js.includes('setupContactForm();'));

  test('JS posts to /api/contact endpoint',
    js.includes("fetch('/api/contact'"));

  test('JS includes character counter live listener',
    js.includes('messageInput?.addEventListener(\x27input\x27'));

  test('JS includes client cooldown throttle',
    js.includes('lastSubmitTime'));

  test('JS includes field error handling on blur and reset handler',
    js.includes('setFieldError') && js.includes('btn-send-another'));

  test('JS implements custom accessible dropdown controller with keyboard support',
    js.includes('openDropdown') &&
    js.includes('closeDropdown') &&
    js.includes('selectOption') &&
    js.includes('resetCustomSelect'));

  test('JS implements dual-edge canvas confetti celebration with cleanup',
    js.includes('function launchContactConfetti()') &&
    js.includes('contact-confetti-canvas') &&
    js.includes('cancelAnimationFrame') &&
    js.includes('prefers-reduced-motion'));

  test('JS implements centered success celebration modal controller with escape & backdrop dismissal',
    js.includes('openSuccessModal') &&
    js.includes('closeSuccessModal') &&
    js.includes('e.key === \x27Escape\x27') &&
    js.includes('e.target === successModal'));

  // 7. Full-Viewport Neural Particle Intro Simulation Tests
  console.log('\n--- FULL-VIEWPORT PARTICLE INTRO SIMULATION TESTS ---');
  test('Skip intro button is present with accessible aria-label and skip action',
    html.includes('id="skip-intro-btn"') &&
    html.includes('aria-label="Skip introduction"') &&
    html.includes('Skip intro'));

  test('JS binds Skip Intro click and Escape key to finishIntro()',
    js.includes('skipButton?.addEventListener(\x27click\x27') &&
    js.includes('portraitSystem?.finishIntro()') &&
    js.includes('e.key === \x27Escape\x27'));

  test('JS respects reduced-motion preference by bypassing intro animation',
    js.includes('if (reduceMotion)') &&
    js.includes('this.finishIntro()'));

  test('Particle system initializes full-viewport edge-to-edge distribution without central clamping',
    js.includes('(h1 * 1.06 - 0.03) * width') &&
    js.includes('(h2 * 1.06 - 0.03) * height') &&
    js.includes('isAmbient: true') &&
    js.includes('ambientCount'));

  test('Particle system samples authentic portrait with 4-neighbor contrast edge detection',
    js.includes('isEdge') &&
    js.includes('Math.abs(lum - getLum(x - 1, y)) > 0.15') &&
    js.includes('Math.abs(lum - getLum(x, y - 1)) > 0.15'));

  test('Particle intro includes full-screen dynamic flow and inward convergence along curved streamlines',
    js.includes('flowBaseX') &&
    js.includes('flowAngle') &&
    js.includes('totalDist') &&
    js.includes('perpX = -dy / (totalDist || 1)') &&
    js.includes('arcFactor') &&
    js.includes('pReconstruct'));

  test('Particle intro gracefully holds portrait and transitions to hero before completion',
    js.includes('elapsed >= 5200') &&
    js.includes('breathe') &&
    js.includes('document.body.classList.remove(\x27is-intro\x27)'));

  // 8. Hero Visibility, Intro Lifecycle, Navigation & Social Brand Hover Tests
  console.log('\n--- HERO VISIBILITY, INTRO LIFECYCLE & BRAND TESTS ---');
  test('CSS defines #top with scroll-margin-top: 0px to prevent navigation offset',
    css.includes('#top') && css.includes('scroll-margin-top: 0px'));

  test('JS binds Home brand link and footer brand links to handleHomeNavigation',
    js.includes('handleHomeNavigation') &&
    js.includes("brandLink?.addEventListener('click', handleHomeNavigation)") &&
    js.includes("window.scrollTo({"));

  test('JS implements explicit intro lifecycle state machine with 5 states',
    js.includes("this.state = 'initializing'") &&
    js.includes("this.state = 'playing'") &&
    js.includes("this.finishIntro('completed')") &&
    js.includes("this.finishIntro('skipped')") &&
    js.includes("this.finishIntro('fallback')"));

  test('JS includes safety timeout and error fallback to prevent stuck Skip Intro overlay',
    js.includes('this.introTimeoutId = setTimeout') &&
    js.includes('Image decode timeout') &&
    js.includes('this.fallbackImage.style.display = \'block\''));

  test('JS bypasses intro on reload with deep link fragment or existing scroll position',
    js.includes('isDeepLink') &&
    js.includes('isScrolledDown') &&
    js.includes('target?.scrollIntoView'));

  test('JS clears fixed navbar by placing head safely below 74px',
    js.includes('targetHeadTop = isMobile ? 66 : Math.max(86, height * 0.10)') &&
    js.includes('portraitTop = isMobile'));

  test('CSS defines brand-specific hover and focus-visible styles for LinkedIn (#0A66C2)',
    css.includes('.btn-linkedin:hover') &&
    css.includes('#0A66C2') &&
    css.includes('.btn-linkedin:focus-visible'));

  test('CSS defines brand-specific hover and focus-visible styles for WhatsApp (#25D366)',
    css.includes('.btn-whatsapp:hover') &&
    css.includes('#25D366') &&
    css.includes('.btn-whatsapp:focus-visible'));

  test('CSS defines neutral white/gray hover and focus-visible styles for GitHub without turning green',
    css.includes('.btn-github:hover') &&
    css.includes('.btn-github:focus-visible') &&
    !css.includes('.btn-github:hover { color: #25D366') &&
    !css.includes('.btn-github:hover { border-color: #25D366'));

  // 9. Footer CONNECT Social Icons & Brand Hover Tests
  console.log('\n--- FOOTER CONNECT SOCIAL ICONS & BRAND HOVER TESTS ---');
  test('Footer CONNECT section contains all four authentic icons: Email, WhatsApp, LinkedIn, and GitHub',
    html.includes('class="footer-social-icon email-icon"') &&
    html.includes('class="footer-social-icon whatsapp-icon"') &&
    html.includes('class="footer-social-icon linkedin-icon"') &&
    html.includes('class="footer-social-icon github-icon"'));

  test('Footer CONNECT links place icon before text and external arrow after text', () => {
    const connectSection = html.slice(html.indexOf('CONNECT'), html.indexOf('LOCATION &amp; STATUS'));
    return connectSection.includes('email-icon') &&
      connectSection.includes('<span class="footer-link-text">Email</span>') &&
      connectSection.includes('<span class="footer-link-text">WhatsApp</span>') &&
      connectSection.includes('<span class="footer-link-text">LinkedIn</span>') &&
      connectSection.includes('<span class="footer-link-text">GitHub</span>') &&
      connectSection.includes('class="footer-arrow"');
  });

  test('Footer icons have aria-hidden="true" and 17px sizing',
    html.includes('class="footer-social-icon email-icon" width="17" height="17"') &&
    html.includes('class="footer-social-icon whatsapp-icon" width="17" height="17"') &&
    html.includes('aria-hidden="true"'));

  test('CSS defines .footer-social-icon with flex-shrink: 0 and inline-flex alignment',
    css.includes('.footer-social-icon') &&
    css.includes('flex-shrink: 0') &&
    css.includes('display: inline-flex'));

  test('CSS defines footer Email hover with electric blue accent #79A9FF',
    css.includes('.footer-links-col nav a.footer-email-link:hover') &&
    css.includes('#79A9FF'));

  test('CSS defines footer WhatsApp hover with official green #25D366 and LinkedIn hover with #0A66C2',
    css.includes('.footer-links-col nav a.footer-whatsapp:hover') &&
    css.includes('#25D366') &&
    css.includes('.footer-links-col nav a.footer-linkedin:hover') &&
    css.includes('#0A66C2'));

  test('CSS defines footer GitHub hover with clean white #FFFFFF and never green',
    css.includes('.footer-links-col nav a.footer-github:hover') &&
    css.includes('#FFFFFF') &&
    !css.includes('.footer-links-col nav a.footer-github:hover {\n  color: #25D366'));

  test('Footer retains verified URLs for mailto, WhatsApp, LinkedIn, and GitHub',
    html.includes('href="mailto:sathwvikmanuri@gmail.com"') &&
    html.includes('href="https://wa.me/919390174748') &&
    html.includes('href="https://www.linkedin.com/in/susatwik/"') &&
    html.includes('href="https://github.com/susatwik/"'));

  // 10. Persistent Active Navbar Navigation Tests
  console.log('\n--- PERSISTENT ACTIVE NAVBAR NAVIGATION TESTS ---');
  test('Navbar HTML contains links for all six primary sections',
    html.includes('href="#about"') &&
    html.includes('href="#skills"') &&
    html.includes('href="#journey"') &&
    html.includes('href="#work"') &&
    html.includes('href="#credentials"') &&
    html.includes('href="#contact"'));

  test('CSS defines active nav link styles with .is-active and [aria-current="location"]',
    css.includes('.site-header nav a.is-active') &&
    css.includes('.site-header nav a[aria-current="location"]') &&
    css.includes('text-shadow: 0 0 12px rgba(79, 140, 255, 0.45)'));

  test('CSS defines active link underline with #4F8CFF electric-blue accent and glow',
    css.includes('.site-header nav a.is-active::after') &&
    css.includes('.site-header nav a[aria-current="location"]::after') &&
    css.includes('background: #4F8CFF;') &&
    css.includes('box-shadow: 0 0 8px rgba(79, 140, 255, 0.75)'));

  test('CSS defines active state for .nav-contact action button with #4F8CFF border, tint, and glow',
    css.includes('.site-header nav a.nav-contact.is-active') &&
    css.includes('.site-header nav a.nav-contact[aria-current="location"]') &&
    css.includes('border-color: #4F8CFF !important;') &&
    css.includes('background: rgba(79, 140, 255, 0.14) !important;') &&
    css.includes('box-shadow: 0 0 18px rgba(79, 140, 255, 0.35)'));

  test('CSS defines accessible keyboard focus with .site-header nav a:focus-visible',
    css.includes('.site-header nav a:focus-visible') &&
    css.includes('outline: 2px solid #4F8CFF;') &&
    css.includes('outline-offset: 4px;'));

  test('JS defines TRACKED_SECTION_IDS for about, skills, journey, work, credentials, and contact',
    js.includes("TRACKED_SECTION_IDS = ['about', 'skills', 'journey', 'work', 'credentials', 'contact']"));

  test('JS defines setActiveNavLink controller toggling is-active and aria-current="location"',
    js.includes('function setActiveNavLink(activeId)') &&
    js.includes("link.classList.add('is-active')") &&
    js.includes("link.setAttribute('aria-current', 'location')") &&
    js.includes("link.classList.remove('is-active')") &&
    js.includes("link.removeAttribute('aria-current')"));

  test('JS defines updateActiveNav controller with bottom-of-page contact activation and top-of-page hero clearing',
    js.includes('function updateActiveNav()') &&
    js.includes("scrollY + winH >= docH - 60") &&
    js.includes("setActiveNavLink('contact')") &&
    js.includes("scrollY < 120") &&
    js.includes("setActiveNavLink(null)"));

  test('JS accounts for fixed navbar height threshold in section boundary tracking',
    js.includes('const threshold = Math.min(winH * 0.35, 240);') &&
    js.includes('rect.top <= threshold && rect.bottom > threshold'));

  test('JS executes updateActiveNav on scroll and before reduceMotion / intro guard in updateScroll',
    js.includes('updateActiveNav();\n\n    if (reduceMotion || introActive) return;'));

  test('JS binds navMenu link click handlers to trigger immediate active state update',
    js.includes('if (TRACKED_SECTION_IDS.includes(targetId)) {\n            setActiveNavLink(targetId);\n          }'));

  test('JS binds handleHomeNavigation to reset active navbar state with setActiveNavLink(null)',
    js.includes('setActiveNavLink(null);') &&
    js.includes("brandLink?.addEventListener('click', handleHomeNavigation)"));

  test('JS binds popstate event listener to synchronize active state with browser history',
    js.includes("window.addEventListener('popstate',") &&
    js.includes("setActiveNavLink(hash)"));

  // 11. Serverless API Endpoint Tests
  console.log('\n--- SERVERLESS API ENDPOINT TESTS ---');
  function mockRes() {
    return {
      statusCode: 200,
      headers: {},
      data: null,
      setHeader(k, v) { this.headers[k] = v; return this; },
      status(code) { this.statusCode = code; return this; },
      json(obj) { this.data = obj; return this; },
      end() { return this; }
    };
  }

  // Method restriction
  const res1 = mockRes();
  await handler({ method: 'GET', headers: {} }, res1);
  test('API rejects non-POST requests with 405', res1.statusCode === 405 && res1.data.ok === false);

  // Honeypot silently dropped
  const res2 = mockRes();
  await handler({
    method: 'POST',
    headers: {},
    body: { _gotcha: 'bot_spam_detected', name: 'Bot', email: 'bot@spam.com', message: 'Spam body message text' }
  }, res2);
  test('API silently handles honeypot spam with 200 without dispatching', res2.statusCode === 200 && res2.data.ok === true);

  // Missing fields validation
  const res3 = mockRes();
  await handler({
    method: 'POST',
    headers: {},
    body: { name: 'A', email: 'bad-email', message: 'short' }
  }, res3);
  test('API validates name length and email format with 400', res3.statusCode === 400 && res3.data.ok === false);

  // CRLF Header Injection Prevention
  const resInjection = mockRes();
  await handler({
    method: 'POST',
    headers: {},
    body: {
      name: 'Hacker\r\nBcc: victim@spam.com',
      email: 'hacker@example.com\nBcc: all@spam.com',
      reason: 'Job opportunity',
      subject: 'Inquiry\r\nTo: hijacked@domain.com',
      message: 'This is a test message to ensure CRLF injection is rejected.'
    }
  }, resInjection);
  test('API rejects CRLF email-header injection attempts with 400',
    resInjection.statusCode === 400 && resInjection.data.ok === false);

  // Missing SMTP credentials safe error response with mailto fallback
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.RESEND_API_KEY;

  const res4 = mockRes();
  await handler({
    method: 'POST',
    headers: {},
    body: {
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      reason: 'Job opportunity',
      subject: 'Senior Full Stack Role',
      message: 'We are very interested in discussing an open software engineering position with you.'
    }
  }, res4);
  test('API returns safe 503 unconfigured error with mailto fallback when SMTP is not configured',
    res4.statusCode === 503 &&
    res4.data.ok === false &&
    res4.data.error.includes('unconfigured') &&
    res4.data.fallback &&
    res4.data.fallback.type === 'mailto' &&
    res4.data.fallback.to === 'sathwvikmanuri@gmail.com');

  // Direct SMTP mock verification when SMTP credentials ARE set
  const nodemailer = require('nodemailer');
  const originalCreateTransport = nodemailer.createTransport;
  let sentMailOptions = null;

  nodemailer.createTransport = function(config) {
    return {
      sendMail: async function(options) {
        sentMailOptions = options;
        return { messageId: '<test-message-123@smtp.domain.com>' };
      }
    };
  };

  process.env.SMTP_HOST = 'smtp.gmail.com';
  process.env.SMTP_PORT = '465';
  process.env.SMTP_USER = 'sathwvikmanuri@gmail.com';
  process.env.SMTP_PASS = 'mock_app_password';

  const res5 = mockRes();
  await handler({
    method: 'POST',
    headers: {},
    body: {
      name: 'Alex Rivera',
      email: 'alex.rivera@techfirm.io',
      reason: 'AI/ML collaboration',
      subject: 'Socratic Agent Architecture Collaboration',
      message: 'We would love to discuss your work on Socratic agents and explore a collaboration.'
    }
  }, res5);

  test('Direct SMTP connection delivers message to sathwvikmanuri@gmail.com with replyTo set to visitor',
    res5.statusCode === 200 &&
    res5.data.ok === true &&
    res5.data.messageId === '<test-message-123@smtp.domain.com>' &&
    sentMailOptions &&
    sentMailOptions.to === 'sathwvikmanuri@gmail.com' &&
    sentMailOptions.replyTo === 'alex.rivera@techfirm.io' &&
    sentMailOptions.subject.includes('Socratic Agent Architecture Collaboration'));

  // SMTP send failure handling
  nodemailer.createTransport = function(config) {
    return {
      sendMail: async function() {
        throw new Error('Connection timed out to smtp.gmail.com:465');
      }
    };
  };

  const res6 = mockRes();
  await handler({
    method: 'POST',
    headers: {},
    body: {
      name: 'Alex Rivera',
      email: 'alex.rivera@techfirm.io',
      reason: 'AI/ML collaboration',
      subject: 'Socratic Agent Architecture Collaboration',
      message: 'We would love to discuss your work on Socratic agents and explore a collaboration.'
    }
  }, res6);

  test('SMTP failure returns 502 with safe error and actionable mailto fallback without crashing',
    res6.statusCode === 502 &&
    res6.data.ok === false &&
    res6.data.fallback &&
    res6.data.fallback.type === 'mailto' &&
    !res6.data.error.includes('mock_app_password'));

  // Restore nodemailer createTransport and clean environment
  nodemailer.createTransport = originalCreateTransport;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;

  console.log(`\n========================================`);
  console.log(`FINAL TEST REPORT: ${passed} / ${total} TESTS PASSED`);
  console.log(`========================================\n`);

  if (passed !== total) process.exit(1);
}

runAll().catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
