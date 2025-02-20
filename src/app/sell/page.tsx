"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreateCompanyForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [industry, setIndustry] = useState("");
  const [image, setImage] = useState<File | null>(null); // Image state

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = null;
    
    if (image) {
      const { data, error } = await supabase.storage
        .from("company-images")
        .upload(`companies/${Date.now()}-${image.name}`, image);

      if (error) {
        console.error("Image upload failed:", error.message);
        return;
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/company-images/${data.path}`;
    }

    const { error } = await supabase
      .from("companies")
      .insert([{ name, description, price, industry, image_url: imageUrl }]);

    if (error) {
      console.error("Error adding company:", error.message);
    } else {
      alert("Company added successfully!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">List a New Company</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Company Name"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        className="border p-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <select
        className="border p-2 w-full"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      >
        <option value="">Select Industry</option>
        <option value="Tech">Tech</option>
        <option value="Finance">Finance</option>
        <option value="Retail">Retail</option>
      </select>

      <input type="file" onChange={handleImageChange} className="border p-2 w-full" />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Listing
      </button>
    </form>
    </div>
  );
}
