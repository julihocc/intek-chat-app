// frontend/src/components/ChatRoomViewer.js

import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";
import logger from "loglevel";
import { useDispatch, useSelector } from "react-redux";
// Updated imports for saga-based actions
import { initiateFetchMessages, initiateFetchChatRoom } from "../redux/actions";
import { sendMessage } from '../redux/slices/chatSlice';

import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../gql/mutations/SEND_MESSAGE";

const ChatRoomViewer = () => {
  const { t } = useTranslation();
  const { chatRoomId } = useParams();
  const dispatch = useDispatch();
  const chatRoom = useSelector((state) => state.chat.chatRoom);
  const messages = useSelector((state) => state.chat.messages);
  const currentUser = useSelector((state) => state.user);
  const isLoading = useSelector(
      (state) => state.chat.loading
  );
  const chatRoomError = useSelector((state) => state.chat.error);

  const [messageBody, setMessageBody] = useState("");
  const [file, setFile] = useState(null);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const handleFileChange = (e) => {
    const tempFile = e.target.files[0];
    const maxSize = 2097152; // 2MB
    if (tempFile.size > maxSize) {
      logger.error("File too large");
      return;
    }
    logger.debug("typeof tempFile: ", typeof tempFile);
    setFile(tempFile); // Setting the selected file
  };

  // Async function to handle sending messages
  const handleSendMessage = async (e, senderId, chatRoomId) => {
    e.preventDefault();
    let fileContent = null;

    if (file) {
      // Read file as a Base64 string if there's a file
      logger.debug("file: ", file);
      fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // Executing the sendMessage mutation with necessary variables
    sendMessageMutation({
      variables: {
        senderId: currentUser.id,
        chatRoomId: chatRoomId,
        body: messageBody,
        fileContent: fileContent,
      },
    })
        .then((res) => {
          logger.debug("fileContent: ", fileContent);
          logger.debug("res: ", res);
          dispatch(sendMessage(res.data.sendMessage)); // Dispatching the sendMessage action with the response data
          setMessageBody(""); // Clearing the text field
          setFile(null); // Resetting the file input if any
        })
        .catch((err) => {
          logger.error("err: ", err);
        });
  };

  // Updated useEffect to dispatch new saga-based actions
  useEffect(() => {
    dispatch(initiateFetchMessages(chatRoomId));
    dispatch(initiateFetchChatRoom(chatRoomId));
  }, [chatRoomId, dispatch]);

  // Rendering different UI based on loading status, errors, and login status
  if (!isLoggedIn) return <Typography variant="h4">Please log in to view the chat room</Typography>;
  if (isLoading) return <Loading queryName="Loading" />;
  if (chatRoomError) return <p>Chat Room Error: {JSON.stringify(chatRoomError)}</p>;

  return (
      <Container
          component={Paper}
          sx={{
            height: "90vh",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
      >
        <CssBaseline />
        <Typography variant="h2" sx={{ mb: 2 }}>
          {t("chatRoom")}: {chatRoom ? chatRoom.id : 'Loading...'} {/* Rendering chat room ID or loading message */}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t("messages")}
        </Typography>
        <List>
          {messages &&
              messages.slice(-5).map((message, index) => (
                  <ListItem
                      key={index}
                      sx={{
                        flexDirection:
                            message.senderId === currentUser.id ? "row-reverse" : "row", // Styling based on sender
                      }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={message.body}
                        secondary={message.senderId}
                        sx={{
                          textAlign:
                              message.senderId === currentUser.id ? "right" : "left", // Styling based on sender
                        }}
                    />
                    {message.fileContent && (
                        <img
                            src={`${message.fileContent}`}
                            alt="Uploaded content"
                        />
                    )}
                  </ListItem>
              ))}
        </List>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
              variant="outlined"
              fullWidth
              id="messageBody"
              label="Message"
              name="messageBody"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)} // Handling changes to the message input
          />
          <input
              type="file"
              name="file"
              id="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange} // Handling changes to the file input
          />
          <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => handleSendMessage(e, currentUser.id, chatRoomId)} // Sending message on button click
          >
            {t("send")}
          </Button>
        </Stack>
      </Container>
  );
};

export default ChatRoomViewer;
