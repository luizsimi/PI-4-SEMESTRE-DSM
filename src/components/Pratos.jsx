import { useState } from "react";
import PropTypes from "prop-types";
import img1 from "../assets/img/img1.jpg";
import img2 from "../assets/img/img2.jpg";
import img3 from "../assets/img/img3.jpg";
import img4 from "../assets/img/img4.jpg";
import img5 from "../assets/img/img5.jpg";
import img6 from "../assets/img/img6.jpg";
import DishesCard from "../layouts/DishesCard";

// Componente para exibir cada item do menu
const MenuItem = ({ img, alt, title, isActive, onClick }) => {
  return (
    <div
      className={`text-center group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
        isActive ? "scale-110" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
          isActive ? "border-green-600" : "border-transparent"
        }`}
      >
        <img
          src={img}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <p
        className={`font-semibold text-xl mt-2 transition-colors duration-300 ${
          isActive ? "text-green-600" : "text-black"
        } group-hover:text-green-600`}
      >
        {title}
      </p>
    </div>
  );
};

// PropTypes para o MenuItem
MenuItem.propTypes = {
  img: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Dishes = () => {
  // Categorias de pratos
  const categories = [
    { id: "todos", title: "Todos", img: img3 },
    { id: "carnes", title: "Carnes", img: img2 },
    { id: "aves", title: "Aves", img: img1 },
    { id: "peixes", title: "Peixes", img: img6 },
    { id: "vegano", title: "Vegano", img: img5 },
  ];

  // Todos os pratos disponíveis com suas categorias
  const allDishes = [
    {
      id: 1,
      img: img1,
      title: "Frango ao Molho",
      price: "R$ 29,90",
      rating: 4.8,
      category: "aves",
    },
    {
      id: 2,
      img: img2,
      title: "Bife com Legumes",
      price: "R$ 32,90",
      rating: 4.5,
      category: "carnes",
    },
    {
      id: 3,
      img: img3,
      title: "Macarrão",
      price: "R$ 27,90",
      rating: 4.7,
      category: "vegano",
    },
    {
      id: 4,
      img: img4,
      title: "Espetinho de Frango",
      price: "R$ 18,90",
      rating: 4.9,
      category: "aves",
    },
    {
      id: 5,
      img: img5,
      title: "Risoto Vegano",
      price: "R$ 25,90",
      rating: 4.6,
      category: "vegano",
    },
    {
      id: 6,
      img: img6,
      title: "Salmão Grelhado",
      price: "R$ 39,90",
      rating: 4.8,
      category: "peixes",
    },
  ];

  // Estado para rastrear a categoria selecionada
  const [activeCategory, setActiveCategory] = useState("todos");

  // Filtrar pratos com base na categoria selecionada
  const filteredDishes =
    activeCategory === "todos"
      ? allDishes
      : allDishes.filter((dish) => dish.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5 py-10">
      <h2 className="text-3xl font-bold text-center text-black mb-2">
        Explore nosso menu
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Escolha entre nossos pratos incríveis e descubra o sabor de uma
        experiência única.
      </p>

      {/* Menu de categorias */}
      <div className="w-full max-w-4xl mb-12">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((category) => (
            <MenuItem
              key={category.id}
              img={category.img}
              alt={category.title}
              title={category.title}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Lista de pratos filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
        {filteredDishes.map((dish) => (
          <DishesCard
            key={dish.id}
            img={dish.img}
            title={dish.title}
            price={dish.price}
            rating={dish.rating}
          />
        ))}
      </div>

      {/* Mensagem para quando não há pratos na categoria */}
      {filteredDishes.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Não há pratos disponíveis nesta categoria no momento.
        </p>
      )}
    </div>
  );
};

export default Dishes;
