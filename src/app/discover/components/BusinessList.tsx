"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Grid, List } from "lucide-react";
import BusinessListItem from "./BusinessListItem";
import { DiscoverBusiness } from "@/types/discover.types";
import BusinessCard from "./BusinessCard";

interface BusinessListProps {
    businesses: DiscoverBusiness[];
}

export default function BusinessList({ businesses }: BusinessListProps) {

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Animation variants for list items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div>
            {/* View Toggle */}
            <div className="flex justify-end mb-4">
                <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                        aria-label="Grid view"
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                        aria-label="List view"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>


            {/* Business Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-6"
                    }`}
            >
                {businesses.map((business) => (
                    <motion.div
                        key={business.Business_ID}
                        variants={itemVariants}
                        className={viewMode === "list" ? "w-full" : ""}
                    >
                        {viewMode === "grid" ? (
                            <BusinessCard business={business} />
                        ) : (
                            <BusinessListItem business={business} />
                        )}
                    </motion.div>
                ))}
            </motion.div>


        </div>
    );
} 