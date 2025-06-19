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
    answer:
      "Foodeez is a food discovery platform designed to connect local restaurants, cafés, and takeaways in Switzerland with tourists and food lovers actively searching for places to eat. We help your business get discovered — online and in person.",
  },
  {
    question: "Who can join Foodeez?",
    answer:
      "Any food business in Switzerland — including restaurants, takeaways, cafés, food trucks, bakeries, or specialty stores — is welcome to join, whether you're well-known or just starting out.",
  },
  {
    question: "Why should I register my business on Foodeez?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Get discovered on our map and food app</li>
        <li>Reach tourists in your area</li>
        <li>Improve your online visibility (Google, Instagram, etc.)</li>
        <li>Access free and premium marketing services</li>
      </ul>`
  },
  {
    question: "Do I need to be on Google or Instagram to join?",
    answer:
      "No — in fact, Foodeez helps you get there! If you're not yet visible online, our Premium plan includes setup for Google My Business and social media accounts, at no extra cost during your first year.",
  },
  {
    question: "Can Foodeez help set up Google Maps and Instagram for my restaurant?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Google My Business creation or optimization</li>
        <li>Instagram and Facebook setup or refresh</li>
        <li>Help creating your first social media posts or reels</li>
      </ul>`
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-2 md:px-0">
      <div className="">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-lg md:text-xl text-accent-dark max-w-2xl mx-auto">
            Everything you need to know about using Foodeez as a business or food lover.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-accent rounded-2xl bg-white/80 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-lg md:text-xl text-primary focus:outline-none hover:bg-primary/5 transition-colors"
              >
                <span>{faq.question}</span>
                <span
                  className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                >
                  {openIndex === index ? (
                    <Minus size={28} className="text-primary" />
                  ) : (
                    <Plus size={28} className="text-primary" />
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
                      className="px-6 pb-6 pt-0 border-t border-gray-100 text-text-main text-base md:text-lg bg-white"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <Link href="/faq">
            <button className="px-8 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-lg md:text-xl font-semibold text-gray-700 transition-colors shadow-md">
              Have more questions?
            </button>
          </Link>

          <Link href="/contact">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white hover:bg-primary-700 transition-colors text-lg md:text-xl font-semibold shadow-md">
              <span>Contact Us</span>
              <ArrowRight size={24} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
