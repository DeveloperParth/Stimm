import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import {
  removePost,
  setPostBookmark,
  setPostLike,
} from "../../Redux/Features/feedSlice";
import { bookmarkPost, deletePost, likePost } from "../../Services/Services";

import CreateComment from "./../Comment/CreateComment";
import HoverUserCard from "./../Post/HoverUserCard";
import {
  Avatar,
  Image,
  Box,
  Mark,
  Anchor,
  ActionIcon,
  Button,
  UnstyledButton,
  Group,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconBookmark,
  IconHeart,
  IconMessageCircle,
  IconRepeat,
  IconTrash,
} from "@tabler/icons";
import PostButton from "./../Post/PostButton";

function Comment({ comment }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { hovered, ref } = useHover();
  const [createCommentOpened, setCreateCommentOpened] = useState(false);
  const likePostHandler = async () => {};
  const deletePostHandler = async () => {};
  const createCommentHandler = () => {
    setCreateCommentOpened(true);
  };
  const postClickHandler = (e) => {
    if (e.target.tagName === "DIV") {
      navigate(`/p/${comment._id}`, { state: { location } });
    }
  };
  const bookmarkPostHandler = async () => {};
  return (
    <>
      {/* <div className="comment">
        <span>{comment.body}</span>
        <div className="replies" style={{ marginLeft: "1rem" }}>
          {comment.comments &&
            comment.comments.map((c) => <Comment comment={c} key={c._id} />)}
        </div>
      </div> */}
      <Box
        sx={(theme) => ({
          position: "relative",
          margin: "20px auto",
          padding: '1rem'
        })}
      >
        <a href="#comment-1" class="comment-border-link">
          <span class="sr-only">Jump to comment-1</span>
        </a>
        <div className="comment" onClick={postClickHandler}>
          {/* <div className="post__avatar">
            <Avatar
              src={"http://localhost:5000/uploads/" + comment.author.avatar}
              radius="xl"
              size="sm"
              sx={{ zIndex: -1 }}
            />
          </div> */}
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <Avatar
                  src={"http://localhost:5000/uploads/" + comment.author.avatar}
                  radius="xl"
                  size="sm"
                  sx={{ zIndex: -1 }}
                />

                <h3 ref={ref}>
                  {comment.author.name}
                  <Anchor
                    component={Link}
                    to={`/u/${comment.author.username}/posts`}
                  ></Anchor>
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
                </h3>
                <span className="post__headerSpecial" ref={ref}>
                  @{comment.author.username}
                </span>
                <div style={{ float: "right" }}>
                  {comment.isOwner ? (
                    <ActionIcon onClick={deletePostHandler}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  ) : null}
                </div>
              </div>
              <div className="post__headerDescription">
                <p>
                  {comment.body.split(" ").map((w) => {
                    // console.log(w);
                    if (w.startsWith("#")) {
                      return (
                        <Link
                          to={`/explore/?tag=${w.replace("#", "")}`}
                          key={w}
                        >
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
              <ActionIcon>
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
        </div>
      </Box>
    </>
  );
}
export default Comment;
