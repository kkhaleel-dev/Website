import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import "./App.css";
import Carousel2 from "./components/Carousel2";
import Carousel3 from "./components/Carousel3";

function App() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Carousel />
        <Carousel2 />
        <Carousel3 />
      </div>

      <Footer />
    </>
  );
}

export default App;
