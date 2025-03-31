// src/components/DishesCard.jsx
import { BsStarFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import Button from "./Button";
import PropTypes from "prop-types";

const DishesCard = ({ img, title, price, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transition-all hover:shadow-lg hover:scale-105">
      <div className="h-[220px] overflow-hidden relative">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
      </div>
      <div className="p-5 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <BsStarFill
                key={i}
                className={
                  i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
                }
                size={16}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{rating}</span>
        </div>

        <p className="text-gray-700 font-bold mb-4">{price}</p>

        <div>
          <Button
            title={
              <div className="flex items-center text-sm">
                <FaWhatsapp className="mr-2" />
                <span>Contatar</span>
              </div>
            }
            primary={true}
          />
        </div>
      </div>
    </div>
  );
};

DishesCard.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};

export default DishesCard;
