import { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey =
    Constants.expoConfig?.extra?.RAPIDAPI_KEY ||
    Constants.manifest2?.extra?.RAPIDAPI_KEY ||
    "";

  console.log("Using API Key:", apiKey);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const options = {
        method: "GET",
        url: `https://jsearch.p.rapidapi.com/${endpoint}`,
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        params: {
          ...query,
          country: "eg",
        },
      };

      const response = await axios.request(options);
      console.log("API Response:", response.data);
      setData(response.data.data);
    } catch (error) {
      setError(error);
      console.error("Fetch Error:", error.response?.data || error.message);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
