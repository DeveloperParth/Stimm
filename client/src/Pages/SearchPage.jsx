import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSearch } from "../Services/Services";

function SearchPage() {
  const params = useParams();
  const fetchSearchResults = async () => {
    const { data } = await getSearch(params.query);
  };
  useEffect(() => {}, [params]);
  return <div>SearchPage</div>;
}

export default SearchPage;
