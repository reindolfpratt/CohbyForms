"use client";

import { Footer } from "../components/Footer";
import { LandingNavbar } from "../components/Navbar";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="mb-10 text-slate-500">Last updated: {lastUpdated}</p>

          <div className="prose prose-slate max-w-none text-slate-600">
            <p>
              Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully
              before using the CohbyForms website and service (the &quot;Service&quot;) operated by CohbyForms
              (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with
              these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these Terms. If you disagree with any
              part of the terms, then you may not access the Service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">1. Accounts</h2>
            <p>
              When you create an account with us, you must provide us with information that is accurate,
              complete, and current at all times. Failure to do so constitutes a breach of the Terms, which
              may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any
              activities or actions under your password, whether your password is with our Service or a
              third-party service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">2. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided by users), features, and
              functionality are and will remain the exclusive property of CohbyForms and its licensors. The
              Service is protected by copyright, trademark, and other laws of both the United States and
              foreign countries. Our trademarks and trade dress may not be used in connection with any product
              or service without the prior written consent of CohbyForms.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">3. User Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain
              information, text, graphics, videos, or other material (&quot;Content&quot;). You are
              responsible for the Content that you post to the Service, including its legality, reliability,
              and appropriateness.
            </p>
            <p>
              By posting Content to the Service, you grant us the right and license to use, modify, publicly
              perform, publicly display, reproduce, and distribute such Content on and through the Service.
              You retain any and all of your rights to any Content you submit, post or display on or through
              the Service and you are responsible for protecting those rights.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">4. Links To Other Web Sites</h2>
            <p>
              Our Service may contain links to third-party web sites or services that are not owned or
              controlled by CohbyForms.
            </p>
            <p>
              CohbyForms has no control over, and assumes no responsibility for, the content, privacy
              policies, or practices of any third-party web sites or services. You further acknowledge and
              agree that CohbyForms shall not be responsible or liable, directly or indirectly, for any damage
              or loss caused or alleged to be caused by or in connection with use of or reliance on any such
              content, goods or services available on or through any such web sites or services.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any
              reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate
              your account, you may simply discontinue using the Service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">6. Limitation of Liability</h2>
            <p>
              In no event shall CohbyForms, nor its directors, employees, partners, agents, suppliers, or
              affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
              resulting from (i) your access to or use of or inability to access or use the Service; (ii) any
              conduct or content of any third party on the Service; (iii) any content obtained from the
              Service; and (iv) unauthorized access, use or alteration of your transmissions or content,
              whether based on warranty, contract, tort (including negligence) or any other legal theory,
              whether or not we have been informed of the possibility of such damage, and even if a remedy set
              forth herein is found to have failed of its essential purpose.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">7. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot;
              and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind,
              whether express or implied, including, but not limited to, implied warranties of
              merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in
              which CohbyForms is established, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of
              those rights. If any provision of these Terms is held to be invalid or unenforceable by a court,
              the remaining provisions of these Terms will remain in effect.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">9. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
              revision is material we will try to provide at least 30 days notice prior to any new terms
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to
              be bound by the revised terms. If you do not agree to the new terms, please stop using the
              Service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>By email: support@cohbyforms.com</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
