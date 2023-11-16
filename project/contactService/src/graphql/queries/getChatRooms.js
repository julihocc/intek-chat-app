const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../utils/authentication");
const ChatRoom = require("../../models/ChatRoomModel");
const getChatRooms = async (parent, args, context) => {
	const {token} = context;
	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}
	const user = await getUserFromToken(token);
	if (!user) {
		throw new AuthenticationError("You must be logged in");
	}

	return ChatRoom.find({participantIds: user.id});
};

module.exports = {getChatRooms};
