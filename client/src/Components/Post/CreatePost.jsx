import { Button, FileButton, Modal, Textarea } from "@mantine/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOwnPost } from "../../Redux/Features/feedSlice";
import { createPost } from "../../Services/Services";

function CreatePost({ opened: opene, setOpened }) {
  const [postBody, setPostBody] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const createPostHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await createPost({ body: postBody, attachments: file });
    dispatch(addOwnPost({ post: response.data.post, author: user }));
    setLoading(false);
    setOpened(false);
  };
  const handleBodyChange = (e) => {
    if (e.target.value.endsWith("#")) {
      // open()
    }
    setPostBody(e.target.value);
  };
  return (
    <>
      <Modal
        opened={opene}
        onClose={() => setOpened(false)}
        title="Whats on your mind"
      >
        <form encType="multipart/form-data" onSubmit={createPostHandler}>
          <Textarea
            placeholder="Type....."
            variant="filled"
            autosize
            maxRows={4}
            value={postBody}
            onChange={handleBodyChange}
          />
          <Button mt={20} type="submit" loading={loading}>
            Post
          </Button>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </form>
      </Modal>
    </>
  );
}

export default CreatePost;
