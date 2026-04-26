# 🏆 CohbyForms: The Master Sales & Feature Guide

**Author:** Chief Technology Officer & Lead Sales Executive  
**Status:** Confidential Master Asset  
**Project Infrastructure:**  
- **Database:** Neon Serverless PostgreSQL (`noisy-wave-14526631`)  
- **Storage:** Cloudflare R2 (`3573c16b274429f8d33bb45d3ea9c7b4`)  
- **Framework:** Next.js 15+ (App Router)

---

## 🚀 1. The Core Value Proposition: The "Elevator Pitch"

CohbyForms isn't just a survey tool; it's an **Enterprise-Grade Experience Engine**. 

While competitors offer static forms, CohbyForms provides a dynamic feedback ecosystem that lives exactly where your customers are—inside your app, on your website, or via a simple link. It bridges the gap between "data collection" and "actionable insights" by providing a rebranded, high-performance platform that you own entirely. 

**The Hook:** Stop paying monthly "per-response" taxes to Typeform or Jotform. Own your data, scale to millions of responses without egress fees, and integrate feedback directly into your business DNA.

---

## 🛠️ 2. Tech Stack & Integrations: The Engine Under the Hood

### The Architecture
- **Next.js 15 (App Router):** The gold standard for modern web apps. It ensures the dashboard is lightning-fast and the survey player is optimized for mobile devices and slow connections.
- **Neon PostgreSQL:** A serverless database that scales instantly. It handles millions of rows of response data with "Point-in-Time Recovery," meaning your data is never more than a few seconds away from a backup.
- **Cloudflare R2:** We've bypassed the expensive AWS "egress tax." By using R2, file uploads (images, PDFs) are served globally at zero bandwidth cost to the owner.
- **Prisma ORM:** Ensures the database is strictly typed and secure, preventing common data leaks found in cheaper "no-code" builders.

### Essential Accounts for the Owner
To run this at scale, the owner needs:
1. **Neon.tech Account:** For the core database.
2. **Cloudflare Account:** For R2 storage and global CDN speed.
3. **Stripe Account:** To manage subscriptions (if selling access).
4. **Vercel Account:** For high-performance hosting and automated deployments.

---

## 👥 3. Role & Permission Breakdown: "Who Can Do What?"

CohbyForms is built for teams. The database enforces strict **Multi-Tenant Isolation**, meaning data from one organization can *never* leak into another.

| Role | Capabilities | Restrictions |
| :--- | :--- | :--- |
| **Owner** | Full control over billing, team management, and all projects. | None. |
| **Manager** | Can create/edit surveys, manage integrations, and invite members. | Cannot change billing or delete the Organization. |
| **Member** | Can view results, build surveys, and manage responses. | Cannot invite others or change organization-level settings. |
| **Billing** | Purely for financial oversight and invoice management. | Cannot access survey data or edit forms. |

---

## 💎 4. Feature-by-Feature Deep Dive

### 🟢 A. The "Classic" & Card Logic Engine
- **Backend Build:** A recursive state machine that evaluates "Logic Jumps" based on real-time response data stored in a JSONB field.
- **Sales Pitch:** "Don't bore your users with irrelevant questions. Our logic engine acts like a human interviewer—if they say they're 'Not Interested,' the form instantly skips to the 'Thank You' card. Higher conversion, better data."

### 🟢 B. Hidden Fields & "Ghost" Tracking
- **Backend Build:** Uses URL parameters and session metadata to inject data into the `Response` model without the user seeing it.
- **Sales Pitch:** "Know exactly where your lead came from without asking them. Track UTM source, User ID, or Campaign ID silently. It’s like having a digital private eye attached to every form."

### 🟢 C. Rebranded Export Suite (CSV/Excel)
- **Backend Build:** Custom data-transform services (`lib/response/utils.ts`) that map internal IDs to "CohbyForm ID" for a professional look.
- **Sales Pitch:** "Your data should look like *your* data. When you export to Excel for a board meeting, it comes out clean, professional, and rebranded with your IDs—no 'powered by' watermarks."

### 🟢 D. Multi-Language Global Support
- **Backend Build:** Integrates `i18next` with a specific `SurveyLanguage` model that allows one form to hold infinite translations.
- **Sales Pitch:** "One link for the whole world. Our system detects the user's browser language and instantly serves the form in Spanish, French, or Arabic. Perfect for global brands."

### 🟢 E. The "Hidden Question" Feature (The "Monthly Collector")
- **Backend Build:** A custom `hidden` flag on the survey element that keeps the data field active in the database but skips rendering in the UI.
- **Sales Pitch:** "Need to collect data for 3 months then stop asking the question without losing your old data? Just toggle 'Hide.' You keep all your historical insights, but your new users see a shorter, faster form. It's the ultimate 'Safe Delete'."

---

## ✨ 5. Hidden Gems: Why This App is Worth $100k+

1. **Anti-Spam "Fortress" Mode:**
   - **Technical:** Integrates reCAPTCHA Enterprise and server-side rate-limiting (`applyRateLimit`).
   - **Pitch:** "While other forms get spammed by bots, we have an invisible shield. We filter out the noise before it hits your inbox, saving you hours of manual cleanup."

2. **The S3-Compatible Proxy:**
   - **Technical:** All file uploads are proxied through an internal API. This means the end-user *never* sees your Cloudflare keys.
   - **Pitch:** "Enterprise-grade security. We never expose your storage credentials to the public. Every file is handled through a secure handshake, keeping your assets private and your account safe."

3. **In-App "Atomic" Targeting:**
   - **Technical:** Uses "Segment Filters" and "Action Classes" to trigger surveys based on specific user behavior (e.g., clicking a button 3 times).
   - **Pitch:** "Context is everything. Don't just send a link; pop up a feedback card exactly when a user finishes their checkout. This is how the world's biggest apps (like Uber or Airbnb) optimize their business."

4. **"No-Egress" Infrastructure:**
   - **Technical:** Utilizing Cloudflare R2's S3 API means zero data transfer fees.
   - **Pitch:** "This app is built to be 'bill-proof.' While other platforms charge you more as you get more popular, our R2 and Neon architecture keeps your overhead almost flat, even if you go viral."

---

## 🛠️ Summary for the CTO
This codebase is a **Modern Monorepo**. It is highly modular, meaning you can pull out the `packages/surveys` logic and use it in a mobile app, or swap the `apps/web` dashboard without touching the core data logic. It is built for 99.9% uptime and zero-cost scaling.

**Ready to Scale. Ready to Sell.**



