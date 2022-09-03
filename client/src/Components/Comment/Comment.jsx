import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import CreateComment from "./CreateComment";
import HoverUserCard from "./../Post/HoverUserCard";
import {
  Avatar,
  Box,
  Mark,
  Anchor,
  ActionIcon,
  Group,
  Text,
  Stack,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconMessageCircle,
  IconTrash,
} from "@tabler/icons";

function Comment({ comment }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hovered, ref } = useHover();
  const [createCommentOpened, setCreateCommentOpened] = useState(false);
  const deletePostHandler = async () => {};
  const createCommentHandler = () => {
    setCreateCommentOpened(true);
  };
  const postClickHandler = (e) => {
    if (e.target.tagName === "DIV") {
      navigate(`/p/${comment._id}`, { state: { location } });
    }
  };
  return (
    <>
      {/* <div className="comment">
        <span>{comment.body}</span>
        <div className="replies" style={{ marginLeft: "1rem" }}>
          {comment.comments &&
            comment.comments.map((c) => <Comment comment={c} key={c._id} />)}
        </div>
      </div> */}
      <CreateComment opened={createCommentOpened} setOpened={setCreateCommentOpened} />
      <Box
        sx={(theme) => ({
          position: "relative",
          margin: "20px auto",
          padding: "1rem",
        })}
      >
        <a href="#comment-1" class="comment-border-link">
          <span class="sr-only">Jump to comment-1</span>
        </a>
        <div className="comment" onClick={postClickHandler}>
          <div className="post__body">
            <div className="post__header">
              <Group>
                <Avatar
                  src={process.env.REACT_APP_UPLOADS_PATH + comment.author.avatar}
                  radius="xl"
                  size="md"
                  sx={{ zIndex: -1 }}
                />
                <Stack spacing="0">
                  <Anchor
                    component={Link}
                    to={`/u/${comment.author.username}/posts`}
                    ref={ref}
                    color="inherit"
                  >
                    @{comment.author.username}
                  </Anchor>
                  <Text size="xs" color="dimmed">
                    3 days ago
                  </Text>
                  {hovered ? (
                    <Box
                      ref={ref}
                      sx={(theme) => ({
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[1],
                        padding: theme.spacing.xl,
                        borderRadius: theme.radius.md,
                        position: "absolute",
                        zIndex: "10000",
                      })}
                    >
                      <HoverUserCard username={comment.author.username} />
                    </Box>
                  ) : null}
                </Stack>

                <div style={{ float: "right" }}>
                  {comment.isOwner ? (
                    <ActionIcon onClick={deletePostHandler}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  ) : null}
                </div>
              </Group>
            </div>

            <div className="post__headerDescription">
              <p>
                {comment.body.split(" ").map((w) => {
                  // console.log(w);
                  if (w.startsWith("#")) {
                    return (
                      <Link to={`/explore/?tag=${w.replace("#", "")}`} key={w}>
                        <Mark> {w} </Mark>
                      </Link>
                    );
                  }
                  if (w.startsWith("@")) {
                    w = w.replace("@", "");
                    return (
                      <Anchor key={w} component={Link} to={`/u/${w}/posts`}>
                        {w}
                      </Anchor>
                    );
                  }
                  return <> {w} </>;
                })}
              </p>
            </div>
            <ActionIcon onClick={createCommentHandler}>
              <IconMessageCircle />
            </ActionIcon>
            <div className="replies" style={{ marginLeft: "1rem" }}>
              {comment.comments &&
                comment.comments.map((c) => (
                  <Comment comment={c} key={c._id} />
                ))}
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
export default Comment;
