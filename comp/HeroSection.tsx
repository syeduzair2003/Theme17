import React from "react";
import HeroSectionClient from "./HeroSectionClient";
import { apiGetCompanySliders } from "@/apis/page_optimization";
import { apiGetAllKeywords } from "@/apis/user";

interface HeroSectionProps {
  keywords?: string[];
  mer_slug: string;
  cat_slug: string;
  companyId: string;
}

export default async function HeroSection({
  keywords,
  mer_slug,
  cat_slug,
  companyId,
}: HeroSectionProps) {
  const defaultSlides = [
    {
      title: "Santorini Villa",
      desc: "Luxury villa overlooking the Aegean Sea, offering breathtaking sunset views and a private infinity pool.",
      img: "https://images.unsplash.com/photo-1599916382059-2968a101a410?auto=format&fit=crop&w=800&q=80",
      rating: "4.8",
      stay: "5 Night Stay",
      link: "/all-stores/A",
    },
    {
      title: "Alpine Retreat",
      desc: "Serene mountain retreat with floor-to-ceiling windows and private spa access for ultimate relaxation.",
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      rating: "4.9",
      stay: "3 Night Stay",
      link: "/all-stores/A",
    },
    {
      title: "Burj Al Arab",
      desc: "Iconic 7-star experience with private butler service and underwater dining experiences.",
      img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      rating: "5.0",
      stay: "2 Night Stay",
      link: "/all-stores/A",
    },
  ];

  let slides = defaultSlides;
  let dynamicKeywords = keywords || [];

  try {
    const response = await apiGetCompanySliders(companyId);
    const companySliders = response?.data || [];

    if (Array.isArray(companySliders) && companySliders.length > 0) {
      slides = companySliders.map((item: any, index: number) => {
        const imgPath = item.slider_image || "";

        const formattedImg =
          imgPath.startsWith("http") || imgPath.startsWith("/")
            ? imgPath
            : `/${imgPath}`;

        return {
          title:
            item.slider_title ||
            item.title ||
            defaultSlides[index % defaultSlides.length].title,
          desc:
            item.slider_description ||
            item.description ||
            defaultSlides[index % defaultSlides.length].desc,
          img: formattedImg,
          rating: item.rating || "4.9",
          stay: item.stay_duration || "Special Offer",
          link: item.button_link || "/all-stores/A",
        };
      });
    }

    const keywordsResponse = await apiGetAllKeywords(companyId);
    if (keywordsResponse?.data && Array.isArray(keywordsResponse.data)) {
      dynamicKeywords = keywordsResponse.data;
    }
  } catch (error) {
    console.error("Error fetching company data in HeroSection:", error);
  }

  return (
    <HeroSectionClient
      keywords={dynamicKeywords}
      mer_slug={mer_slug}
      cat_slug={cat_slug}
      slides={slides}
    />
  );
}
