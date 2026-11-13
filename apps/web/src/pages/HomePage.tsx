import BowlScroll from "../components/BowlScroll";
import Hero from "../components/Hero";
import InstagramGallery from "../components/InstagramGallery";
import PetFitOrbitBowls from "../components/PetFitOrbitBowls";
import {
  Brands,
  Difference,
  Ingredients,
  Planet,
  Reviews,
  StoreCta,
} from "../components/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BowlScroll />
      <PetFitOrbitBowls />
      <Ingredients />
      <Brands />
      <InstagramGallery />
      <Difference />
      <Planet />
      <Reviews />
      <StoreCta />
    </>
  );
}
