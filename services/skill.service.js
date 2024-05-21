const { HttpException } = require("../exceptions/HttpException");
const { SkillModel } = require("../models/skill.model");

const skillService = {
  createSkill: async (userId, skillData) => {
    try {
      let newSkill = await SkillModel.create({ ...skillData, user_id: userId });
      newSkill = await SkillModel.findByPk(newSkill.id);
      return newSkill;
    } catch (error) {
      throw new HttpException(500, "Error creating skill record");
    }
  },

  updateSkill: async (userId, skillId, updatedSkillData) => {
    try {
      const skill = await SkillModel.findOne({
        where: { id: skillId, user_id: userId },
      });

      if (skill) {
        skill.set(updatedSkillData);
        await skill.save();
        return skill;
      } else {
        return null;
      }
    } catch (error) {
      throw new HttpException(500, "Error updating skill record");
    }
  },

  deleteSkill: async (userId, skillId) => {
    try {
      const deletedRowsCount = await SkillModel.destroy({
        where: { id: skillId, user_id: userId },
      });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Error deleting skill record");
    }
  },
};

module.exports = { skillService };
