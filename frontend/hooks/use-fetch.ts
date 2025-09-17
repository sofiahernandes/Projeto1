"use client";

import { useEffect, useState } from "react";

export default function useFetch() {
  const [data, setData] = useState<string>("");

  const fetchProtectedData = async () => {
    try {
      const res = await fetch("http://localhost:4000/protected", {
        credentials: "include", // send Clerk session cookies
      });

      if (!res.ok) throw new Error("Unauthorized");

      const json = await res.json();
      setData(JSON.stringify(json));
    } catch (err) {
      console.error(err);
      setData("Error fetching protected data");
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return data;
}