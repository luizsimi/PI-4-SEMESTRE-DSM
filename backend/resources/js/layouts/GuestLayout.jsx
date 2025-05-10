import React from "react";
import { Link } from "@inertiajs/react";
import { FaLeaf } from "react-icons/fa";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-green-50 to-gray-100">
            <div className="w-full sm:max-w-md mt-6 px-8 py-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden sm:rounded-xl">
                <div className="mb-8 flex justify-center">
                    <Link href="/">
                        <div className="flex items-center">
                            <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mr-3 shadow-md">
                                <FaLeaf className="text-white text-xl" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                LeveFit
                            </h1>
                        </div>
                    </Link>
                </div>
                {children}
            </div>
            <div className="mt-6 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} LeveFit. Todos os direitos
                reservados.
            </div>
        </div>
    );
}
