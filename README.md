# Susatwik Manuri — Cinematic Developer Portfolio

**Live Website:** [https://susatwikmanuri.vercel.app](https://susatwikmanuri.vercel.app)

A dark, cinematic developer portfolio featuring an interactive WebGL/2D Canvas neural particle portrait intro, scroll-scrubbed interactive SVG journey timeline, full-stack and AI/ML project showcases, verified credentials & leadership timeline, and a production-grade serverless contact experience with direct SMTP email delivery.

---

## 🌟 Overview & Key Features

- **Hero & Neural Particle Intro**:
  - Full-screen HTML5 Canvas particle system sampling authentic high-contrast portrait edge coordinates.
  - Multi-phase cinematic intro: wide ambient distribution, curved fluid streamlines, inward portrait convergence, and seamless transition to the main hero section.
  - Skip Intro option with accessible keyboard shortcut (`Escape`) and automatic bypass for users with `prefers-reduced-motion` enabled.
- **The Stack (Skills & Technologies)**:
  - Categorized technical stack covering Languages, Frontend & Full-Stack, AI/ML & Data, and Developer Tools.
  - Interactive infinite marquees with edge fade masks and hover pauses.
- **The Journey (Interactive Experience Timeline)**:
  - Scroll-scrubbed 380vh cinematic timeline with lockstep SVG path drawing and synchronized progress nodes.
  - Responsive vertical timeline for mobile viewports.
- **Work & Projects**:
  - 15 verified projects spanning AI/ML, Full-Stack Engineering, Generative AI, and Systems.
  - Filterable by category (All, AI / ML, Full Stack, Systems).
  - Verified live demo links and GitHub repository links.
  - Dedicated [All Projects page](projects.html) with responsive card grid and search/filter controls.
- **Achievements, Leadership & Certifications**:
  - Featured leadership card as Chapter Chair of SITE ACM Student Chapter at SASI Institute of Technology & Engineering.
  - Documented event and hackathon leadership: INSPIRA 2025 Corporate Committee POC, Anveshna 2026 Sponsorship Coordinator, and Smart India Hackathon (SIH) 2026 Internal Screening Coordinator.
  - Verified achievements including Amazon ML Summer School 2026 selection, Hackathon Prayatna 2.0 Runner-Up, and IEEE Quiz Runner-Up.
  - Documented internships at NIT Andhra Pradesh (iMentor Socratic Agent Developer) and Infosys Springboard.
  - Verified certifications across Deep Learning, Generative AI, SQL/Databases, and Full-Stack Development.
- **Persistent Active Navigation**:
  - Scroll-synchronized navbar tracking the user's viewport across About, Skills, Journey, Work, Leadership, and Contact.
  - Luminous electric-blue (`#4F8CFF`) underline indicator and full `aria-current="location"` accessibility support.
- **Let's Talk (Contact & Collaboration)**:
  - Direct SMTP delivery via authenticated mail server directly to `sathwvikmanuri@gmail.com`.
  - Zero third-party form intermediaries.
  - Honeypot bot protection (`_gotcha`), IP sliding-window rate limiting, and client-side cooldown.
  - Dual-edge celebratory confetti animation and accessible success modal.
  - Direct action channels for WhatsApp, LinkedIn, GitHub, and pre-formatted Email.

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Custom Properties, Glassmorphism, CSS Grid, Flexbox), JavaScript (ES6+, Canvas API, SVG Path Interpolation)
- **Backend / Serverless**: Node.js, Vercel Serverless Functions (`api/contact.js`)
- **Email Delivery**: Direct SMTP transport via `nodemailer`
- **Testing**: Native Node.js test runner suite (`tests/test-all.js`, 185 comprehensive automated assertions)
- **Hosting & Deployment**: Vercel (Edge-optimized static asset distribution + Serverless Functions)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ (Node.js 20 recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/susatwik/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables for email delivery:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your SMTP credentials (see [Environment Variables](#-environment-variables) below).

### Running the Application

Start the local development server:
```bash
npm start
# or
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🧪 Running Automated Tests

The portfolio includes a comprehensive test suite validating HTML semantics, responsive CSS rules, client JavaScript controllers, particle simulation states, navbar navigation tracking, and the serverless contact endpoint.

Run all tests:
```bash
npm test
# or
node tests/test-all.js
```

To test SMTP connectivity with configured credentials:
```bash
npm run test:smtp
```

---

## ⚙️ Environment Variables

For production contact form email delivery, configure the following environment variables in your hosting environment (or local `.env` file):

| Variable | Description | Example / Default |
|---|---|---|
| `SMTP_HOST` | Hostname of your SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | Port for SMTP (465 for SSL, 587 for TLS) | `465` |
| `SMTP_SECURE` | Set to `true` for SSL (port 465) | `true` |
| `SMTP_USER` | Authenticated SMTP username / email | `sathwvikmanuri@gmail.com` |
| `SMTP_PASS` | SMTP App Password (never use main account password) | *16-character App Password* |
| `CONTACT_TO_EMAIL` | Destination email for portfolio inquiries | `sathwvikmanuri@gmail.com` |
| `CONTACT_FROM_EMAIL` | Sender address in outbound email header | `sathwvikmanuri@gmail.com` |

> **Note on Gmail:** When using Gmail SMTP, enable 2-Step Verification in your Google Account and generate an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
>
> If SMTP credentials are not configured, the contact form gracefully falls back to a pre-filled `mailto:` client draft without breaking the user experience.

---

## 📦 Deployment to Vercel

The portfolio is architected for zero-configuration deployment to [Vercel](https://vercel.com).

### Automatic Git Integration (Recommended)
1. Push this repository to GitHub: `https://github.com/susatwik/Portfolio`.
2. Log in to [Vercel](https://vercel.com) and click **"Add New..." > "Project"**.
3. Import the `susatwik/Portfolio` repository.
4. Leave Framework Preset as **Other** (Root directory `./`).
5. Under **Environment Variables**, add:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`
6. Click **Deploy**. Vercel will deploy:
   - Static pages (`index.html`, `projects.html`, `styles.css`, `script.js`, `assets/`) to the global Edge Network.
   - `api/contact.js` as a Serverless Function at `/api/contact`.

### Vercel CLI Deployment
```bash
vercel
# For production:
vercel --prod
```

---

## 📄 License

This project is licensed under the MIT License — see the [package.json](package.json) file for details.
