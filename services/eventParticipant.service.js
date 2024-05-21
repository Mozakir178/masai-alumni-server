const HttpException = require("../exceptions/HttpException");
const {EventParticipantModel} = require("../models/eventParticipantModel.model");

const EventParticipantService = {
  getEventParticipantById: async (eventParticipantId) => {
    try {
      const eventParticipant = await EventParticipantModel.findByPk(
        eventParticipantId
      );
      return eventParticipant;
    } catch (error) {
      throw new HttpException(500, "Error fetching event participant");
    }
  },

  getEventParticipantByEventId: async (eventId) => {
    try {
      const eventParticipants = await EventParticipantModel.findAll({
        where: { event_id: eventId },
      });
      return eventParticipants;
    } catch (error) {
      throw new HttpException(500, "Error fetching event participant");
    }
  },

  getAllEventParticipants: async () => {
    try {
      const eventParticipants = await EventParticipantModel.findAll();
      return eventParticipants;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch event participants");
    }
  },

    createEventParticipant: async (eventParticipantData) => {
      console.log('hello',eventParticipantData)
    try {
      let newEventParticipant = await EventParticipantModel.create(
        eventParticipantData
      );
      newEventParticipant = await EventParticipantModel.findByPk(
        newEventParticipant.id
      );
      return newEventParticipant;
    } catch (error) {
      throw new HttpException(500, "Unable to create Event Participant");
    }
  },

  deleteEventParticipant: async (eventParticipantId) => {
    try {
      const deletedRowsCount = await EventParticipantModel.destroy({
        where: { id: eventParticipantId },
      });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Unable to delete event participant");
    }
  },
};

module.exports= { EventParticipantService };
