import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useStyles from "../../styles";
import { IconSearch } from "@tabler/icons";
import {
  Anchor,
  Aside,
  Avatar,
  Box,
  Group,
  Progress,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getSearch } from "../../Services/Services";

function SideBar() {
  const { classes } = useStyles();
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState(null);
  const [opened, { close, open }] = useDisclosure(false);
  const fetchSearchResults = async () => {
    const { data } = await getSearch(searchValue);
    setResults(data.results);
    open();
  };
  const searchHandler = (e) => {
    e.preventDefault()
  };
  useEffect(() => {
    if (searchValue.length > 2) {
      fetchSearchResults();
    } else {
      close();
      setResults(null);
    }
    // eslint-disable-next-line
  }, [searchValue]);
  return (
    <>
      <div className={`side-nav bar ${classes.sidebar} ${classes.bar}`}>
        <div className="header-container">
          <Aside withBorder px="xs">
            <div className="search">
              <form onSubmit={searchHandler} autoComplete="off">
                <TextInput
                  icon={<IconSearch />}
                  placeholder="Search..."
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                />
                <Box
                  sx={(theme) => ({
                    position: "absolute",
                    width: "100%",
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[1],
                    borderRadius: theme.radius.md,
                    minHeight: "100px",
                    display: opened ? "block" : "none",
                  })}
                >
                  {!results && <Progress size="xs" value={100} animate p />}
                  {!results?.length && (
                    <Text p="xs" align="center">
                      Nothing was found
                    </Text>
                  )}
                  {results &&
                    results.map((result) => {
                      return (
                        <Group p="md" key={result._id} onClick={()=>navigate(`/u/${result.username}/posts`)}>
                          <Avatar />
                          <Stack spacing={0}>
                            <Text>{result.name}</Text>
                            <Text color="dimmed">{result.username}</Text>
                          </Stack>
                        </Group>
                      );
                    })}
                </Box>
              </form>
            </div>
            <div className="policies">
              <Anchor component={Link} to="#">
                Terms Of Service
              </Anchor>
              <Anchor component={Link} to="#">
                Privacy Policy
              </Anchor>
              <Anchor component={Link} to="#">
                Help Center
              </Anchor>
            </div>
          </Aside>
        </div>
      </div>
    </>
  );
}

export default SideBar;
