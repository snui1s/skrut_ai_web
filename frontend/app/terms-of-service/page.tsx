import React from 'react';
import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Skrut AI's resume analysis services.",
};

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground pb-[env(safe-area-inset-bottom)] antialiased">
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section className="space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary text-balance">Terms of Service</h1>
            <p className="text-xs md:text-sm text-foreground/50 font-medium tracking-wide uppercase">Last Updated: {lastUpdated}</p>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed pt-2 md:pt-4 text-pretty">
              By using Skrut AI, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.
            </p>
          </section>

          <hr className="border-secondary/10" />

          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary text-balance">1. Description of Service</h2>
              <p className="text-foreground/70 leading-relaxed text-pretty">
                Skrut AI provides an AI-driven platform for resume analysis and candidate potential evaluation. The service is intended for professional recruitment purposes and serves as a tool to assist human decision-making, not to replace it. <strong>The analysis provided by Skrut AI is for advisory purposes only.</strong> Users must exercise their own professional judgment in all recruitment activities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary text-balance">2. User Responsibilities</h2>
              <p className="text-foreground/70 leading-relaxed text-pretty">
                As a user of Skrut AI, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/70 ml-4 font-medium">
                <li>You have obtained all necessary consents from candidates before uploading their resumes.</li>
                <li>You will not use the service for any illegal or unauthorized purposes.</li>
                <li>You shall not attempt to decompile, reverse engineer, or bypass any security features of the platform.</li>
                <li>The information you provide (Job Descriptions, etc.) is accurate and professional.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary text-balance">3. Limitation of Liability</h2>
              <p className="text-foreground/70 leading-relaxed text-pretty">
                Skrut AI provides evaluations based on artificial intelligence models. While we strive for high accuracy, we do not guarantee the completeness or reliability of the analysis. <strong>Skrut AI does not warrant that the service will be error-free or that AI-generated scores will perfectly reflect a candidate’s actual performance.</strong> You agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/70 ml-4 font-medium">
                <li>Final hiring decisions are the sole responsibility of the user.</li>
                <li>Skrut AI is not liable for any employment-related disputes or damages arising from the use of our analysis.</li>
                <li>The service is provided "as is" without any warranties.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary text-balance">4. Intellectual Property</h2>
              <p className="text-foreground/70 leading-relaxed text-pretty">
                All software, designs, logos, and algorithms associated with Skrut AI are the property of Skrut AI or its licensors. You are granted a limited, non-exclusive license to use the service for your internal recruitment needs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary text-balance">5. Modifications to Service</h2>
              <p className="text-foreground/70 leading-relaxed text-pretty">
                We reserve the right to modify or discontinue Skrut AI (or any part thereof) with or without notice at any time. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>
          </div>

          <div className="pt-8 text-center bg-secondary/5 rounded-3xl p-8 border border-secondary/5">
            <p className="text-sm text-foreground/60 leading-relaxed text-pretty">
              By using this service, you acknowledge that you have read and understood these Terms of Service. If you have any questions, please contact us at:
              <br />
              <a href="mailto:p.indulakshana@gmail.com" className="text-primary font-bold block mt-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2">p.indulakshana@gmail.com</a>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
