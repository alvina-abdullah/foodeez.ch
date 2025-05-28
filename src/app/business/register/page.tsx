
import { Metadata } from "next";
import BusinessRegistrationForm from "./components/BusinessRegistrationForm";

export const metadata: Metadata = {
  title: "Register Your Business | Foodeez",
  description: "List your restaurant or food business on Foodeez to reach more customers.",
};

export default function RegisterBusinessPage() {
  return (
    <div className="py-20">
      <div className="">
        <div className="text-center mb-12">
          <h1 className="main-heading">
            Register Your Business
          </h1>
          <p className="main-heading-description">
            Join the Foodeez community and connect with food lovers in your area
          </p>
        </div>
        
        <BusinessRegistrationForm />
      </div>
    </div>
  );
} 