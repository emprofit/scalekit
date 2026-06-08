"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  accent?: boolean;
};

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "What kind of products can I buy on ScaleKit?",
    answer:
      "ScaleKit offers practical digital products for businesses, founders, marketers, teams, and technical professionals. The catalogue includes research tools, SEO products, performance resources, conversion systems, integrations, automation products, themes, and technical utilities.",
  },
  {
    id: 2,
    question: "Who are ScaleKit products designed for?",
    answer:
      "They are built for people who want useful assets they can apply quickly—startup founders, small business owners, creators, consultants, students, operators, and teams looking for faster execution without starting from scratch.",
  },
  {
    id: 3,
    question: "How will I receive my product after payment?",
    answer:
      "Once payment is confirmed, secure product access is delivered to the email used at checkout. Depending on the product, the package may include downloadable files, documentation, access details, setup resources, or other relevant materials.",
  },
  {
    id: 4,
    question: "Can I use ScaleKit products for real business work?",
    answer:
      "Yes. The idea behind ScaleKit is to provide practical business-ready assets, not just decorative files. Many products are meant to help you plan, launch, present, market, organize, or grow more effectively in real execution environments.",
  },
  {
    id: 5,
    question: "Do you offer a 7-day money-back guarantee?",
    answer:
      "Because ScaleKit products are digital products and access-based resources, eligibility for a refund depends on the delivery and access status of the order. Contact ScaleKit support before purchasing when you need clarification about a specific product.",
    accent: true,
  },
  {
    id: 6,
    question:
      "Where can I get help if I have a question before or after purchase?",
    answer:
      "Customers can use the ScaleKit Shop, Cart, Checkout, product-access verification, and support options to browse products, complete purchases, receive access, and request assistance when needed.",
  },
];

export default function VaultFaq() {
  const [openId, setOpenId] = useState<number>(5);

  const toggleFaq = (id: number) => {
    setOpenId((current) => (current === id ? 0 : id));
  };

  return (
    // <section className="bg-[#040506] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
    <section
      id="vault-faq"
      className="bg-[#040506] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1080px]">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#6DA9FF]">
            Help Center
          </p>

          <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
            Everything you need to know about shopping digital products on
            ScaleKit, from what you can buy to delivery, usage, support,
            and our 7-day money-back guarantee.
          </p>
        </div>

        <div className="mt-12 rounded-[28px] border border-white/6 bg-white/[0.015] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-6 lg:mt-14 lg:p-8">
          <div className="divide-y divide-white/8">
            {faqs.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div key={item.id} className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    className="flex w-full items-start justify-between gap-6 px-0 py-6 text-left sm:py-7"
                    aria-expanded={isOpen}
                    aria-controls={`vault-faq-${item.id}`}
                  >
                    <span
                      className={`pr-2 text-xl font-medium leading-[1.35] tracking-[-0.03em] sm:text-2xl ${
                        item.accent && isOpen ? "text-[#F0BE35]" : "text-white"
                      }`}
                    >
                      {item.id}. {item.question}
                    </span>

                    <span
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                        isOpen
                          ? "border-[#F0BE35]/20 bg-[#F0BE35]/10 text-[#F0BE35]"
                          : "border-white/10 bg-white/[0.02] text-white"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </span>
                  </button>

                  <div
                    id={`vault-faq-${item.id}`}
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="max-w-[92ch] pb-6 pr-2 text-base leading-8 text-white/74 sm:pb-7 sm:text-[1.05rem]">
                        {item.answer}
                      </div>
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
}
