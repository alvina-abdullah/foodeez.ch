"use client";

import { useSession } from "../../../../node_modules/next-auth/react";
import { motion } from "framer-motion";
import {
  Settings,
  CircleUser,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session } = useSession();

  const quickActions = [
    {
      title: "Update Profile",
      description: "Keep your information current",
      icon: Settings,
      href: "/dashboard/profile",
    },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary p-6 md:p-8 shadow-xl text-white"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="sub-heading text-white">
              Welcome back, {session?.user?.name || "Guest"}!
            </h1>
            <p className="sub-heading-description text-white">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Profile Image */}
          <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-white shadow-md">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                fill
                className="object-cover"
                unoptimized={session.user.image.startsWith("http")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <CircleUser className="text-gray-400 w-8 h-8" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="md:py-6 bg-white rounded-xl shadow-sm"
      >
        <h2 className="sub-heading">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={action.href}>
                <div className="group bg-gray-50 hover:bg-primary-50 transition-colors p-5 rounded-lg border border-gray-100 shadow-sm cursor-pointer h-full">
                  <action.icon className="h-8 w-8 text-primary mb-4 group-hover:text-accent transition-colors" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
