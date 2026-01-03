import Hero from '@/components/home/Hero';
import CountryGrid from '@/components/home/CountryGrid';
import { countriesApi } from '@/lib/api/countries';
import { Country } from '@/lib/types/country';

export const metadata = {
  title: 'Multi-Country Visa Evaluation Tool - Find Your Best Visa Option',
  description:
    'Evaluate your visa eligibility across 6+ countries with AI-powered assessment. Get instant results for Ireland, Poland, Germany, USA, Canada, and Australia.',
};

export default async function Home() {
  // Fetch countries on server
  let countries: Country[] = [];
  
  try {
    const response = await countriesApi.getAll();
    countries = response.data;
  } catch (error) {
    // Failed to fetch countries - continue with empty array
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <CountryGrid countries={countries} />
    </main>
  );
}
