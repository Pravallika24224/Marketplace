"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuthContext } from "@/context/AuthContext";
import { Company } from "@/types";

export default function ProfilePage() {
  const { user, loading } = useAuthContext();
  const supabase = createClientComponentClient();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!user) return; 

    console.log("User fetched:", user);

    const fetchUserCompanies = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("seller_id", user.id);

      console.log("Fetched companies:", data);
      if (error) console.error("Error fetching companies:", error);
      else setCompanies(data || []);
    };

    fetchUserCompanies();
  }, [user, supabase]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {user ? (
        <>
          <p className="text-lg">👤 Name: {user.user_metadata?.name || "Unknown"}</p>
          <p className="text-lg">📧 Email: {user.email}</p>

          <h2 className="text-xl font-bold mt-6">Your Listings</h2>
          {companies.length > 0 ? (
            <ul className="mt-4">
              {companies.map((company) => (
                <li key={company.id} className="p-4 border rounded-lg mb-2 shadow-md">
                  <h3 className="font-bold">{company.name}</h3>
                  <p>{company.description}</p>
                  <p className="text-sm text-gray-600">Price: ${company.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4">No listings found.</p>
          )}
        </>
      ) : (
        <p className="text-red-500">Please log in to view your profile.</p>
      )}
    </div>
  );
}
