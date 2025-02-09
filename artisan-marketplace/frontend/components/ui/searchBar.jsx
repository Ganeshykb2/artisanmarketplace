import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';

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
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <span key={index} className="bg-yellow-100">{part}</span>
        : part
    );
  };

  // ✅ Wrapped calculateRelevanceScore inside useCallback
  const calculateRelevanceScore = useCallback((item, searchQuery) => {
    if (!item || !searchQuery) return 0;

    const query = searchQuery.toLowerCase();
    let score = 0;

    if (item.type === 'product') {
      const name = (item.name || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      const category = (item.category || '').toLowerCase();

      if (name === query) score += 10;
      if (name.startsWith(query)) score += 8;
      if (name.includes(query)) score += 6;
      if (category.includes(query)) score += 5;
      if (description.includes(query)) score += 3;
      if (item.averageRating >= 4) score += 2;
      if (item.salesCount > 100) score += 1;
    }

    if (item.type === 'artist') {
      const name = (item.name || '').toLowerCase();
      const business = (item.businessName || '').toLowerCase();
      const about = (item.AboutHimself || '').toLowerCase();

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

    if (item.type === 'event') {
      const name = (item.name || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      const eventType = (item.eventType || '').toLowerCase();
      const location = (item.location || '').toLowerCase();

      if (name === query) score += 10;
      if (name.startsWith(query)) score += 8;
      if (name.includes(query)) score += 6;
      if (eventType.includes(query)) score += 5;
      if (location.includes(query)) score += 4;
      if (description.includes(query)) score += 3;

      if (item.dateOfEvent) {
        const eventDate = new Date(item.dateOfEvent);
        if (eventDate > new Date()) score += 2;
      }
    }

    return score;
  }, []); // No external dependencies needed

  const fetchSearchResults = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/search/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();

      const scoredResults = data
        .filter(item => item && item.type)
        .map(item => ({
          ...item,
          score: calculateRelevanceScore(item, searchQuery)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setResults(scoredResults);
    } catch (err) {
      setError('Failed to fetch search results');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [calculateRelevanceScore]); // ✅ Dependency is stable now

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, fetchSearchResults]);

  const getItemImage = (result) => {
    if (!result) return null;
    switch (result.type) {
      case 'artist': return result.profileImage || null;
      case 'product':
      case 'event': return result.images?.[0] || null;
      default: return null;
    }
  };

  const renderResultContent = (result) => {
    if (!result) return null;

    switch (result.type) {
      case 'product':
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {getHighlightedText(result.name || '', query)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.category || 'Uncategorized'} · ${result.price || '0'} 
              {result.averageRating > 0 && ` · ★${result.averageRating.toFixed(1)}`}
            </div>
          </>
        );
      case 'artist':
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {getHighlightedText(result.name || '', query)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.businessName || ''} 
              {result.rating > 0 && ` · ★${result.rating.toFixed(1)}`}
            </div>
          </>
        );
      case 'event':
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {getHighlightedText(result.name || '', query)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.eventType || 'Event'} · {result.dateOfEvent ? new Date(result.dateOfEvent).toLocaleDateString() : 'TBD'} · {result.location || 'Location TBD'}
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
                const path = result.type === 'product' ? `/exploreproducts/${result.name}` :
                             result.type === 'artist' ? `/artisans/${result.name}` :
                             `/events/${result.name}`;
                window.location.href = path;
                setShowDropdown(false);
              }}
            >
              <div className="flex items-start">
                {getItemImage(result) && (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <Image
                      src={getItemImage(result)} 
                      alt=""
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
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
