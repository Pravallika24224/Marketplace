import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


export const getCompanies = async (searchQuery = '', industry = '', minPrice = 0, maxPrice = 1000000) => {

  let query = supabase.from('companies').select('*').order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  if (industry) {
    query = query.eq('industry', industry);
  }

  query = query.gte('price', minPrice).lte('price', maxPrice);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  return data;
};
