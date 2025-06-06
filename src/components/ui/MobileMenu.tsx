'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface MobileMenuProps {
    isMenuOpen: boolean;
    isAuthenticated?: boolean;
    userName?: string | null;
    onSignOut?: () => void;
}

export default function MobileMenu({
    isMenuOpen,
    isAuthenticated,
    userName,
    onSignOut,
}: MobileMenuProps) {
    const pathname = usePathname();

    const dropdownItems = [
        { label: 'Register Your Business', href: '/businesses/register' },
        { label: 'Pricing Plans', href: '/coming-soon' },
        { label: 'Contact Sales', href: '/contact' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t"
        >
            <div className="px-4 py-3 space-y-1">
                {/* Main Navigation */}
                {dropdownItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            pathname === item.href
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}

        

                {/* Auth Section */}
                {isAuthenticated ? (
                    <div className="pt-4 pb-3 border-t">
                        <div className="px-3">
                            <p className="text-base font-medium text-gray-800">
                                {userName || 'User'}
                            </p>
                        </div>
                        <div className="mt-3 space-y-1">
                            <Link
                                href="/dashboard"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                            >
                                Update Profile
                            </Link>
                            <button
                                onClick={onSignOut}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-4 pb-3 border-t space-y-2">
                        <Link
                            href="/auth/signin"
                            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
