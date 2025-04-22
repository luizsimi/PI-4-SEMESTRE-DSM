import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Pratos from '../components/Pratos';
import Review from '../components/Review';

export default function Home({ auth }) {
  return (
    <>
      <Navbar usuarioLogado={auth?.user} />
      <main>
        <section id="home">
          <h1 className="text-2xl font-bold">Bem-vindo ao site!</h1>
        </section>
        <Pratos />
        <Menu />
        <Review />
      </main>
      <Footer />
    </>
  );
}