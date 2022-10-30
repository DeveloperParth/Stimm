import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  Anchor,
  ActionIcon,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconBan, IconTrash } from "@tabler/icons";
import {
  banUser,
  deleteCommentAdmin,
  deletePostAdmin,
} from "../../../Services/Services";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

function Reports({ data, setData }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const deleteHandler = async (row, index) => {
    switch (row.model_type) {
      case "Post":
        await deletePostAdmin(row.contentId);
        showNotification({ title: "Post deleted" });
        break;
      case "Comment":
        await deleteCommentAdmin(row.contentId);
        showNotification({ title: "Comment deleted" });
        break;
      case "User":
        await banUser(row.contentId);
        showNotification({ title: "User banned" });
        break;
      default:
        break;
    }
    setData((bookmarks) => bookmarks.filter((_, i) => i !== index));
  };
  const rows = data.map((row, index) => (
    <tr key={row._id}>
      <td>
        <Anchor
          component={Link}
          to={`/${row.model_type.charAt(0).toLowerCase()}/${row.contentId}`}
        >
          {row.contentId}
        </Anchor>
      </td>
      <td>{row.model_type}</td>
      <td>
        <Anchor component={Link} to={`/u/${row.reportedBy.username}/posts`}>
          {row.reportedBy.username}
        </Anchor>
      </td>
      <td>
        <ActionIcon color="red" onClick={() => deleteHandler(row, index)}>
          {row.model_type === "User" ? <IconBan /> : <IconTrash />}
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table sx={{ minWidth: 700 }}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Id</th>
            <th>Type</th>
            <th>Reporter</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
export default Reports;
