import { Button, Modal, Textarea } from "@mantine/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOwnPost } from "../../Redux/Features/feedSlice";
import { createPost } from "../../Services/Services";

function CreateComment({ post, opened, setOpened }) {
  const [postBody, setPostBody] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const createPostHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await createPost({ body: postBody });
    dispatch(addOwnPost({ post: response.data.post, author: user }));
    setLoading(false);
    setOpened(false);
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Comment"
      >
        <form onSubmit={createPostHandler}>
          <Textarea
            placeholder="Type....."
            variant="filled"
            autosize
            maxRows={4}
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          />
          <Button mt={20} type="submit" loading={loading}>
            Post
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default CreateComment;
