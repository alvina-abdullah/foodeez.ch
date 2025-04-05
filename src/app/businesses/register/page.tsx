import { Metadata } from "next";
import BusinessRegistrationForm from "@/components/business/BusinessRegistrationForm";

export const metadata: Metadata = {
  title: "Register Your Business | Foodeez",
  description: "List your restaurant or food business on Foodeez to reach more customers.",
};

export default function RegisterBusinessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Register Your Business
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Join the Foodeez community and connect with food lovers in your area
          </p>
        </div>
        
        <BusinessRegistrationForm />
      </div>
    </div>
  );
} 