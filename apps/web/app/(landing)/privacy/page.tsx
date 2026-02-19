"use client";

import { Footer } from "../components/Footer";
import { LandingNavbar } from "../components/Navbar";

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar />

      <main className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 sm:p-12">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mb-10 text-slate-500">Last updated: {lastUpdated}</p>

          <div className="prose prose-slate max-w-none text-slate-600">
            <p>
              At CohbyForms (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we respect your privacy and
              are committed to protecting the personal information you share with us. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you access or use
              our website and services (collectively, the &quot;Service&quot;).
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy
              policy, please do not access the site.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect information about you in a range of forms, including personal data and usage data.
              Personal data includes any information that can be used to personally identify you.
            </p>

            <h3 className="mt-4 text-lg font-medium text-slate-900">Personal Data</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Identity Data:</strong> such as your name, username, or similar identifier.
              </li>
              <li>
                <strong>Contact Data:</strong> such as your email address and telephone number.
              </li>
              <li>
                <strong>Financial Data:</strong> details necessary for processing payments (we use third-party
                payment processors and do not store full credit card details).
              </li>
              <li>
                <strong>Content Data:</strong> any content you upload, such as form data, survey responses,
                and images.
              </li>
            </ul>

            <h3 className="mt-4 text-lg font-medium text-slate-900">Usage Data</h3>
            <p>
              We may also collect information about how the Service is accessed and used (&quot;Usage
              Data&quot;). This Usage Data may include information such as your computer&apos;s Internet
              Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that
              you visit, the time and date of your visit, the time spent on those pages, unique device
              identifiers and other diagnostic data.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">2. How We Use Your Information</h2>
            <p>We use the information we collect in the following ways:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>To provide, operate, and maintain our Service;</li>
              <li>To improve, personalize, and expand our Service;</li>
              <li>To understand and analyze how you use our Service;</li>
              <li>To develop new products, services, features, and functionality;</li>
              <li>
                To communicate with you, either directly or through one of our partners, including for
                customer service, to provide you with updates and other information relating to the Service,
                and for marketing and promotional purposes;
              </li>
              <li>To process your transactions;</li>
              <li>To find and prevent fraud;</li>
              <li>To comply with legal obligations.</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">3. Sharing Your Information</h2>
            <p>We may share your information with third parties in the following situations:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Service Providers:</strong> We may share your data with third-party vendors, service
                providers, contractors, or agents who perform services for us or on our behalf and require
                access to such information to do that work.
              </li>
              <li>
                <strong>Business Transfers:</strong> We may share or transfer your information in connection
                with, or during negotiations of, any merger, sale of company assets, financing, or acquisition
                of all or a portion of our business to another company.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information where we are legally
                required to do so in order to comply with applicable law, governmental requests, a judicial
                proceeding, court order, or legal process.
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">4. Data Retention</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes set out in
              this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply
              with our legal obligations (for example, if we are required to retain your data to comply with
              applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">5. Security of Your Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over
              the Internet, or method of electronic storage is 100% secure. While we strive to use
              commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute
              security.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">6. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>The right to access</strong> – You have the right to request copies of your personal
                data.
              </li>
              <li>
                <strong>The right to rectification</strong> – You have the right to request that we correct
                any information you believe is inaccurate.
              </li>
              <li>
                <strong>The right to erasure</strong> – You have the right to request that we erase your
                personal data, under certain conditions.
              </li>
              <li>
                <strong>The right to restrict processing</strong> – You have the right to request that we
                restrict the processing of your personal data, under certain conditions.
              </li>
              <li>
                <strong>The right to object to processing</strong> – You have the right to object to our
                processing of your personal data, under certain conditions.
              </li>
              <li>
                <strong>The right to data portability</strong> – You have the right to request that we
                transfer the data that we have collected to another organization, or directly to you, under
                certain conditions.
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">7. Children&apos;s Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally
              identifiable information from anyone under the age of 13. If You are a parent or guardian and
              You are aware that Your child has provided Us with Personal Data, please contact Us.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically
              for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">9. Google User Data</h2>
            <p>
              Our use and transfer to any other app of information received from Google APIs will adhere to{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800">
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>By email: support@cohbyforms.com</li>
              <li>By visiting this page on our website: /contact</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
