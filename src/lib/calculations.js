import { ACTIVITY_MULTIPLIERS, BMI_CATEGORIES } from './constants';

export function calculateWaterGoal(weight, activityLevel = 'moderate') {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(weight * 33 * multiplier);
}

export function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi) {
  return BMI_CATEGORIES.find((c) => bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

export function calculateWaterByAge(weight, age, activityLevel = 'moderate') {
  let base = weight * 33;
  if (age < 18) base *= 1.1;
  else if (age > 55) base *= 0.9;
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(base * multiplier);
}
