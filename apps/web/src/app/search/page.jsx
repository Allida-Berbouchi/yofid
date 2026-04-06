"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CardPreview from "@/components/CardPreview";
import { apiFetch } from "@/lib/api";
export default function Search() {
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        try {
            setSearched(true);
            setLoading(true);
            const data = await apiFetch(`/resources?q=${encodeURIComponent(query)}`);
            setResults(data.items || []);
        }
        catch (err) {
            console.error("Search error:", err);
            setResults([]);
        }
        finally {
            setLoading(false);
        }
    };
    return (<>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Resources</h1>
          <p className="text-gray-600">
            Find learning materials by title, skills, topics, or module
          </p>
        </div>

        <SearchBar onSearch={handleSearch}/>

        {loading && (<div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>)}

        {searched && results.length === 0 && !loading && (<div className="text-center py-20">
            <p className="text-gray-500 text-lg">No results found.</p>
            <p className="text-gray-400">Try different keywords</p>
          </div>)}

        {results.length > 0 && (<div>
            <p className="text-gray-600 text-sm mb-6">
              Found {results.length} resource{results.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((resource) => (<CardPreview key={resource._id} resource={resource}/>))}
            </div>
          </div>)}
      </main>
    </>);
}
