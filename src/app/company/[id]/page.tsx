"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { Company, Buyer } from "@/types";

const CompanyDetail = () => {
  const { user } = useAuthContext();
  const supabase = createClientComponentClient();
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [interestedBuyers, setInterestedBuyers] = useState<Buyer[]>([]);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const { id } = params;

        if (!id) {
          setError("Company ID is missing.");
          return;
        }
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();

        if (companyError) throw companyError;

        setCompany(companyData);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user.id === companyData.seller_id) {
          setIsSeller(true);

          const { data: buyers, error: buyersError } = await supabase
            .from("interests")
            .select("user_id")
            .eq("company_id", id);
          if (buyersError) throw buyersError;

          setInterestedBuyers(buyers || []);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [params, supabase]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!company) return <p>No company found.</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
      <Image
        src={company.image_url}
        alt={company.name}
        width={600}
        height={400}
        className="rounded-lg mb-4"
      />
      <p className="text-lg mb-4">{company.description}</p>
      <p className="text-xl font-semibold mb-4">Price: ${company.price}</p>
      <p className="text-md text-gray-600 mb-4">Industry: {company.industry}</p>

      <p className="text-md text-gray-600 mb-4">
        Seller: {company.seller_name} ({company.seller_email})
      </p>

      {user && !isSeller && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            await supabase
              .from("interests")
              .insert([{ user_id: user.id, company_id: company.id }]);
            alert("Interest Registered!");
          }}
        >
          Show Interest
        </button>
      )}

      {isSeller && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Interested Buyers:</h2>
          {interestedBuyers.length > 0 ? (
            <ul className="list-disc list-inside">
              {interestedBuyers.map((buyer) => (
                <li key={buyer.user_id}>{buyer.user_id}</li>
              ))}
            </ul>
          ) : (
            <p>No buyers have expressed interest yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
