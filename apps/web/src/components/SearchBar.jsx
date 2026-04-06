import { useState } from "react";
export default function SearchBar({ onSearch, placeholder = "Search modules, skills, topics...", }) {
    const [value, setValue] = useState("");
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            onSearch?.(value);
        }
    };
    return (<div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyUp={handleSearch} placeholder={placeholder} className="input-field pl-10 pr-4"/>
        <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>);
}
