import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const getHighlightedText = (text, searchQuery) => {
    if (!text || !searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={index} className="bg-yellow-100">{part}</span> : part
    );
  };

  const calculateRelevanceScore = (item, searchQuery) => {
    const query = searchQuery.toLowerCase();
    let score = 0;
    
    // Product specific scoring
    if (item.type === 'product') {
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      const category = item.category.toLowerCase();
      
      if (name === query) score += 10;
      if (name.startsWith(query)) score += 8;
      if (name.includes(query)) score += 6;
      if (category.includes(query)) score += 5;
      if (description.includes(query)) score += 3;
      if (item.averageRating >= 4) score += 2;
      if (item.salesCount > 100) score += 1;
    }
    
    // Artist specific scoring
    if (item.type === 'artist') {
      const name = item.name.toLowerCase();
      const business = (item.businessName || '').toLowerCase();
      const about = item.AboutHimself.toLowerCase();
      
      if (name === query) score += 10;
      if (business === query) score += 9;
      if (name.startsWith(query)) score += 8;
      if (business.startsWith(query)) score += 7;
      if (name.includes(query)) score += 6;
      if (business.includes(query)) score += 5;
      if (about.includes(query)) score += 3;
      if (item.verified) score += 2;
      if (item.rating >= 4) score += 2;
    }
    
    // Event specific scoring
    if (item.type === 'event') {
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      const eventType = item.eventType.toLowerCase();
      const location = item.location.toLowerCase();
      
      if (name === query) score += 10;
      if (name.startsWith(query)) score += 8;
      if (name.includes(query)) score += 6;
      if (eventType.includes(query)) score += 5;
      if (location.includes(query)) score += 4;
      if (description.includes(query)) score += 3;
      
      // Boost score for upcoming events
      const eventDate = new Date(item.dateOfEvent);
      if (eventDate > new Date()) score += 2;
    }
    
    return score;
  };

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/search/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      
      // Score and sort results
      const scoredResults = data
        .map(item => ({
          ...item,
          score: calculateRelevanceScore(item, searchQuery)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setResults(scoredResults);
    } catch (err) {
      setError('Failed to fetch search results');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const renderResultContent = (result) => {
    switch (result.type) {
      case 'product':
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {getHighlightedText(result.name, query)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.category} · ${result.price} 
              {result.averageRating > 0 && ` · ★${result.averageRating.toFixed(1)}`}
            </div>
          </>
        );
      case 'artist':
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {getHighlightedText(result.name, query)}
              {result.verified && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                  Verified
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.businessName} 
              {result.rating > 0 && ` · ★${result.rating.toFixed(1)}`}
            </div>
          </>
        );
      case 'event':
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {getHighlightedText(result.name, query)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.eventType} · {new Date(result.dateOfEvent).toLocaleDateString()} · {result.location}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search products, artists, events..."
          className="w-full pl-12 pr-4 py-2 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      {showDropdown && (query || isLoading) && (
        <div className="absolute mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-[400px] overflow-y-auto z-50">
          {isLoading && (
            <div className="p-4 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && query && (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found
            </div>
          )}

          {!isLoading && !error && results.map((result) => (
            <div
              key={result.type + '-' + (result.productId || result.id || result.eventId)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => {
                // Handle navigation based on type
                const path = result.type === 'product' ? `/products/${result.productId}` :
                           result.type === 'artist' ? `/artists/${result.id}` :
                           `/events/${result.eventId}`;
                console.log(`Navigating to: ${path}`);
                setShowDropdown(false);
              }}
            >
              <div className="flex items-start">
                {result.images && result.images[0] && (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={result.images[0]} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  {renderResultContent(result)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;