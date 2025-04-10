'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';// Adjust path based on your structure
import AccordionMenu from './core/AccordinMenu';

interface MobileMenuProps {
    isMenuOpen: boolean;
}

export default function MobileMenu({ isMenuOpen }: MobileMenuProps) {
    const pathname = usePathname();

    const dropdownItems = [
        { label: 'Register Your Business', href: '/businesses/register' },
        { label: 'Pricing Plans', href: '/pricing' },
        { label: 'Contact Sales', href: '/contact' },
    ];

    return (
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="lg:hidden bg-white border-t border-secondary-100 shadow-lg z-50"
                >
                    <div className="px-2 pt-2 pb-4 space-y-1">
                        {[
                            { label: 'Discover', href: '/discover' },
                            { label: 'Businesses', href: '/businesses' },
                            { label: 'About', href: '/about' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2.5 text-base font-medium rounded-md ${pathname === link.href
                                    ? 'text-primary-600 bg-primary-50 font-semibold'
                                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 my-2 py-2">
                            <AccordionMenu label="For Businesses" items={dropdownItems} />
                        </div>

                        <div className="border-t border-gray-100 my-2 pt-4 pb-2 flex flex-col space-y-2">
                            <Link
                                href="/signin"
                                className="block px-3 py-2.5 text-center text-base font-medium text-primary-600 border border-primary-600 rounded-full hover:bg-primary-50 transition-all"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/signup"
                                className="block px-3 py-2.5 text-center text-base font-medium bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
