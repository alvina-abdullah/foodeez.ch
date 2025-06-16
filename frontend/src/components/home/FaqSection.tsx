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
    question: "What is Foodeez?",
    answer: "",
  },
  {
    question: "Who can join Foodeez?",
    answer: "",
  },
  {
    question: "Why should I register my business on Foodeez?",
    answer: "",
  },
  {
    question: "Do I need to be on Google or Instagram to join?",
    answer: "",
  },
  {
    question: "Can Foodeez help set up Google Maps and Instagram for my restaurant?",
    answer: "",
  },
  {
    question: "How will Foodeez help bring more customers?",
    answer: "",
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
                <span className="text-primary text-lg">{faq.question}</span>
                <span
                  className={`transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {openIndex === index ? (
                    <Minus size={20} className="text-primary" />
                  ) : (
                    <Plus size={20} className="text-primary" />
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
            Have more questions?
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
