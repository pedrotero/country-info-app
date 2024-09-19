"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CountryInfo {
  code: string;
  commonName: string;
  borders: { commonName: string; countryCode: string }[];
  populationCounts: any[] | undefined;
  flag: string;
}

export default function About() {
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("countryCode");
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [populationMax, setPopulationMax] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(countryCode);
        const apiResponse = await axios.get(
          "http://localhost:8080/countryInfoByCode/" + countryCode
        );
        console.log(apiResponse.data);
        setCountryInfo(apiResponse.data);
        const populationCounts = apiResponse.data.populationCounts.map(
          (e: { year: number; value: number }) => e.value
        );
        setPopulationMax(Math.max(...populationCounts));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [countryCode]);
  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-4xl text-center p-2">
        {countryInfo?.commonName ?? ""}
      </h1>
      <div className="w-1/3">
        <img src={countryInfo?.flag ?? ""} />
      </div>
      <div className="flex flex-row p-8 justify-around w-full">
        <div>
          {" "}
          <h2 className="text-2xl font-bold">Borders</h2>
          <ul>
            {countryInfo?.borders.map((e) => (
              <li className="p-4" key={e.countryCode}>
                <Link
                  href={{
                    pathname: "/country",
                    query: { countryCode: e.countryCode },
                  }}
                >
                  {e.commonName}
                </Link>
              </li>
            ))}{" "}
          </ul>
        </div>

        {countryInfo?.populationCounts && (
          <div className="w-1/4">
            <h2>Population history</h2>
            <svg
              viewBox="0 0 300 300"
              className="w-full h-auto border border-gray-30"
            >
              {countryInfo?.populationCounts.flatMap((e, i, arr) => {
                return [
                  <rect
                    key={e.year}
                    x={(i / arr.length) * 300}
                    y={300 - (e.value / populationMax) * 300}
                    width={4}
                    height={(e.value / populationMax) * 300}
                    fill="blue"
                    className="hover:fill-white"
                  >
                    <title>
                      {e.year},{e.value}
                    </title>
                    ,
                  </rect>,
                ];
              })}
            </svg>
            <h3>
              Place your pointer over a datapoint to show the year and
              population count
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
