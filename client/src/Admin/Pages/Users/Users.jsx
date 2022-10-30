import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  Avatar,
  ActionIcon,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconHammer,
  IconHammerOff,
} from "@tabler/icons";
import { banUser, unbanUser } from "../../../Services/Services";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data) {
  return data.filter((item) => keys(data[0]).some((key) => item));
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    })
  );
}

function Users({ data, setData }) {
  const [search] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };
  const handleBanClick = async (row, i) => {
    openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure you want to {row.banned ? "unban" : "ban"}
          <b> {row.username}</b>? This will {row.banned ? "unban" : "ban"}
          <b> {row.username}</b> from accessing website
        </Text>
      ),
      labels: {
        confirm: `${row.banned ? "Unban" : "Ban"} ${row.username}`,
        cancel: "Cancel",
      },
      onConfirm: () => handleBan(row, i),
    });
  };
  const handleBan = async (row, index) => {
    if (row.banned) {
      await unbanUser(row._id);
    } else {
      await banUser(row._id);
    }
    setData((users) => {
      users[index].banned = !users[index].banned;
      return [...users];
    });
    showNotification({
      title: `${row.username} is ${row.banned ? "banned" : "unbanned"}`,
    });
  };

  const rows = sortedData.map((row, index) => (
    <tr key={row.name}>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.username}</td>
      <td>
        <Avatar
          src={process.env.REACT_APP_UPLOADS_PATH + row.avatar}
          size="lg"
          radius="xl"
        />
      </td>
      <td>{row.verified ? "Yes" : "No"}</td>
      <td>
        {row.banned ? (
          <ActionIcon color="green" onClick={() => handleBanClick(row, index)}>
            <IconHammerOff size={18} />
          </ActionIcon>
        ) : (
          <ActionIcon color="red" onClick={() => handleBanClick(row, index)}>
            <IconHammer size={18} />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === "email"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("email")}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === "username"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("username")}
            >
              Username
            </Th>
            <Th>Avatar</Th>
            <Th>Verified</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
export default Users;
