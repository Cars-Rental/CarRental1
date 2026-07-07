"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface CarImageGalleryProps {
  images: { secure_url: string; _id: string }[];
  carName: string;
  isAvailable?: boolean;
}

export function CarImageGallery({
  images,
  carName,
  isAvailable,
}: CarImageGalleryProps) {
  const t = useTranslations("CarDetails");
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const fallbackImage = "/assets/images/landing/car1.png";

  const mainImage = images[activeIndex] ?? images[0];
  const thumbnails = images.slice(0, 3);
  const extraCount = images.length > 3 ? images.length - 3 : 0;
  const getImageSource = (image?: { secure_url: string; _id: string }) =>
    image && !failedImages.has(image._id) && image.secure_url?.trim()
      ? image.secure_url
      : fallbackImage;
  const isCloudinaryImage = (src: string) =>
    src.startsWith("https://res.cloudinary.com");
  const markImageFailed = (imageId?: string) => {
    if (!imageId) return;
    setFailedImages((current) => new Set(current).add(imageId));
  };

  return (
    <div className="flex gap-3 h-105">
      {/* Thumbnails column */}
      <div className="flex flex-col gap-3 w-40 shrink-0">
        {thumbnails.map((img, idx) => (
          <div
            key={img._id}
            onClick={() => setActiveIndex(idx)}
            className={`relative flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
              activeIndex === idx
                ? "border-primary shadow-md"
                : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <Image
              src={getImageSource(img)}
              alt={`${carName} ${idx + 1}`}
              fill
              className="object-cover"
              sizes="160px"
              unoptimized={isCloudinaryImage(getImageSource(img))}
              onError={() => markImageFailed(img._id)}
            />
            {idx === 2 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <span className="text-white text-lg font-bold">
                  +{extraCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 rounded-3xl overflow-hidden">
        <Image
          src={getImageSource(mainImage)}
          alt={carName}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
          unoptimized={isCloudinaryImage(getImageSource(mainImage))}
          onError={() => markImageFailed(mainImage?._id)}
        />
        {isAvailable && (
          <span className="absolute top-4 inset-s-4 flex items-center gap-1.5 bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-full shadow">
            <span className="size-1.5 rounded-full bg-white inline-block" />
            {t("available")}
          </span>
        )}
      </div>
    </div>
  );
}
