"use client";

import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How much does it cost to use EventFi?",
      answer: "EventFi is completely free to use for free events. For paid events, the organizer always receives the full ticket price. We simply apply a transparent processing fee of 4% + ₦200 to the attendee at checkout."
    },
    {
      question: "How do the installment payments work?",
      answer: "When organizers enable installment payments for a premium ticket, you can secure your spot by paying a fraction of the total cost upfront. The remaining balance is automatically split into scheduled payments leading up to the event."
    },
    {
      question: "Can I host both physical and online events?",
      answer: "Absolutely! EventFi supports physical venues (with map integration), fully online events (with secure URL/password access), and hybrid events that offer both experiences."
    },
    {
      question: "How do payouts work for organizers?",
      answer: "Once you verify your bank account on the platform, you can easily request a payout from your organizer dashboard. Funds are processed securely through our Paystack integration and arrive directly in your bank account."
    },
    {
      question: "What is the Vendor Marketplace?",
      answer: "The marketplace is where organizers can discover, book, and pay for verified event services like photographers, DJs, and caterers directly within the platform. It eliminates the hassle of sourcing external vendors."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Got questions? We've got answers. If you can't find what you're looking for, our support team is always here to help.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border border-foreground/10 rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-primary/5 border-primary/20 shadow-md' : 'bg-background hover:border-foreground/20'}`}
                >
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className={`text-left text-lg font-bold font-[family-name:var(--font-clash-display)] transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'bg-primary/10 text-primary rotate-180' : 'bg-foreground/5 text-foreground/50'}`}>
                      <CaretDown size={16} weight="bold" />
                    </div>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
