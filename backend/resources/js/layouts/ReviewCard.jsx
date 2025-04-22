import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";

const ReviewCard = ({ img, name, role, stars, text }) => {
  return (
    <div className="w-full md:w-80 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-500">
      {/* Estrelas de avaliação */}
      <div className="flex mb-4 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`${
              i < stars ? "text-yellow-400" : "text-gray-200"
            } text-xl`}
          />
        ))}
      </div>

      {/* Texto da avaliação */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed italic">
          &ldquo;
          {text ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum enim earum labore aperiam, dolorem facere."}
          &rdquo;
        </p>
      </div>

      {/* Informações do cliente */}
      <div className="flex items-center pt-4 border-t border-gray-100">
        <img
          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-100"
          src={img}
          alt={`Foto de ${name}`}
        />
        <div>
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-sm text-green-600">{role || "Cliente"}</p>
        </div>
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  stars: PropTypes.number,
  text: PropTypes.string,
};

ReviewCard.defaultProps = {
  role: "Cliente",
  stars: 5,
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum enim earum labore aperiam, dolorem facere.",
};

export default ReviewCard;
