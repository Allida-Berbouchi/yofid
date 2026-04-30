"use client";
import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search architecture, languages, or tools..." 
}) {
  const [value, setValue] = useState("");
  
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      onSearch?.(value);
    }
  };
  
  const handleClick = () => {
    onSearch?.(value);
  };
  
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          onKeyUp={handleSearch} 
          placeholder={placeholder} 
          className="search-input"
        />
        <svg 
          className="search-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          onClick={handleClick}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}