import { Avatar, Box, Container, Group, Text, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Components/Navigations/Header";
import { getSearch } from "../Services/Services";
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons";

function SearchPage() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const fetchSearchResults = async (query) => {
    const { data } = await getSearch(query);
    setResults(data.results);
  };
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    fetchSearchResults(searchValue);
  };
  useEffect(() => {
    if (location.state?.search) {
      fetchSearchResults(location.state.search);
      setSearchValue(location.state.search);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container size="600px">
      <Header title="Search" showGoBackButton/>
      <Box>
        <form onSubmit={searchSubmitHandler}>
          <TextInput
            icon={<IconSearch size={18} stroke={1.5} />}
            radius="xl"
            size="md"
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            rightSection={
              <ActionIcon
                size={32}
                radius="xl"
                color={theme.primaryColor}
                variant="filled"
                type="submit"
              >
                {theme.dir === "ltr" ? (
                  <IconArrowRight size={18} stroke={1.5} />
                ) : (
                  <IconArrowLeft size={18} stroke={1.5} />
                )}
              </ActionIcon>
            }
            placeholder="Search questions"
            rightSectionWidth={42}
            // {...props}
          />
        </form>
      </Box>
      <Box p="md">
        {results &&
          results.map((result) => (
            <Box
              onClick={() => navigate(`/u/${result.username}/posts`)}
              py="sm"
              sx={(theme) => ({
                cursor: "pointer",
                borderBottom: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
              })}
            >
              <Group>
                <Avatar
                  src={process.env.REACT_APP_UPLOADS_PATH + result.avatar}
                />
                <Text>{result.username}</Text>
              </Group>
            </Box>
          ))}
      </Box>
    </Container>
  );
}

export default SearchPage;
