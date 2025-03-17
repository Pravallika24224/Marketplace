"use client";

import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { getCompanies } from "@/app/actions/getCompanies";
import Image from "next/image";
import { Company } from "@/types";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const companiesData = await getCompanies(
          searchQuery,
          industry,
          minPrice,
          maxPrice
        );
        setCompanies(companiesData);
      } catch (err) {
        setError("Failed to fetch companies. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const debouncedFetch = debounce(fetchCompanies, 300);
    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [searchQuery, industry, minPrice, maxPrice]);

  return (
    <div className="p-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <h2 className="text-3xl font-bold mb-4">Company Listings</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 mr-4"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border rounded px-3 py-2 mr-4"
        >
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="border rounded px-3 py-2 mr-4"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="border rounded px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company: Company) => (
          <div key={company.id} className="border rounded-lg shadow p-4">
            <Image
              src={company?.image_url}
              alt={company.name}
              width={400}
              height={300}
              className="w-full h-80 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-2">{company.name}</h3>
            <p className="text-gray-600">{company.industry}</p>
            <p className="text-green-600 font-bold mt-2">${company.price}</p>
            <a
              href={`/company/${company.id}`}
              className="text-blue-600 hover:underline mt-2 block"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
