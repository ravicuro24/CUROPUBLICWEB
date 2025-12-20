export const getBmiDetails = (bmi) => {
  if (bmi < 16) {
    return {
      risk: "Very high risk",
      summary: "You are severely underweight.",
      recommendation:
        "Your BMI indicates severe thinness. This may be associated with serious health risks such as weakened immunity, nutrient deficiencies, and fatigue. Immediate medical consultation is strongly recommended."
    };
  }

  if (bmi >= 16 && bmi < 17) {
    return {
      risk: "High risk",
      summary: "You are moderately underweight.",
      recommendation:
        "Your BMI falls in the moderate thinness range. A nutritious diet and medical guidance can help you reach a healthier weight."
    };
  }

  if (bmi >= 17 && bmi < 18.5) {
    return {
      risk: "Medium risk",
      summary: "You are slightly underweight.",
      recommendation:
        "Your BMI is below the normal range. Consider a balanced diet with adequate calories and consult a healthcare professional if needed."
    };
  }

  if (bmi >= 18.5 && bmi < 25) {
    return {
      risk: "Low risk",
      summary: "This weight is normal and you are healthy.",
      recommendation:
        "A BMI between 18.5 and 24.9 is considered normal. Maintain your health with a balanced diet, regular physical activity, and adequate sleep."
    };
  }

  if (bmi >= 25 && bmi < 30) {
    return {
      risk: "Enhanced risk",
      summary: "You are overweight.",
      recommendation:
        "Being overweight increases the risk of heart disease and diabetes. Regular exercise and healthy eating habits are recommended."
    };
  }

  if (bmi >= 30 && bmi < 35) {
    return {
      risk: "High risk",
      summary: "You are obese (Class I).",
      recommendation:
        "Obesity increases the risk of chronic diseases. Weight management through diet, exercise, and medical advice is strongly recommended."
    };
  }

  if (bmi >= 35 && bmi < 40) {
    return {
      risk: "Very high risk",
      summary: "You are obese (Class II).",
      recommendation:
        "This BMI level significantly increases health risks. Professional medical support is advised to manage weight safely."
    };
  }

  return {
    risk: "Extremely high risk",
    summary: "You are obese (Class III).",
    recommendation:
      "Severe obesity carries critical health risks. Immediate medical supervision and lifestyle intervention are essential."
  };
};
