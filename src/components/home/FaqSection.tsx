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

  // {
  //   question: "Is Foodeez available in my city?",
  //   answer:
  //     "Foodeez is rapidly expanding across multiple cities. You can check if we're available in your city by entering your location in the search bar on our homepage. If we're not yet available in your area, you can sign up to be notified when we launch there.",
  // },
  // {
  //   question: "How can I leave a review for a restaurant?",
  //   answer:
  //     "To leave a review, visit the restaurant's profile page on Foodeez and click on the \"Write a Review\" button. You'll need to have a Foodeez account to submit a review. You can rate your experience, write detailed feedback, and upload photos of your visit.",
  // },
  // {
  //   question: "Are all restaurants on Foodeez verified?",
  //   answer:
  //     "Yes, all restaurants listed on Foodeez go through a verification process to ensure authenticity. Our team verifies the business details, location, and other important information before activating the listing on our platform. This helps maintain quality and trustworthiness.",
  // },
  // {
  //   question:
  //     "What happens if I have an issue with a restaurant I found on Foodeez?",
  //   answer:
  //     "If you encounter any issues with a restaurant you found through our platform, you can report the problem through the restaurant's profile page or contact our customer support team. We take all reports seriously and work with restaurant partners to resolve any concerns.",
  // },
  // {
  //   question: "Is there a cost to list my restaurant on Foodeez?",
  //   answer:
  //     "We offer both free and premium listing options for restaurants. The basic listing is free and includes essential features to showcase your restaurant. Premium listings offer additional benefits like priority placement in search results, featured status, and advanced analytics. You can view our pricing plans on the business registration page.",
  // },
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
            have questions?
          </p>

          <button className="inline-flex text-primary font-medium text-base hover:underline hover:text-primary-700 transition-colors">
            <Link href="/contact" className="flex items-center gap-2">
              <span>Contact our support team</span>
              <ArrowRight size={20} />
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
}
