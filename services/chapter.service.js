const HttpException = require("../exceptions/HttpException");
const { ChapterGroupModel } = require("../models/chapter.model");
const {
  ChapterGroupMembershipModel,
} = require("../models/chapterMentorship.model");
const { UserModel } = require("../models/user.model");

const ChapterGroupService = {
  createGroup: async (groupData, userId) => {
    try {
      let newGroup = await ChapterGroupModel.create({
        ...groupData,
        admins: [userId],
        members: [userId], 
        membersCount: 1,
      });

      newGroup = await ChapterGroupModel.findByPk(newGroup.id);

      await ChapterGroupService.addUserInCreatedGroup(newGroup.dataValues.id, userId);

      return newGroup;
    } catch (error) {
     
      throw new HttpException(500, "Unable to create Group");
    }
  },

  addUserInCreatedGroup: async (groupId, userId) => {
    try {
      console.log(groupId,userId)
      let membership = await ChapterGroupMembershipModel.create({
        groupId,
        userId,
        status: "accepted",
      });
      membership = await ChapterGroupMembershipModel.findByPk(membership.id);
      await ChapterGroupService.updateMembersCount(groupId);
     
      return membership;
    } catch (error) {
    
      throw new HttpException(500, "Unable to add user to group");
    }
  },

  editGroup: async (groupId, updatedData, userId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);

      if (!group) {
        throw new HttpException(404, "Group not found");
      }

      if (!group.dataValues.admins.includes(userId)) {
        throw new HttpException(
          403,
          "You are not authorized to edit this group; only group admins can do this"
        );
      }

      const [updatedRowsCount, updatedJobs] = await ChapterGroupModel.update(
        updatedData,
        {
          where: { id: groupId },
          returning: true,
        }
      );

      return [updatedRowsCount, updatedJobs];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update group");
      }
    }
  },

  deleteGroup: async (groupId, userId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);

      if (!group) {
        throw new HttpException(404, "Group not found");
      }

      if (!group.dataValues.admins.includes(userId)) {
        throw new HttpException(
          403,
          "You are not authorized to delete this group; only group admins can do this"
        );
      }

      const deletedRowsCount = await ChapterGroupModel.destroy({
        where: { id: groupId },
      });

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to delete group");
      }
    }
  },

  addUserToGroup: async (groupId, userId) => {
    try {
      let membership = await ChapterGroupMembershipModel.create({
        groupId,
        userId,
        status: "accepted",
      });
      membership = await ChapterGroupMembershipModel.findByPk(membership.id);
      await ChapterGroupService.updateMembersCount(groupId);
      await ChapterGroupService.updateMembers(groupId, userId);
      return membership;
    } catch (error) {
      throw new HttpException(500, "Unable to add user to group");
    }
  },

  approveUserToAdd: async (user_id, groupId) => {
    
    const user=await UserModel.findByPk(user_id);
    if(user){
      const role=user.role;
      if(role!=="admin"){
        throw new HttpException(500, "Sorry You are not admin or You are not authorized");
      }
    }else{
      throw new HttpException("No user Found")
    }
    try {
      
      const members = await ChapterGroupMembershipModel.findAll({
        where: {
          status: "pending",
          groupId:groupId,
        }
        // include: [
        //   {
        //     model: UserModel,
        //     as: 'user',
           
        //   }
        // ],
      });
      console.log(members);
      if (members.length === 0) {
        throw new HttpException("No new mentor requests found");
      }
      
      return members;
    } catch (error) {
      throw new HttpException(
        500,
        `Error fetching pending mentors : ${error.message}`
      );
    }
  },

  acceptUserRequest: async (memberId) => {
    console.log("line no. 165");

    // const user=await UserModel.findByPk(adminId);
    // console.log(user);

    // if(user){
    //   const role=user.role;
    //   if(role!=="admin"){
    //     throw new HttpException("Sorry You are not admin or You are not authorized");
    //   }
    // }else{
    //   throw new HttpException("No user Found")
    // }
    try {

      const member = await ChapterGroupMembershipModel.findByPk(memberId);

      console.log(member);
      if (!member) {
        throw new HttpException("Member not found");
      }

      member.status= "accepted",
    
      console.log(member);

      await member.save();
      // await ChapterGroupService.updateMembersCount(groupId);
      // await ChapterGroupService.updateMembers(groupId, userId);
      return member;
    } catch (error) {
      console.error("Error accepting mentor request:", error);
      throw new Error(`Unable to accept mentor request: ${error.message}`);
    }
  },

  rejectUserRequest: async (memberId,adminId) => {
    const user=await UserModel.findByPk(adminId);
    if(user){
      const role=user.role;
      if(role!=="admin"){
        throw new HttpException("Sorry You are not admin or You are not authorized");
      }
    }else{
      throw new HttpException("No user Found")
    }
    try {
      const member = await ChapterGroupMembershipModel.findByPk(memberId);

      if (!member) {
        throw new HttpException("Mentor not found");
      }

      member.status= "pending",
    

      await member.save();

      console.log(member);
      return member;
    } catch (error) {
      console.error("Error in rejecting mentor request:", error);
      throw new HttpException(
        `Unable to reject mentor request: ${error.message}`
      );
    }
  },


  getGroupById: async (groupId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);
      return group;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Unable to fetch group by ID");
    }
  },

  getAllGroups: async () => {
    try {
      const groups = await ChapterGroupModel.findAll();
      return groups;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Unable to fetch all groups");
    }
  },

  removeUserFromGroupByAdmin: async (groupId, userId, currentUserId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);
      const groupMembership = await ChapterGroupMembershipModel.findOne({
        where: { userId: userId },
      });

      if (!group) {
        throw new HttpException(404, "Group not found");
      }
      if (!groupMembership) {
        throw new HttpException(404, "Group member not found");
      }

      if (!group.dataValues.admins.includes(currentUserId)) {
        throw new HttpException(
          400,
          "You do not have permission to remove a user from the group"
        );
      }

      await ChapterGroupMembershipModel.destroy({
        where: { groupId, userId },
      });
      

      const updatedMembers = group.dataValues.members.filter(
        (memberId) => memberId !== userId
      );

      await group.update({
        members: updatedMembers,
      });
      await ChapterGroupService.updateMembersCount(groupId);
      
    } catch (error) {
      throw new HttpException(500, "Unable to remove user from group");
    }
  },

  leaveGroup: async (groupId, userId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);

      if (!group) {
        throw new HttpException(404, "Group not found");
      }

      if (
        group.dataValues.admins.length === 1 &&
        group.dataValues.admins.includes(userId)
      ) {
        throw new HttpException(
          400,
          "Cannot leave group. You are the only admin."
        );
      }

      await ChapterGroupMembershipModel.destroy({
        where: { groupId, userId },
      });

      const updatedMembers = group.dataValues.members.filter(
        (memberId) => memberId !== userId
      );

      await group.update({
        members: updatedMembers,
      });
      
      await ChapterGroupService.updateMembersCount(groupId);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to leave group");
      }
    }
  },

  makeAdmin: async (groupId, userIdToAdd, currentUserId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);
      const groupMembership = await ChapterGroupMembershipModel.findOne({
        where: { userId: userIdToAdd },
      });

      if (!group) {
        throw new HttpException(404, "Group not found");
      }
      if (!groupMembership) {
        throw new HttpException(404, "Group member not found");
      }

      if (!group.dataValues.admins.includes(currentUserId)) {
        throw new HttpException(
          400,
          "You do not have permission to make someone an admin."
        );
      }

      await group.update({
        admins: [...group.dataValues.admins, userIdToAdd],
      });
      console.log(group.dataValues);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to make admin");
      }
    }
  },

  removeAdmin: async (groupId, userIdToRemove, currentUserId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);
      const groupMembership = await ChapterGroupMembershipModel.findOne({
        where: { userId: userIdToRemove },
      });

      if (!group) {
        throw new HttpException(404, "Group not found");
      }
      if (!groupMembership) {
        throw new HttpException(404, "Group member not found");
      }

      if (!group.dataValues.admins.includes(currentUserId)) {
        throw new HttpException(
          400,
          "You do not have permission to remove an admin."
        );
      }

      const updatedAdmins = group.dataValues.admins.filter(
        (adminId) => adminId !== userIdToRemove
      );

      await group.update({
        admins: updatedAdmins,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to remove admin");
      }
    }
  },

  updateMembersCount: async (groupId) => {
    try {
      const membersCount = await ChapterGroupMembershipModel.count({
        where: { groupId, status: "accepted" },
      });

      await ChapterGroupModel.update(
        { membersCount },
        {
          where: { id: groupId },
        }
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update group");
      }
    }
  },

  updateMembers: async (groupId, userId) => {
    try {
      const group = await ChapterGroupModel.findByPk(groupId);
      const groupMembership = await ChapterGroupMembershipModel.findOne({
        where: { userId: userId },
      });

      if (!group) {
        throw new HttpException(404, "Group not found");
      }
      if (!groupMembership) {
        throw new HttpException(404, "Group member not found");
      }

      if (group.dataValues.members.includes(userId)) {
        throw new HttpException(
          404,
          "Member already exist..."
        );
      }

      await group.update({
        members: [...group.dataValues.members, userId],
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to make admin");
      }
    }
  },
  
  updateLastMessage: async (groupId, messageId) => {
    try {
      const [updateCount] = await ChapterGroupModel.update(
        { lastMessage: messageId },
        { where: { id: groupId }, returning: true }
      );
      return updateCount;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Error updating last message for connection: ${error.message}`
      );
    }
  },

  verifyGroupMessage: async (groupId, userId) => {
    try {
      const group = await ChapterGroupMembershipModel.findOne({
        where: { groupId, userId, status: "accepted" },
      });
      if (!group) {
        throw new HttpException(403, "Not Authorized to view the message");
      }
      return true;
    } catch (error) {
      throw new HttpException(500, "Error verifying group message");
    }
  },
};

module.exports = { ChapterGroupService };
