import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

type EventCardProps = {
  title: string;
  description: string;
  images: string[];
  reverse?: boolean;
};

export default function EventCard({
  title,
  description,
  images,
  reverse = false,
}: EventCardProps) {
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="rounded-2xl border border-border bg-background-secondary/60 p-5 md:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-xl my-10">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background-secondary px-2 py-1 text-[10px] uppercase tracking-wider text-white/60">
          Event
        </span>
        <span className="h-px w-10 bg-white/10" />
      </div>
      <div
        className={`flex flex-col md:flex-row gap-20 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="md:w-[40%] w-full">
          <Swiper
            effect={"cards"}
            grabCursor
            modules={[EffectCards]}
            className="mySwiper w-full"
            onSwiper={setMainSwiper}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            cardsEffect={{}}
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={`${image}-${index}`}
                className="!flex items-center justify-center"
              >
                <div className="relative w-full">
                  <img
                    src={image}
                    alt={title}
                    className="h-auto w-full aspect-[4/5] object-cover rounded-xl border border-border bg-black/10 shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-xl bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="md:w-[60%] w-full space-y-6">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-space-grotesk font-bold">
            {title}
          </h3>
          <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed">
            {description}
          </p>
          <div>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="flex-shrink-0">
                  <img
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
                    className={`h-20 w-20 aspect-square object-cover rounded-lg border transition-all duration-200 cursor-pointer ${
                      activeIndex === index
                        ? "border-white/80 opacity-100"
                        : "border-border opacity-70 hover:opacity-90"
                    }`}
                    onClick={() => {
                      if (mainSwiper) {
                        mainSwiper.slideTo(index);
                      }
                      setActiveIndex(index);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
