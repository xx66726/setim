export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ClothingRecommendation {
  mainOutfit: string;
  accessories: string;
  additionalTips: string;
  styleTip?: string;
}
