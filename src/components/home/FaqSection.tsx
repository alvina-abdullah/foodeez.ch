'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How do I register my restaurant on Foodeez?',
    answer: 'You can register your restaurant by clicking on the "Register Your Business" button in the navigation bar or the CTA section. Fill out the required details about your restaurant, upload photos, add your menu, and submit for review. Our team will verify your information and activate your restaurant listing within 24-48 hours.'
  },
  {
    question: 'Is Foodeez available in my city?',
    answer: 'Foodeez is rapidly expanding across multiple cities. You can check if we\'re available in your city by entering your location in the search bar on our homepage. If we\'re not yet available in your area, you can sign up to be notified when we launch there.'
  },
  {
    question: 'How can I leave a review for a restaurant?',
    answer: 'To leave a review, visit the restaurant\'s profile page on Foodeez and click on the "Write a Review" button. You\'ll need to have a Foodeez account to submit a review. You can rate your experience, write detailed feedback, and upload photos of your visit.'
  },
  {
    question: 'Are all restaurants on Foodeez verified?',
    answer: 'Yes, all restaurants listed on Foodeez go through a verification process to ensure authenticity. Our team verifies the business details, location, and other important information before activating the listing on our platform. This helps maintain quality and trustworthiness.'
  },
  {
    question: 'What happens if I have an issue with a restaurant I found on Foodeez?',
    answer: 'If you encounter any issues with a restaurant you found through our platform, you can report the problem through the restaurant\'s profile page or contact our customer support team. We take all reports seriously and work with restaurant partners to resolve any concerns.'
  },
  {
    question: 'Is there a cost to list my restaurant on Foodeez?',
    answer: 'We offer both free and premium listing options for restaurants. The basic listing is free and includes essential features to showcase your restaurant. Premium listings offer additional benefits like priority placement in search results, featured status, and advanced analytics. You can view our pricing plans on the business registration page.'
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find answers to common questions about using Foodeez for discovering and listing restaurants.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium focus:outline-none"
                >
                  <span className="text-secondary-900">{faq.question}</span>
                  <span className={`transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                    {openIndex === index ? (
                      <Minus size={18} className="text-primary-500" />
                    ) : (
                      <Plus size={18} className="text-secondary-700" />
                    )}
                  </span>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 pt-0 border-t border-gray-100 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">Still have questions?</p>
            <a 
              href="/contact" 
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              Contact our support team
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 