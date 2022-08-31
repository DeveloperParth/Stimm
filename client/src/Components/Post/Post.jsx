import React, { useState, } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import {
  removePost,
  setPostBookmark,
  setPostLike,
} from "../../Redux/Features/feedSlice";
import { bookmarkPost, deletePost, likePost } from "../../Services/Services";

import CreateComment from "./../Comment/CreateComment";
import HoverUserCard from "./HoverUserCard";

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
import PostButton from "./PostButton";

function Post({ post, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { hovered, ref } = useHover();
  const [createCommentOpened, setCreateCommentOpened] = useState(false);

  const likePostHandler = async () => {
    const likeFlag = !post.likeFlag;
    const likes = post.likeFlag ? post.likes - 1 : post.likes + 1;
    await likePost(post._id);
    dispatch(setPostLike({ index, post: { ...post, likeFlag, likes } }));
  };
  const deletePostHandler = async () => {
    await deletePost(post._id);
    dispatch(removePost({ index }));
  };
  const createCommentHandler = () => {
    setCreateCommentOpened(true);
  };
  const postClickHandler = (e) => {
    if (e.target.tagName === "DIV") {
      navigate(`/p/${post._id}`, { state: { location } });
    }
  };
  const bookmarkPostHandler = async () => {
    await bookmarkPost(post._id);
    const bookmarkFlag = !post.bookmarkFlag;
    dispatch(setPostBookmark({ index, post: { ...post, bookmarkFlag } }));
  };
  return (
    <>
      <CreateComment
        post={post}
        opened={createCommentOpened}
        setOpened={setCreateCommentOpened}
      />
      <Box
        sx={(theme) => ({
          borderBottom: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        })}
      >
        <div className="post" onClick={postClickHandler}>
          <div className="post__avatar">
            <Avatar
              src={"http://localhost:5000/uploads/" + post.author.avatar}
              radius="xl"
              sx={{ zIndex: -1 }}
            />
          </div>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <h3 ref={ref}>
                  {post.author.name}
                  <Anchor
                    component={Link}
                    to={`/u/${post.author.username}/posts`}
                  >
                    <span className="post__headerSpecial" ref={ref}>
                      @{post.author.username}
                    </span>
                  </Anchor>
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
                      <HoverUserCard username={post.author.username} />
                    </Box>
                  ) : null}
                </h3>
                <div style={{ float: "right" }}>
                  {post.isOwner ? (
                    <ActionIcon onClick={deletePostHandler}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  ) : null}
                  <ActionIcon onClick={bookmarkPostHandler}>
                    <IconBookmark fill={post.bookmarkFlag ? "white" : "none"} />
                  </ActionIcon>
                </div>
              </div>
              <div className="post__headerDescription">
                <p>
                  {post.body.split(" ").map((w) => {
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
              {post.attachments?.length ? (
                <div className="attachments">
                  {post.attachments.map((a) => (
                    <Image
                      src={"http://localhost:5000/" + a.path}
                      radius="md"
                      withPlaceholder
                      key={a}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <div className="post__footer">
              <PostButton
                color="blue"
                icon={<IconMessageCircle size={20} />}
                text={post.comments}
                onClick={createCommentHandler}
              />

              <PostButton
                color="green"
                icon={<IconRepeat size={20} />}
                text="20"
              />
              <PostButton
                color="pink"
                icon={<IconHeart size={20} />}
                text={post.likes}
                active={post.likeFlag}
                onClick={likePostHandler}
              />
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

export default Post;
