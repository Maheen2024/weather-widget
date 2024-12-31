
"use client";
import { useState, ChangeEvent, FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
import { api } from "@/next-env";
interface WeatherData {
    temperature: number;
    discription: string;
    location: string;
    unit: string;
}
export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlesearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedLocation = location.trim();
        if (trimmedLocation === "") {
            setError("Please enter a valid location");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=7e502ba497284c68a17101024240409&q=${trimmedLocation}`

            );
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            const weatherData: WeatherData = {
                temperature: data.current.temp_c,
                discription: data.current.condition.text,
                location: data.location.name,
                unit: "C"
            };
            setWeather(weatherData);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("City not found. Please try again");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };
    function getTemperatureMassage(temperature: number, unit: string): string {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle up!`;
            } else if (temperature < 10) {
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
            } else if (temperature < 20) {
                return `The temperature is ${temperature}°C.Comfortable for a light jacket.`;
            } else if (temperature < 30) {
                return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
            } else {
                return `It's hot at ${temperature}°C. Stay hydrated!`;
            }
        } else {
            return `${temperature}°${unit}`;
        }
    }
    function getWeatherMassage (discription:string):string {
        switch(discription.toLowerCase()) {
            case "sunny":
                return "It's a beautiful day! Enjoy the sunshine!";
                case "Partly cloudy":
                    return "Expect some clouds and sunshine.";
                    case "Cloudy":
                        return "It's a bit cloudy today.";
                        case " rain":
                            return "It's raining today. Bring an umbrella!";
                            case "snow":
                                return "Bundle up! It's snowing";
                                case "overcast":
                                    return "It's a bit gloomy today.";
                                    case 'mist':
                                        return "It's misty outside";
                                        case 'fog':
                                            return "It's foggy outside";
                                            default:
                                                return discription
          }
    }
    function getLocationMassage (location:string):string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 ||currentHour < 6;
        return `${location} ${isNight ? "at Night" :"Durind the Day"}`;

    }
    return(
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>
                        search for the current weather conditions in your city.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handlesearch} className="flex items-center gap-2">
                <input
                type="text"
                placeholder="Enter a city name"
                value={location}
                onChange={
                    (e: ChangeEvent<HTMLInputElement>) =>
                        setLocation(e.target.value)
                }
                />
                <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..."  : "Search" }{""}
                </Button>
                </form>
                {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMassage(weather.temperature, weather.unit)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{getWeatherMassage(weather.discription)}</div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 " />
                <div>{getLocationMassage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
