import BowlScroll from "./components/BowlScroll";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PetFitOrbitBowls from "./components/PetFitOrbitBowls";
import {
  Brands,
  Difference,
  Ingredients,
  Planet,
  Reviews,
  StoreCta,
} from "./components/Sections";

/**
 * Home stack: Arena/yellow post-bowl sections with brand tokens.
 * Scene A = exact BowlScroll · Scene B = PetFitOrbitBowls.
 */
export default function App() {
  return (
    <div id="top" dir="rtl" lang="fa-IR" className="petfit-site min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-brand-indigo focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        رفتن به محتوای اصلی
      </a>
      <Header />
      <main
        id="main-content"
        style={{ paddingTop: "var(--petfit-header-height, 108px)" }}
      >
        <Hero />
        <BowlScroll />
        <PetFitOrbitBowls />
        <Ingredients />
        <Brands />
        <Difference />
        <Planet />
        <Reviews />
        <StoreCta />
      </main>
      <Footer />
    </div>
  );
}
