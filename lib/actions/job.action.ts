export const fetchLocation = async () => {
  const response = await fetch(
    "http://ip-api.com/json/?fields=country,countryCode",
  );
  const location = await response.json();
  return location.countryCode;
};

export const fetchCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2",
    );
    const countries = await response.json();
    const sortedCountries = countries.sort((a: Country, b: Country) =>
      a.name.common.localeCompare(b.name.common),
    );
    return sortedCountries;
  } catch (error) {
    console.log(error);
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, location, page } = filters;

  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      query,
    )}&page=${page}&num_pages=2&country=${location}&date_posted=all`,
    {
      headers,
    },
  );

  const result = await response.json();

  return result.data;
};
