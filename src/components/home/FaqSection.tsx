"use client";

import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do I register my restaurant on Foodeez?",
    answer:
      "As of now, you cannot register because <b>Foodeez is under construction.</b>",
  },
  {
    question: "What is Foodeez?",
    answer:
      "Foodeez is a community-driven food discovery platform that connects food lovers with local restaurants, home chefs, and food brands. Whether you're craving something new or want to share your food story, Foodeez is the place to be.",
  },
  {
    question: "Who can join Foodeez?",
    answer:
      "Anyone with a passion for food can join! Whether you're a restaurant owner, food blogger, home chef, or just someone who loves discovering and reviewing food — Foodeez welcomes you.",
  },
  {
    question: "Why should I register my business on Foodeez?",
    answer:
      "Listing your restaurant or food business on Foodeez increases your visibility, helps attract more local customers, and gives you tools to manage your reputation and grow your brand.",
  },
  {
    question: "Do I need to be on Google or Instagram to join?",
    answer:
      "Not at all. While having a social media presence helps, Foodeez is a standalone platform. You can create your profile, upload photos, share your story, and connect with foodies without any external accounts.",
  },
  {
    question:
      "Can Foodeez help set up Google Maps and Instagram for my restaurant?",
    answer:
      "Yes! Our team plans to offer optional onboarding services in the future, including help with setting up your Google Business Profile, Instagram page, and syncing them with your Foodeez profile.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="sub-heading">Frequently Asked Questions</h2>
          <p className="sub-heading-description">
            Find answers to common questions about using Foodeez for discovering
            and listing restaurants.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-accent rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left font-medium focus:outline-none"
              >
                <span className="text-primary">{faq.question}</span>
                <span
                  className={`transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {openIndex === index ? (
                    <Minus size={18} className="text-primary" />
                  ) : (
                    <Plus size={18} className="text-primary-dark" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="p-4 pt-0 border-t border-gray-100 text-text-main"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-3 text-text-main text-base sm:text-lg">
            Have questions?
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-primary font-medium text-base hover:underline hover:text-primary-700 transition-colors"
          >
            <span>Contact Us</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
