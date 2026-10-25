# DevShift | SDE-1 Interview Lab

**A coding and interview practice command center for the transition from enterprise technical support to software engineering.**

[![Live Application](https://img.shields.io/badge/Live-DevShift-8ff1bb?logo=vercel&logoColor=black)](https://devshift-sde1-lab.vercel.app) [![CI](https://github.com/hanaanmir17/devshift-sde1-lab/actions/workflows/verify.yml/badge.svg)](https://github.com/hanaanmir17/devshift-sde1-lab/actions/workflows/verify.yml)

**Live app:** https://devshift-sde1-lab.vercel.app  
**GitHub repository:** https://github.com/hanaanmir17/devshift-sde1-lab


DevShift combines an interactive JavaScript coding arena, timed behavioral and technical mock interviews, a six-week study plan, and a job-application tracker in a single mobile-friendly, offline-capable application. It is designed for a support/SAP/networking engineer building the practical programming evidence needed for SDE-1 / Software Engineer I interviews.

## What it does

| Workspace | Features |
| --- | --- |
| Overview | Activity chart, solved count, earned XP, streaks, suggested problems, next roadmap focus |
| Code arena | 18 curated algorithm questions; editable JavaScript; **74 executable tests**, including hidden edge cases; time limit; hints; sample solutions; automatically saved drafts |
| Mock interviews | 14 behavioral and technical questions; timed answers; note-taking; structured self-review with keyword, length and clarity checkpoints |
| 6-week roadmap | 42 daily milestones across hashing, pointers, windows, graphs, DP, systems and interview practice |
| Job tracker | Track company, role, stage, date, next step, URL and notes; edit, filter and delete applications |
| Data portability | Local-browser storage, JSON export and import, no login or API key |

## Tech stack

- **Frontend:** semantic HTML5, responsive CSS3, vanilla JavaScript ES modules
- **Execution:** a disposable browser Web Worker to run user-entered JavaScript against test cases with a 2.5-second wall-clock limit
- **State:** versioned `localStorage` with export/import of JSON backups
- **Offline:** a network-first service worker and installable web app manifest
- **Development:** dependency-free Node.js static server with clean-page routing
- **Verification:** built-in Node.js test suite (18 reference solutions / 74 test cases) plus browser interaction tests
- **Hosting:** Vercel static deployment and HTTPS

No backend, database, authentication, external assessment service, npm dependencies or secret keys are required. Code is evaluated in the visitor's browser and is **not transmitted to a code-execution service**.

## Quick tour

1. **Overview:** see daily progress, solved count, XP, and next practice tasks.
2. **Code arena:** choose *Two Sum*, type your function and click *Run tests*; the worker checks actual results.
3. **Mock interviews:** choose a question, start the timer, speak your answer, and review a local checklist.
4. **6-week roadmap:** mark a daily milestone complete.
5. **Application tracker:** enter a real job opportunity, track its stage, then export your private data.

## Run inside VS Code

Install [Node.js](https://nodejs.org/) version 18 or later, open this entire folder in VS Code, then open **Terminal → New Terminal**:

```bash
npm run dev
```

When you see `DevShift running at http://localhost:3000`, open **http://localhost:3000** in VS Code's integrated browser (or a regular browser). **Do not open `index.html` as a `file:///` URL:** JavaScript modules, workers and service workers expect an HTTP(S) server.

Run checks with:

```bash
npm test
```

## Project structure

```text
index.html           App shell and navigation
styles.css           Dark visual system, UI components, responsive layouts
app.js               Dashboard, coding arena, interview timer, roadmap, jobs, state
runner-worker.js     Disposable JavaScript evaluator and test-result serialization
data.js              Curated algorithms, tests, mock prompts and study roadmap
sw.js                Offline cache strategy
url-cleanup.js       Removes incoming referral/query parameters from browser URL
manifest.webmanifest Installable PWA metadata
favicon.svg          App icon
dev-server.mjs       Local development server (Node built-ins only)
vercel.json          Static hosting configuration, clean URLs, security headers
tests/verify.mjs     Reference-solution and content correctness tests
```

## How the coding runner works

For each run, the editor sends the current function body plus problem inputs to a newly created Web Worker. The worker compiles it, calls the named function with cloned test inputs, and returns pass/fail results and execution times. The parent terminates the worker after its response or a 2.5-second timeout, preventing infinite loops from freezing the main interface.

**Security limitation:** A worker is an isolation boundary for browser UI responsiveness, **not a hardened sandbox** for running hostile code. Use the editor for code you wrote or trust, not downloaded unknown code. The deployed worker can use a restrictive Content Security Policy to block network access. Hidden tests are bundled client-side and are not secret from a determined user. XP is a personal practice metric, not a verified assessment.

## Clean, shareable link

Use **https://devshift-sde1-lab.vercel.app/** when sharing DevShift. The app also clears campaign or referral query parameters from the address bar once the page loads, without changing the selected dashboard tab (for example, `#arena`). External platforms may append their own parameters before the page opens, which the website cannot stop at the source.

## Progress and privacy

Your drafts, submitted tests, interview notes and job applications live in your browser's local storage. Export them regularly; clearing browser data, changing browser/device, or switching origins can remove access to your progress. Use **Export progress** and then **Import backup** to transfer it. Import replaces existing data after confirmation.

This is a study tool rather than a job-board scraper, hiring guarantee or formal interview assessment service. Users must check technical explanations and feedback themselves. Progress data isn't synced between devices.

## Suggested study routine

1. Solve one easy or medium question; write down time and space complexity.
2. Explain the brute-force approach, optimization, edge cases and why your code works.
3. Practice one interview prompt using a genuine SAP/support incident or a real project.
4. Mark one roadmap checkpoint complete and add one relevant SDE-1 application.
5. Every week, improve one public GitHub project based on a genuine usability or engineering gap.

## Roadmap for extending DevShift into a full-stack showcase

If you want to use DevShift itself as an SDE-1 portfolio project, a logical second iteration is authentication, a Postgres-backed activity log, collaborative timed mock sessions with WebSockets, challenge authoring, and testable API services. That is **not** part of this offline-first version. Building and explaining those extensions yourself would demonstrate backend and system-design skills.

## License

Personal educational/demo project. Interview and coding challenges are original paraphrases of standard industry exercise patterns.

## Verification and CI

Run `npm test` to validate all reference algorithm solutions, test-case expectations, question coverage, and the six weekly plans. The `.github/workflows/verify.yml` workflow runs that command for every push and pull request to `main` on GitHub.

The app has also been exercised in headless Chromium on desktop and a 390px mobile viewport, including a successful problem submission, mock-interview feedback, roadmap updates, and the job tracker.

## Deployment architecture

Vercel serves `index.html` and its static module imports over HTTPS, with no build step. `vercel.json` sets basic security headers and a restrictive policy for the JavaScript execution worker. The frontend persists data only on the visitor's device; the service worker caches application shell assets for return visits.

**Deployment note:** This static app does not provide collaborative real-time syncing between accounts. Timer updates, test execution, dashboard changes, and local scoring are interactive and immediate, but records remain local to the browser.
