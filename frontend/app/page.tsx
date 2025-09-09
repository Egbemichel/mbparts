import NavbarHome from "@/components/NavbarHome";
import React from "react";
import {HeroBanner} from "@/components/HeroBanner";
import {DualCardsBanner} from "@/components/DualCard";
import CarPartCarrousel from "@/components/CarPartCarrousel";
import LatestProductWrapper from "@/components/LatestProductWrapper";
import PopularMakes from "@/components/PopularMakes";
import SpecialOffer from "@/components/SpecialOffer";
import TopPicks from "@/components/TopPicks";
import SimpleBanner from "@/components/SimpleBanner";
import MissionBanner from "@/components/MissionBanner";
import BrandSection from "@/components/BrandsSection";
import ArticleSection from "@/components/ArticleSection";
import Services from "@/components/Services";
import PaymentCarousel from "@/components/PaymentCarrousel";



export default function Home() {
  return (
    <div>
      <NavbarHome />
      <HeroBanner />
      <DualCardsBanner />
      <CarPartCarrousel />
      <LatestProductWrapper />
      <PopularMakes />
      <SpecialOffer />
      <TopPicks />
      <SimpleBanner />
      <MissionBanner />
      <BrandSection />
      <ArticleSection />
      <Services />
      <PaymentCarousel />
    </div>
  );
}
