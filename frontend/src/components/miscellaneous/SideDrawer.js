import {
  Avatar,
  Box,
  Button,
  Text,
  Tooltip,
  useToast,
  Input,
  Spinner,
} from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";

import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import NotificationSound from "./NotificationSound";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  // useEffect(() => {
  //   // Fetch notifications from browser storage when component mounts
  //   const storedNotifications =
  //     JSON.parse(localStorage.getItem(`${user.name}notifications`)) || [];
  //   setNotifications(storedNotifications);
  // }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="rgba(0,0,0,0.1)"
        backdropFilter="blur(5px)"
        color="white"
        boxShadow="2px"
        w="100%"
        p="5px 10px 5px 10px"
        // borderWidth="5px"
      >
        <Tooltip
          label="Search users to chat"
          hasArrow
          placement="bottom-end"
          bg="rgba(0,0,0,0.1)"
          backdropFilter="blur(5px)"
          color="white"
        >
          <Button
            bg="rgba(0,0,0,0.1)"
            backdropFilter="blur(5px)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.2)" }}
            variant="ghost"
            onClick={onOpen}
          >
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4" color="white">
              Seach User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="3xl" fontFamily="Work sans">
          ConConnect
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <NotificationSound />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList
              bg="rgba(0,0,0,0.1)"
              backdropFilter="blur(25px)"
              display="flex"
              justifyContent="center"
              flexDirection="column"
              position="absolute"
              right="1rem"
              top="-3.5rem"
            >
              {!notifications.length && (
                <MenuItem bg="rgba(0,0,0,0.1)" backdropFilter="blur(25px)">
                  No New Notifications
                </MenuItem>
              )}
              {notifications.map((notification) => (
                <MenuItem
                  bg="rgba(0,0,0,0.1)"
                  backdropFilter="blur(25px)"
                  key={notification._id}
                  onClick={() => {
                    setSelectedChat(notification.chat);
                    setNotifications(
                      notifications.filter((n) => n !== notification)
                    );
                  }}
                >
                  {notification.chat.isGroupChat
                    ? `New message in ${notification.chat.chatName}`
                    : `New message from ${getSender(
                        user,
                        notification.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList
              bg="rgba(0,0,0,0.1)"
              backdropFilter="blur(25px)"
              display="flex"
              justifyContent="center"
              position="absolute"
              right="1rem"
              top="-3.5rem"
            >
              <ProfileModal user={user}>
                <MenuItem bg="rgba(0,0,0,0.1)" backdropFilter="blur(5px)">
                  Profile
                </MenuItem>
              </ProfileModal>
              <div
                style={{ width: "1px", height: "5px", color: "white" }}
              ></div>
              <MenuItem
                bg="rgba(0,0,0,0.1)"
                backdropFilter="blur(25px)"
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        bg="rgba(0,0,0,0.1)"
        backdropFilter="blur(25px)"
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent bg="rgba(0,0,0,0.1)" backdropFilter="blur(25px)">
          <DrawerHeader color="white" borderBottomWidth="1px">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
