"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await axios.get(
          "http://localhost:8080/availableCountries"
        );

        setCountryList(apiResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Country List</h1>
      <ul>
        {countryList &&
          countryList.map((e: { countryCode: string; name: string }) => (
            <li className="p-4" key={e.countryCode}>
              <Link
                href={{
                  pathname: "/country",
                  query: { countryCode: e.countryCode },
                }}
              >
                {e.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
