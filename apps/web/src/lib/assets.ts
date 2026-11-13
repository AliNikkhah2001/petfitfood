/**
 * Central image registry.
 *
 * Photography is imported from images.data.ts, where it is embedded as a
 * data URI. That keeps the imagery inside the source tree and the built
 * bundle, so it can never 404 or be stripped from a deployment.
 */

import { INGREDIENTS, PHOTOS } from "./images.data";

export const HERO_POSTER = PHOTOS.hero;

export const PLANET_PHOTO = PHOTOS.nature;

export const BRAND_IMAGES = {
  dog: PHOTOS.dog,
  cat: PHOTOS.cat,
  treats: PHOTOS.treats,
  wellbeing: PHOTOS.nature,
  bond: PHOTOS.bond,
};

/** 320px sources shown inside 132px circles (~2.4x density on retina). */
export const INGREDIENT_IMAGES = {
  chicken: INGREDIENTS.chicken,
  beef: INGREDIENTS.beef,
  whitefish: INGREDIENTS.whitefish,
  carrots: INGREDIENTS.carrots,
  spinach: INGREDIENTS.spinach,
  cranberries: INGREDIENTS.cranberries,
  sweetPotato: INGREDIENTS.sweetpotato,
  pumpkin: INGREDIENTS.pumpkin,
  greenBeans: INGREDIENTS.greenbeans,
  brownRice: INGREDIENTS.brownrice,
};
