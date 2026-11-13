/** Product-bowl carousel — locked camera frames, protein-edited food colors. */

export const LOCAL_BOWL_FRAMES = 90;

export const localBowlFrame = (index: number) =>
  `/frames/bowl/${String(index + 1).padStart(5, "0")}.webp`;

export const productBowlFrame = (protein: string, index: number) =>
  `/frames/bowl-${protein}/${String(index + 1).padStart(5, "0")}.webp`;

export type ProductIngredient = {
  src: string;
  caption: string;
  x: string;
  y: string;
  size: number;
  rotate: string;
  /** frame index when chip becomes visible (0–89) */
  from: number;
  z: number;
  rate: number;
};

export type ProductBowlShow = {
  id: string;
  label: string;
  accent: string;
  /** edited frame pack folder key under /frames/bowl-{id}/ */
  frameKey: string;
  blurb: string;
  ingredients: ProductIngredient[];
};

export const PRODUCT_BOWL_SHOWS: ProductBowlShow[] = [
  {
    id: "chicken",
    label: "مرغ",
    accent: "#F5A623",
    frameKey: "chicken",
    blurb: "فیله و سینهٔ مرغ تازه + سبزیجات مشترک",
    ingredients: [
      {
        src: "/brand/ingredients/chicken.jpg",
        caption: "مرغ تازه",
        x: "68%",
        y: "19%",
        size: 96,
        rotate: "8deg",
        from: 22,
        z: 140,
        rate: 1.2,
      },
      {
        src: "/brand/ingredients/carrots.jpg",
        caption: "هویج",
        x: "32%",
        y: "23%",
        size: 88,
        rotate: "-7deg",
        from: 28,
        z: 96,
        rate: 0.95,
      },
      {
        src: "/brand/ingredients/pumpkin.jpg",
        caption: "کدو",
        x: "30%",
        y: "78%",
        size: 80,
        rotate: "6deg",
        from: 36,
        z: 64,
        rate: 0.7,
      },
      {
        src: "/brand/ingredients/organs.jpg",
        caption: "دل و جگر",
        x: "70%",
        y: "76%",
        size: 80,
        rotate: "-6deg",
        from: 44,
        z: 110,
        rate: 1.05,
      },
    ],
  },
  {
    id: "beef",
    label: "گوساله",
    accent: "#C45A12",
    frameKey: "beef",
    blurb: "گوشت گوساله + سبزیجات مشترک",
    ingredients: [
      {
        src: "/brand/ingredients/beef.jpg",
        caption: "گوشت گوساله",
        x: "68%",
        y: "19%",
        size: 96,
        rotate: "7deg",
        from: 22,
        z: 140,
        rate: 1.2,
      },
      {
        src: "/brand/ingredients/zucchini.jpg",
        caption: "کدو سبز",
        x: "32%",
        y: "23%",
        size: 86,
        rotate: "-6deg",
        from: 28,
        z: 96,
        rate: 0.95,
      },
      {
        src: "/brand/ingredients/potato.jpg",
        caption: "سیب‌زمینی",
        x: "30%",
        y: "78%",
        size: 80,
        rotate: "5deg",
        from: 36,
        z: 64,
        rate: 0.7,
      },
      {
        src: "/brand/ingredients/organs.jpg",
        caption: "دل و جگر",
        x: "70%",
        y: "76%",
        size: 80,
        rotate: "-5deg",
        from: 44,
        z: 110,
        rate: 1.05,
      },
    ],
  },
  {
    id: "turkey",
    label: "بوقلمون",
    accent: "#5A8F5A",
    frameKey: "turkey",
    blurb: "بوقلمون کم‌چرب + سبزیجات مشترک",
    ingredients: [
      {
        src: "/brand/ingredients/turkey.jpg",
        caption: "بوقلمون",
        x: "68%",
        y: "19%",
        size: 96,
        rotate: "8deg",
        from: 22,
        z: 140,
        rate: 1.2,
      },
      {
        src: "/brand/ingredients/carrots.jpg",
        caption: "هویج",
        x: "32%",
        y: "23%",
        size: 88,
        rotate: "-7deg",
        from: 28,
        z: 96,
        rate: 0.95,
      },
      {
        src: "/brand/ingredients/pumpkin.jpg",
        caption: "کدو",
        x: "30%",
        y: "78%",
        size: 80,
        rotate: "6deg",
        from: 36,
        z: 64,
        rate: 0.7,
      },
      {
        src: "/brand/ingredients/zucchini.jpg",
        caption: "کدو سبز",
        x: "70%",
        y: "76%",
        size: 80,
        rotate: "-6deg",
        from: 44,
        z: 110,
        rate: 1.05,
      },
    ],
  },
  {
    id: "fish",
    label: "ماهی",
    accent: "#3D7EA6",
    frameKey: "fish",
    blurb: "ماهی تازه + سبزیجات مشترک",
    ingredients: [
      {
        src: "/brand/ingredients/fish.jpg",
        caption: "ماهی",
        x: "68%",
        y: "19%",
        size: 96,
        rotate: "7deg",
        from: 22,
        z: 140,
        rate: 1.2,
      },
      {
        src: "/brand/ingredients/carrots.jpg",
        caption: "هویج",
        x: "32%",
        y: "23%",
        size: 88,
        rotate: "-7deg",
        from: 28,
        z: 96,
        rate: 0.95,
      },
      {
        src: "/brand/ingredients/potato.jpg",
        caption: "سیب‌زمینی",
        x: "30%",
        y: "78%",
        size: 80,
        rotate: "6deg",
        from: 36,
        z: 64,
        rate: 0.7,
      },
      {
        src: "/brand/ingredients/pumpkin.jpg",
        caption: "کدو",
        x: "70%",
        y: "76%",
        size: 80,
        rotate: "-6deg",
        from: 44,
        z: 110,
        rate: 1.05,
      },
    ],
  },
];
