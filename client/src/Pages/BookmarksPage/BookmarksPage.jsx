import React, { useEffect, useState } from "react";

import { Container, Loader } from "@mantine/core";
import { getBookmarks } from "../../Services/Services";
import BookmarksPost from "./BookmarksPost";

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getBookmarks();
      setBookmarks(data.bookmarks);
    })();
  }, []);
  const mappedBookmarks =
    bookmarks &&
    bookmarks.map((bookmark, i) => (
      <BookmarksPost
        post={{ ...bookmark.post, bookmarkFlag: true }}
        key={bookmark._id}
        index={i}
        setBookmarks={setBookmarks}
      />
    ));
  if (!bookmarks) return <Loader />;
  return (
    <Container size="600px" m="0" p="">
      {bookmarks.length ? mappedBookmarks : "No saved bookmarks"}
    </Container>
  );
}
export default BookmarksPage;
