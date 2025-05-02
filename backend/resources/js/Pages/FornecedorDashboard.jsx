import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import DashboardFornecedor from "../components/fornecedor/DashboardFornecedor";

export default function FornecedorDashboard() {
    const { auth } = usePage().props;

    const handleLogout = () => {
        // Em produção, você usaria o Inertia para fazer logout
        // router.post(route('logout'));

        // Por enquanto, apenas redirecionamos para a home
        router.visit("/");
    };

    return (
        <>
            <Head title="Dashboard de Fornecedor" />
            <DashboardFornecedor onLogout={handleLogout} />
        </>
    );
}
