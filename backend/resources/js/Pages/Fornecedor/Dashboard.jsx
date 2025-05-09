import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import DashboardFornecedor from "../../components/fornecedor/DashboardFornecedor";

// Importação de CSS necessárias para o dashboard
import "izitoast/dist/css/iziToast.min.css";

export default function Dashboard() {
    const { auth } = usePage().props;

    const handleLogout = () => {
        // Usar o router do Inertia para fazer logout
        router.post(route("logout"));
    };

    // Formatação dos dados do usuário para o componente
    const formatUserData = () => {
        if (!auth || !auth.user) {
            return {
                nome: "Fornecedor",
                email: "fornecedor@exemplo.com",
                telefone: "(00) 00000-0000",
                dataCadastro: new Date().toLocaleDateString(),
                fotoPerfil: "/img/menu1.jpg", // imagem padrão
                isProdutor: true,
            };
        }

        return {
            id: auth.user.id,
            nome: auth.user.nome_completo || auth.user.name,
            email: auth.user.email,
            telefone: auth.user.telefone || "(Não informado)",
            dataCadastro: auth.user.created_at,
            endereco: auth.user.rua
                ? `${auth.user.rua}, ${auth.user.numero}`
                : "Endereço não informado",
            cidade: auth.user.cidade || "Cidade não informada",
            estado: auth.user.estado || "UF",
            cep: auth.user.cep || "CEP não informado",
            fotoPerfil: "/img/menu1.jpg", // imagem padrão
            isProdutor: true,
        };
    };

    return (
        <>
            <Head title="Dashboard de Fornecedor" />
            <DashboardFornecedor
                usuario={formatUserData()}
                onLogout={handleLogout}
            />
        </>
    );
}
