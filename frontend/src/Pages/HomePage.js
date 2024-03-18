import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="rgba(0,0,0,0.1)"
        backdropFilter="blur(5px)"
        color="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        //borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          ConConnect
        </Text>
      </Box>
      <Box
        bg="rgba(0,0,0,0.1)"
        backdropFilter="blur(5px)"
        color="white"
        w="100%"
        p={4}
        borderRadius="lg"
        //borderWidth="1px"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab color="white">Login</Tab>
            <Tab color="white">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
