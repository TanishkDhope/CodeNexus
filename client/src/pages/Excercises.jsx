import React, { useEffect, useState } from "react";


function Exercises() {
  const [allProblems, setAllProblems] = useState([]);
  const [displayedProblems, setDisplayedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading , isLoading]=useState(false)
  const problemsPerPage = 20;

  useEffect(() => {
    isLoading(true)
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
 
    try {
      const response = await fetch("https://codeforces.com/api/problemset.problems");
      const data = await response.json();

      if (data.status === "OK") {
        setAllProblems(data.result.problems);
      }

    } catch (error) {
      console.error("Error fetching problems:", error);
    }
   isLoading(false)
  };

  // Filter and paginate problems
  useEffect(() => {
    let filtered = allProblems;

    if (searchQuery) {
      filtered = filtered.filter((problem) =>
        problem.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((problem) => problem.tags.includes(selectedTag));
    }

    const startIndex = (currentPage - 1) * problemsPerPage;
    const endIndex = startIndex + problemsPerPage;

    setDisplayedProblems(filtered.slice(startIndex, endIndex));
  }, [searchQuery, selectedTag, allProblems, currentPage]);

  // Get unique tags
  const uniqueTags = [...new Set(allProblems.flatMap((problem) => problem.tags))];

  // Calculate total pages
  const totalPages = Math.ceil(allProblems.length / problemsPerPage);

  // Generate pagination buttons (only 10 at a time)
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 10;
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxButtons / 2), totalPages - maxButtons + 1));

    for (let i = startPage; i < startPage + maxButtons && i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded ${
            currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {startPage > 1 && <button className="px-3 py-1 border rounded" onClick={() => setCurrentPage(1)}>1</button>}
        {startPage > 2 && <span className="px-3 py-1">...</span>}
        {buttons}
        {startPage + maxButtons - 1 < totalPages - 1 && <span className="px-3 py-1">...</span>}
        {startPage + maxButtons - 1 < totalPages && (
          <button className="px-3 py-1 border rounded" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
        )}
      </>
    );
  };

  return (
    <div className="mt-20 p-5">
      <h1 className="text-2xl font-bold mb-4">Exercises</h1>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by problem name..."
          className="p-2 border rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
{loading?(<>
{/* Loading Problem Cards */}
<div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4 border rounded shadow my-2 bg-gray-800 animate-pulse">
            <div className="h-5 w-3/4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-8 w-8 bg-gray-700 animate-pulse rounded"></div>
        ))}
      </div>
</>):(<>
 {/* Problems List */}
 <div>
        {displayedProblems.map((problem) => (
          <div key={`${problem.contestId}-${problem.index}`} className="p-4 border rounded shadow my-2">
            <h2 className="text-lg font-bold">{problem.name}</h2>
            <p>Tags: {problem.tags.join(", ") || "None"}</p>
            <a
              href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Solve on Codeforces
            </a>
          </div>
        ))}
      </div>
      </>)}
     

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">{getPaginationButtons()}</div>
    </div>
  );
}

export default Exercises;





 // const handleClick = async () => {
    //   try {
    //     const response = await fetch("http://localhost:8000/scraper", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ url: "https://codeforces.com/contest/1700/problem/A" }),
    //     });
    
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    
    //     const data = await response.json(); // Parse JSON response
    //     console.log("Response Data:", data);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    