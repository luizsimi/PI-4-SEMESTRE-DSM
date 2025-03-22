import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Sobre from "./components/Sobre";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Pratos from "./components/Pratos";
import Reviews from "./components/Review";
import Review from "./components/Review";

const App = () => {
  return (
    <div>
      <Navbar />

      <main>
        <div id="home">
          <Home />
        </div>

        <div id="pratos">
          <Pratos />
        </div>

        <div id="sobre">
          <Sobre />
        </div>

        <div id="menu">
          <Menu />
        </div>

        <div id="review">
          <Review />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
