import { useState, useEffect } from "react";
import ReviewCard from "../layouts/ReviewCard";
import img1 from "../assets/img/pic1.png";
import img2 from "../assets/img/pic2.png";
import img3 from "../assets/img/pic3.png";
import { FaQuoteRight } from "react-icons/fa";

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviews = [
    {
      img: img1,
      name: "Sophia Falcão",
      role: "Cliente Premium",
      stars: 5,
      text: "Os pratos são sempre deliciosos e chegam quentinhos. A variedade do cardápio me surpreende toda semana!",
    },
    {
      img: img2,
      name: "João Pedro",
      role: "Cliente Frequente",
      stars: 4,
      text: "Atendimento rápido e qualidade garantida. Sempre peço aqui quando preciso de uma refeição saudável e nutritiva.",
    },
    {
      img: img3,
      name: "Vitoria Zurita",
      role: "Cliente Novo",
      stars: 5,
      text: "Fiquei impressionada com a qualidade e apresentação dos pratos. Definitivamente vou pedir mais vezes!",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === reviews.length - 1 ? 0 : current + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-16 md:px-32 px-5 bg-gradient-to-b from-white to-green-50">
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-green-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full opacity-30"></div>
      <div className="absolute top-1/3 right-20 w-10 h-10 bg-yellow-100 rounded-full opacity-60"></div>

      {/* Ícone de aspas decorativo */}
      <div className="mb-8">
        <FaQuoteRight className="text-5xl text-green-500 opacity-30" />
      </div>

      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
        O Que Nossos Clientes Dizem
      </h1>

      <div className="w-24 h-1 bg-green-500 rounded-full mb-12"></div>

      <div className="flex flex-col md:flex-row gap-6 mt-5 max-w-6xl">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`transform transition-all duration-500 ease-in-out ${
              activeIndex === index ? "scale-105 z-10" : "scale-95 opacity-70"
            }`}
          >
            <ReviewCard
              img={review.img}
              name={review.name}
              role={review.role}
              stars={review.stars}
              text={review.text}
            />
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="flex mt-10 gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index ? "bg-green-500 w-8" : "bg-gray-300"
            }`}
            aria-label={`Ver avaliação ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Review;
