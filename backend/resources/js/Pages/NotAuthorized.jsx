import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function NotAuthorized() {
    return (
        <>
            <Head title="Acesso Não Autorizado" />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-red-600 p-4">
                        <h2 className="text-white text-center text-2xl font-bold">
                            Acesso Negado
                        </h2>
                    </div>
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-red-600 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-700 text-center mb-6">
                            Você não tem permissão para acessar esta área. Esta
                            seção é exclusiva para fornecedores do LeveFit.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/"
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Voltar para Home
                            </Link>
                            <Link
                                href="/login"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Fazer Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
