import { Button, Modal, Textarea } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createComment } from "../../Services/Services";

function CreateComment({ post, opened, setOpened, replyTo, setComments }) {
  const [commentBody, setCommentBody] = useState(replyTo ? `@${replyTo} ` : "");
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const createPostHandler = async (e) => {
    e.preventDefault();
    const date = new Date();
    setLoading(true);
    await createComment(post, { body: commentBody });
    setComments &&
      setComments((comments) => [
        ...comments,
        {
          body: commentBody,
          createdAt: date.toISOString(),
          author: { ...user },
        },
      ]);
    setCommentBody("");
    setLoading(false);
    setOpened(false);
  };
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Comment">
        <form onSubmit={createPostHandler}>
          <Textarea
            placeholder="Type....."
            variant="filled"
            autosize
            maxRows={4}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
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
