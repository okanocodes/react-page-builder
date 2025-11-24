import { Navigation, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import type { BuilderElement } from "../../types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

export default function SimpleSlider({ element }: { element: BuilderElement }) {
  if (element.type !== "slider") return null;

  return (
    <Swiper
      modules={[Navigation, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      simulateTouch={false}
      style={{ position: "relative" }}
    >
      {element.content.slides?.map((slide: string, index: number) => (
        <SwiperSlide key={index}>
          <img
            src={slide}
            alt={`Slide ${index + 1}`}
            style={{
              width: element.position.width,
              height: element.position.height,
              objectFit: "cover",
            }}
            width={element.position.width}
            height={element.position.height}
          />
        </SwiperSlide>
      ))}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 999,
          opacity: 0,
          backgroundColor: "black",
        }}
      ></div>
    </Swiper>
  );
}
