import React, { useState } from "react";
import { Link } from "react-router-dom";

import CreateComment from "./CreateComment";
import {
  Avatar,
  Mark,
  Anchor,
  ActionIcon,
  Group,
  Text,
  createStyles,
  TypographyStylesProvider,
  Paper,
  Button,
} from "@mantine/core";
import { IconMessageCircle, IconTrash } from "@tabler/icons";
import { sortDate, deleteComment } from "../../Services/Services";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

function CommentHtml({ comment, setComments, index }) {
  const { createdAt, body, author } = comment;
  const { classes } = useStyles();
  const [createCommentOpened, setCreateCommentOpened] = useState(false);
  const deleteCommentHandler = async () => {
    await deleteComment(comment._id);
    setComments((comments) => comments.filter((_, i) => i !== index));
    showNotification({ title: "Comment deleted" });
  };
  const createCommentHandler = () => {
    setCreateCommentOpened(true);
  };
  return (
    <>
      <CreateComment
        opened={createCommentOpened}
        setOpened={setCreateCommentOpened}
        post={comment.post}
        replyTo={comment.author?.username}
        setComments={setComments}
      />
      <Paper
        withBorder
        sx={{
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          borderRadius: 0,
        }}
        radius="md"
        className={classes.comment}
      >
        <Group>
          <Avatar
            src={process.env.REACT_APP_UPLOADS_PATH + author.avatar}
            alt={author.name}
            radius="xl"
          />
          <div>
            <Text size="sm">{author.name}</Text>
            <Text size="xs" color="dimmed">
              {sortDate(Date.parse(createdAt))}
            </Text>
          </div>

          {comment.isOwner ? (
            <ActionIcon onClick={deleteCommentHandler} ml="auto">
              <IconTrash size={18} />
            </ActionIcon>
          ) : null}
        </Group>
        <Group align="center" position="apart">
          <TypographyStylesProvider className={classes.body}>
            {body.split(" ").map((w) => {
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
          </TypographyStylesProvider>

          <Button
            onClick={createCommentHandler}
            leftIcon={<IconMessageCircle />}
            compact
          >
            Reply
          </Button>
        </Group>
      </Paper>
    </>
  );
}
export default CommentHtml;
