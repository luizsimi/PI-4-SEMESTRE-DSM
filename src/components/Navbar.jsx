import React, { useState } from "react";
import { Link } from "react-scroll";
import { BiRestaurant } from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";

const Modal = ({ isOpen, closeModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simula o envio de dados (você pode substituir com sua lógica real)
    setTimeout(() => {
      setIsSubmitting(false);
      closeModal();
    }, 2000); // Simula 2 segundos de carregamento
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative animate-fadeIn">
          <AiOutlineClose
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500"
            size={20}
            onClick={closeModal}
            aria-label="Fechar modal"
          />
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 text-lg font-semibold transition-all ${
                isLogin
                  ? "border-b-4 border-brightColor text-brightColor"
                  : "text-gray-500"
              } rounded-xl`}
              onClick={() => setIsLogin(true)}
              aria-selected={isLogin}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 text-lg font-semibold transition-all ${
                !isLogin
                  ? "border-b-4 border-brightColor text-brightColor"
                  : "text-gray-500"
              } rounded-xl`}
              onClick={() => setIsLogin(false)}
              aria-selected={!isLogin}
            >
              Cadastro
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            aria-live="polite"
          >
            {isLogin ? (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-brightColor outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-brightColor outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-brightColor text-white py-3 rounded-xl shadow-md hover:bg-opacity-90 transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Carregando..." : "Entrar"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-brightColor outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-brightColor outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-brightColor outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Endereço"
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-brightColor outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-brightColor text-white py-3 rounded-xl shadow-md hover:bg-opacity-90 transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Carregando..." : "Cadastrar"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    )
  );
};

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const handleChange = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="fixed w-full">
      <div>
        <div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="flex flex-row items-center cursor-pointer">
            <span>
              <BiRestaurant size={32} />
            </span>
            <h1 className="text-xl font-semibold">LeveFit</h1>
          </div>
          <nav className="hidden md:flex flex-row items-center text-lg font-medium gap-8">
            <Link
              to="home"
              spy
              smooth
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Home
            </Link>
            <div className="relative group">
              <div className="flex items-center gap-1">
                <Link
                  to="dishes"
                  spy
                  smooth
                  duration={500}
                  className="hover:text-brightColor transition-all cursor-pointer"
                >
                  Pratos
                </Link>
                <BiChevronDown className="cursor-pointer" size={25} />
              </div>
              <ul className="absolute hidden space-y-2 group-hover:block bg-white border border-gray-300 rounded-lg p-5">
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Ave
                  </Link>
                </li>
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Bovina
                  </Link>
                </li>
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Peixe
                  </Link>
                </li>
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Avaliados
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              to="about"
              spy
              smooth
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Sobre
            </Link>
            <Link
              to="menu"
              spy
              smooth
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Destaques
            </Link>
            <Link
              to="review"
              spy
              smooth
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Avaliações
            </Link>
            <button
              onClick={openModal}
              className="px-6 py-1 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full"
            >
              Login
            </button>
          </nav>
          <div className="md:hidden flex items-center">
            {menu ? (
              <AiOutlineClose size={25} onClick={handleChange} />
            ) : (
              <AiOutlineMenuUnfold size={25} onClick={handleChange} />
            )}
          </div>
        </div>
        <Modal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default Navbar;
