"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section className="space-y-4">
            <h1 className="text-4xl font-bold text-secondary">Terms of Service</h1>
            <p className="text-sm text-foreground/50 font-medium">Last Updated: {lastUpdated}</p>
            <p className="text-lg text-foreground/70 leading-relaxed pt-4">
              By using Skrut AI, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.
            </p>
          </section>

          <hr className="border-secondary/10" />

          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">1. Description of Service</h2>
              <p className="text-foreground/70 leading-relaxed">
                Skrut AI provides an AI-driven platform for resume analysis and candidate potential evaluation. The service is intended for professional recruitment purposes and serves as a tool to assist human decision-making, not to replace it. <strong>The analysis provided by Skrut AI is for advisory purposes only.</strong> Users must exercise their own professional judgment in all recruitment activities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">2. User Responsibilities</h2>
              <p className="text-foreground/70 leading-relaxed">
                As a user of Skrut AI, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/70 ml-4">
                <li>You have obtained all necessary consents from candidates before uploading their resumes.</li>
                <li>You will not use the service for any illegal or unauthorized purposes.</li>
                <li>You shall not attempt to decompile, reverse engineer, or bypass any security features of the platform.</li>
                <li>The information you provide (Job Descriptions, etc.) is accurate and professional.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">3. Limitation of Liability</h2>
              <p className="text-foreground/70 leading-relaxed">
                Skrut AI provides evaluations based on artificial intelligence models. While we strive for high accuracy, we do not guarantee the completeness or reliability of the analysis. <strong>Skrut AI does not warrant that the service will be error-free or that AI-generated scores will perfectly reflect a candidate’s actual performance.</strong> You agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/70 ml-4">
                <li>Final hiring decisions are the sole responsibility of the user.</li>
                <li>Skrut AI is not liable for any employment-related disputes or damages arising from the use of our analysis.</li>
                <li>The service is provided "as is" without any warranties.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">4. Intellectual Property</h2>
              <p className="text-foreground/70 leading-relaxed">
                All software, designs, logos, and algorithms associated with Skrut AI are the property of Skrut AI or its licensors. You are granted a limited, non-exclusive license to use the service for your internal recruitment needs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">5. Modifications to Service</h2>
              <p className="text-foreground/70 leading-relaxed">
                We reserve the right to modify or discontinue Skrut AI (or any part thereof) with or without notice at any time. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>
          </div>

          <div className="pt-8 text-center bg-secondary/5 rounded-3xl p-8 border border-secondary/5">
            <p className="text-sm text-foreground/60 leading-relaxed">
              By using this service, you acknowledge that you have read and understood these Terms of Service. If you have any questions, please contact us at:
              <br />
              <span className="text-primary font-bold block mt-2">p.indulakshana@gmail.com</span>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
