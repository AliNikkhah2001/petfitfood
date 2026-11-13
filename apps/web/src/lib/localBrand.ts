/** Local brand media — no CDN required at runtime. */

export const LOCAL_BOWL_FRAMES = 90;

export const localBowlFrame = (index: number) =>
  `/frames/bowl/${String(index + 1).padStart(5, "0")}.webp`;

export const ORBIT_BOWLS = [
  {
    id: "chicken",
    label: "مرغ تازه",
    bowl: "/brand/bowls/chicken.jpg",
    ingredients: [
      { src: "/brand/ingredients/chicken.jpg", caption: "مرغ" },
      { src: "/brand/ingredients/carrots.jpg", caption: "هویج" },
      { src: "/brand/ingredients/spinach.jpg", caption: "اسفناج" },
    ],
  },
  {
    id: "turkey",
    label: "بوقلمون",
    bowl: "/brand/bowls/turkey.jpg",
    ingredients: [
      { src: "/brand/ingredients/turkey.jpg", caption: "بوقلمون" },
      { src: "/brand/ingredients/carrots.jpg", caption: "هویج" },
      { src: "/brand/ingredients/spinach.jpg", caption: "اسفناج" },
    ],
  },
  {
    id: "intro",
    label: "پک آشنایی",
    bowl: "/brand/bowls/intro.jpg",
    ingredients: [
      { src: "/brand/ingredients/chicken.jpg", caption: "مرغ" },
      { src: "/brand/ingredients/turkey.jpg", caption: "بوقلمون" },
      { src: "/brand/ingredients/carrots.jpg", caption: "هویج" },
    ],
  },
] as const;
