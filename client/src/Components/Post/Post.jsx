import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import {
  removePost,
  setPostBookmark,
  setPostLike,
} from "../../Redux/Features/feedSlice";
import {
  bookmarkPost,
  deletePost,
  likePost,
  reportPost,
  sortDate,
} from "../../Services/Services";

import CreateComment from "./../Comment/CreateComment";
import HoverUserCard from "./HoverUserCard";

import {
  Avatar,
  Image,
  Box,
  Anchor,
  ActionIcon,
  Text,
  Group,
  Menu,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconBookmark,
  IconBookmarkOff,
  IconDots,
  IconFlag,
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconTrash,
} from "@tabler/icons";
import PostButton from "./PostButton";
import { showNotification } from "@mantine/notifications";

function Post({ post, index, lastPostRef }) {
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
    navigate(`/p/${post._id}`, { state: { location } });
  };
  const bookmarkPostHandler = async () => {
    await bookmarkPost(post._id);
    const bookmarkFlag = !post.bookmarkFlag;
    showNotification({
      title: post.bookmarkFlag ? "Bookmark removed" : "Post bookmarked",
    });
    dispatch(setPostBookmark({ index, post: { ...post, bookmarkFlag } }));
  };
  const reportPostHandler = async () => {
    await reportPost(post._id);
    showNotification({ title: "Post has been reported" });
  };
  return (
    <>
      <CreateComment
        post={post._id}
        opened={createCommentOpened}
        setOpened={setCreateCommentOpened}
      />
      <Box
        ref={lastPostRef}
        sx={(theme) => ({
          borderBottom: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        })}
      >
        <div className="post">
          <Anchor onClick={postClickHandler} className="redirect"></Anchor>
          <div className="post__avatar">
            <Avatar
              src={process.env.REACT_APP_UPLOADS_PATH + post.author.avatar}
              radius="xl"
              sx={{ zIndex: -1 }}
            />
          </div>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <Group spacing="xs" align="baseline">
                  <Group spacing={3} ref={ref}>
                    <Text weight={500} style={{ cursor: "pointer" }}>
                      {post.author.name}
                    </Text>
                    <Anchor
                      component={Link}
                      to={`/u/${post.author.username}/posts`}
                    >
                      <span className="post__headerSpecial">
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
                          top: "2rem",
                          zIndex: "10000",
                        })}
                      >
                        <HoverUserCard username={post.author.username} />
                      </Box>
                    ) : null}
                  </Group>
                  &bull;
                  <Text color="dimmed" size="xs">
                    {sortDate(Date.parse(post.createdAt))}
                  </Text>
                </Group>
                <div style={{ float: "right" }}>
                  <Menu width={200}>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      {post.bookmarkFlag ? (
                        <Menu.Item
                          onClick={bookmarkPostHandler}
                          icon={<IconBookmarkOff size={20} />}
                        >
                          Remove Bookmark
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          onClick={bookmarkPostHandler}
                          icon={<IconBookmark size={20} />}
                        >
                          Bookmark
                        </Menu.Item>
                      )}

                      <Menu.Item
                        onClick={reportPostHandler}
                        icon={<IconFlag size={20} />}
                      >
                        Report post
                      </Menu.Item>
                      {post.isOwner ? (
                        <Menu.Item
                          icon={<IconTrash size={18} />}
                          color="red"
                          onClick={deletePostHandler}
                        >
                          Delete post
                        </Menu.Item>
                      ) : null}
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </div>
            </div>
            <div className="post__content">
              <div className="post__headerDescription">
                <p style={{ wordWrap: "break-word" }}>
                  {post.body.split(" ").map((w) => {
                    // console.log(w);
                    if (w.startsWith("#")) {
                      return (
                        <Anchor
                          component={Link}
                          to={`/explore/?tag=${w.replace("#", "")}`}
                          key={w}
                        >
                          <> {w} </>
                        </Anchor>
                      );
                    }
                    if (w.startsWith("@")) {
                      w = w.replace("@", "");
                      return (
                        <Anchor
                          key={w}
                          component={Link}
                          to={`/u/${w}/posts`}
                          underline
                        >
                          {w}
                        </Anchor>
                      );
                    }
                    return <> {w} </>;
                  })}
                </p>
              </div>
              {post.attachments?.length ? (
                <Box
                  sx={{
                    overflow: "hidden",
                    borderRadius: ".5rem",
                    display: "flex",
                    gap: "2px",
                  }}
                >
                  {post.attachments.map((a) => (
                    <Image
                      src={
                        process.env.REACT_APP_UPLOADS_PATH +
                        a.path.replace("uploads", "")
                      }
                      radius="0"
                      withPlaceholder
                      key={a}
                    />
                  ))}
                </Box>
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
                icon={<IconShare size={20} />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.hostname}:${window.location.port}/p/${post._id}`
                  );
                  return showNotification({ title: "Copied to clipboard" });
                }}
                // text="20"
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
