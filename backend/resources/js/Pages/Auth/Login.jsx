import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Bem-vindo de volta!
                </h2>
                <p className="text-gray-600 mt-1">
                    Faça login para acessar sua conta
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="relative">
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-gray-700 mb-1"
                    />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-green-500" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-10 block w-full rounded-lg"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="relative">
                    <div className="flex items-center justify-between">
                        <InputLabel
                            htmlFor="password"
                            value="Senha"
                            className="text-gray-700 mb-1"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-green-500" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="pl-10 block w-full rounded-lg"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Lembrar-me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                        >
                            Esqueceu a senha?
                        </Link>
                    )}
                </div>

                <PrimaryButton
                    className="w-full py-3 justify-center text-center"
                    disabled={processing}
                >
                    Entrar
                </PrimaryButton>

                <div className="mt-6 text-center">
                    <span className="text-gray-600 text-sm">
                        Não tem uma conta?{" "}
                    </span>
                    <Link
                        href={route("register")}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                        Criar conta
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
