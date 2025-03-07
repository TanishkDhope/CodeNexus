import React, { useEffect, useState } from 'react'
import axios from 'axios'



function Excercises() {

    const [problems,setProblems]=useState([])

    useEffect(()=>{
        fetchProblems()
    },[])
    const fetchProblems=async()=>{

        const response = await fetch("https://codeforces.com/api/problemset.problems")
        const data=await response.json()
        console.log(data)
        setProblems(data)
       

    }
   
    
    
  return (
    <>
    <div>Excercises</div>
    <div>
      {problems?.map((problem) => (
        <div key={problem.id}>
          <h2>{problem.title}</h2>
          <p>{problem.statement}</p>
        </div>
      ))}
    </div>
    <button>Scrape</button>

    </>

  )
}

export default Excercises   


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
    