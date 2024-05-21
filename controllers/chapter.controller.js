const { ChapterGroupService } = require("../services/chapter.service");
const { GroupMessageService } = require("../services/groupMessage.service");
const { HttpException } = require("../exceptions/HttpException");

const ChapterController = {
  createGroup: async (req, res, next) => {
    const groupData = req.body;
    const userId = Number(req.user.id);
    try {
      const newGroup = await ChapterGroupService.createGroup(groupData, userId);
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  },

  addUserToGroup: async (req, res, next) => {
    const groupData = req.body;
    const userId = Number(req.user.id);
    try {
      const newGroup = await ChapterGroupService.addUserToGroup(
        groupData.groupId,
        userId
      );
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  },

  approveUserToAdd: async (req, res, next) => {
    const user_id=Number(req.user.id);
    const groupId=Number(req.params.id);

    try {
      const allUsersRequests = await ChapterGroupService.approveUserToAdd(user_id,groupId);
      res.status(200).json(allUsersRequests);
    } catch (error) {
      console.log("error ", error)
      next(error);
    }
  },

  acceptUserRequest: async (req, res, next) => {
    const memberId = Number(req.params.id);
    // const adminId = Number(req.user.id);
    // const { io } = getSocketServerInstance();
    
    try {
      const newMember = await ChapterGroupService.acceptUserRequest(
        memberId
      );

      if (!newMember) {
        next(
          new HttpException(
            404,
            "No new Member Request Found"
          )
        );
      }
      
      // const user_Id = newMember.user_id;
      // const receiver = await UserModel.findByPk(user_Id);

      // if (!receiver) {
      //   return next(new HttpException(404, "Receiver not found"));
      // }

      // const receiverData = receiver.toJSON();
      // const notification = await NotificationService.createNotification({
      //   receiverId: user_Id,
      //   type: "new-mentorship-application",
      //   status: "delivered",
      //   message: "Congratulations! Your mentor application got accepted",
      //   authorId: adminId,
      // });

      // if (receiverData.socket_id) {
      //   io.to(receiverData.socket_id).emit("new-notification", notification);
      // }

      res.status(200).json({ message: "Member Request accepted successfully", newMember });
    } catch (error) {
      next(error);
    }
  },

  rejectUserRequest: async (req, res, next) => {
    const memberId = Number(req.params.id);
    const adminId = Number(req.user.id);
    // const { io } = getSocketServerInstance();
    
    try {
      const newMember = await ChapterGroupService.rejectUserRequest(
        memberId,
        adminId,
      );

      if (!newMember) {
        next(
          new HttpException(
            404,
            "No new Mentor Application Found"
          )
        );
      }
      
      // const user_Id = newMentor.user_id;
      // const receiver = await UserModel.findByPk(user_Id);

      // if (!receiver) {
      //   return next(new HttpException(404, "Receiver not found"));
      // }

      // const receiverData = receiver.toJSON();
      // const notification = await NotificationService.createNotification({
      //   receiverId: user_Id,
      //   type: "new-mentorship-application",
      //   status: "delivered",
      //   message: "Sorry! Your mentor application got rejected",
      //   authorId: adminId,
      // });

      // if (receiverData.socket_id) {
      //   io.to(receiverData.socket_id).emit("new-notification", notification);
      // }

      res.status(200).json({ message: "Member Request accepted successfully", newMember });
    } catch (error) {
      next(error);
    }
  },

  editGroup: async (req, res, next) => {
    const groupId = Number(req.params.id);
    const groupData = req.body;
    const userId = Number(req.user.id);

    try {
      const [updatedRowsCount, updatedGroups] =
        await ChapterGroupService.editGroup(groupId, groupData, userId);

      if (Number(updatedGroups) === 0) {
        throw new HttpException(404, "Group not found");
      } else {
        res.status(200).json({ message: "Group is updated", updatedGroups });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteGroup: async (req, res, next) => {
    const groupId = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
      const deletedRowsCount = await ChapterGroupService.deleteGroup(
        groupId,
        userId
      );

      if (deletedRowsCount === 0) {
        throw new HttpException(404, "Group not found");
      } else {
        res.status(200).json({ message: "Group deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  },

  getGroupById: async (req, res, next) => {
    const groupId = Number(req.params.id);

    try {
      const group = await ChapterGroupService.getGroupById(groupId);

      if (!group) {
        throw new HttpException(404, "Group not found");
      }

      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  },

  getAllGroups: async (req, res, next) => {
    try {
      const groups = await ChapterGroupService.getAllGroups();
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  },

  removeUserFromGroupByAdmin: async (req, res, next) => {
    const groupId = Number(req.params.id);
    const { userId } = req.body;
    const currentUserId = Number(req.user.id);

    try {
      await ChapterGroupService.removeUserFromGroupByAdmin(
        groupId,
        userId,
        currentUserId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  leaveGroup: async (req, res, next) => {
    const groupId = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
      await ChapterGroupService.leaveGroup(groupId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  makeAdmin: async (req, res, next) => {
    const groupId = Number(req.params.id);
    const { userIdToAdd } = req.body;
    const currentUserId = Number(req.user.id);

    try {
      await ChapterGroupService.makeAdmin(groupId, userIdToAdd, currentUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  removeAdmin: async (req, res, next) => {
    const groupId = Number(req.params.id);
    const { userIdToRemove } = req.body;
    const currentUserId = Number(req.user.id);

    try {
      await ChapterGroupService.removeAdmin(
        groupId,
        userIdToRemove,
        currentUserId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  verifyGroupMessage: async (req, res, next) => {
    const groupId = Number(req.params.groupId);
    const messageId = Number(req.params.messageId);
    const currentOnlineUser = req.user.id;

    try {
      const temp = await ChapterGroupService.verifyGroupMessage(
        groupId,
        currentOnlineUser
      );

      if (temp) {
        const message = await GroupMessageService.getMessageById(messageId);
        res.status(200).json(message);
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { ChapterController };
