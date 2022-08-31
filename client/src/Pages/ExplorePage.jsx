import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Post from "../Components/Post/Post";
import { getPostByTag } from "../Services/Services";

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState(null);
  console.log(searchParams.get('tag'));
  useEffect(() => {
    (async () => {
      const { data } = await getPostByTag(searchParams.get('tag'));
      setPosts(data.posts)
    })();
    // eslint-disable-next-line
  }, []);

  if (!searchParams) return <>No</>;
  return (
    <>{posts && posts.map((p, i) => <Post post={p} key={p._id} index={i} />)}</>
  );
}

export default ExplorePage;
