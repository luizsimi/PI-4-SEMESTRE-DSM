import PropTypes from "prop-types";

const Button = ({ title, onClick, primary = true }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center
        ${
          primary
            ? "bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 hover:border-green-700 shadow-md hover:shadow-lg"
            : "border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
    >
      {title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
};

export default Button;
