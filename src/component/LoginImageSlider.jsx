import React, { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    img: "https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?semt=ais_hybrid&w=740&q=80",
    title: "Fast & Secure Login",
    desc: "Access your account with complete safety.",
  },
  {
    id: 2,
    img: "https://via.placeholder.com/600x400?text=Slide+2",
    title: "Track Your Orders",
    desc: "Stay updated with real-time order status.",
  },
  {
    id: 3,
    img: "https://via.placeholder.com/600x400?text=Slide+3",
    title: "Best Offers Everyday",
    desc: "Enjoy amazing deals and discounts.",
  },
];

function LoginImageSlider() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[350px] overflow-hidden rounded-xl shadow-lg">

      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image */}
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-white text-2xl font-bold mb-2">
              {slide.title}
            </h2>
            <p className="text-white text-sm">{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* Dots (Indicators) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              index === i ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default LoginImageSlider;
