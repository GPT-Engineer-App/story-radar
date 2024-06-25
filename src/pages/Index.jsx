import React, { useState, useEffect } from "react";
import { Box, Container, VStack, Text, Link, Input, Switch, useColorMode, Heading, Flex, Spinner } from "@chakra-ui/react";
import { ExternalLinkIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [searchTerm, stories]);

  const fetchTopStories = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const storyIds = await response.json();
      const top5StoryIds = storyIds.slice(0, 5);
      const storyPromises = top5StoryIds.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const fetchedStories = await Promise.all(storyPromises);
      setStories(fetchedStories);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setIsLoading(false);
    }
  };

  const filterStories = () => {
    const filtered = stories.filter(story =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="xl">Hacker News Top Stories</Heading>
          <Flex alignItems="center">
            <SunIcon mr={2} />
            <Switch
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
              mr={2}
            />
            <MoonIcon />
          </Flex>
        </Flex>
        
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          filteredStories.map((story) => (
            <Box key={story.id} p={4} borderWidth={1} borderRadius="md" shadow="md">
              <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
              <Flex justifyContent="space-between" mt={2}>
                <Text>Upvotes: {story.score}</Text>
                <Link href={story.url} isExternal color="blue.500">
                  Read More <ExternalLinkIcon mx="2px" />
                </Link>
              </Flex>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;