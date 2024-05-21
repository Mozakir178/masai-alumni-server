const { HttpException } = require("../exceptions/HttpException");
const { EventModel } = require("../models/event.model");
const { EventParticipantModel } = require("../models/eventParticipantModel.model");
const { UserModel } = require("../models/user.model");
const { Op } = require("sequelize");

const EventService = {
  getEventById: async (eventId) => {
    try {
      const event = await EventModel.findByPk(eventId, {
        include: [
          {
            as: "event_manager",
            model: UserModel,
            attributes: ["id", "name", "email"],
          },
          {
            as: "event_participants",
            model: EventParticipantModel,
            attributes: ["id"],
            include: [
              {
                as: "participant",
                model: UserModel,
                attributes: ["id", "name", "email", "role", "phone_number"],
              },
            ],
          },
        ],
      });
      return event;
    } catch (error) {
      throw new HttpException(500, "Error fetching event");
    }
  },

  getAllEvents: async (filters) => {
    try {
      const eventFilterOptions = {
        where: {},
      };

      if (filters.event_type) {
        eventFilterOptions.where = {
          ...eventFilterOptions.where,
          event_type: { [Op.regexp]: `.*${filters.event_type}.*` },
        };
      }

      if (filters.search) {
        eventFilterOptions.where = {
          ...eventFilterOptions.where,
          event_title: { [Op.regexp]: `.*${filters.search}.*` },
        };
      }

      const events = await EventModel.findAll({
        ...eventFilterOptions,
        include: [
          {
            as: "event_manager",
            model: UserModel,
            attributes: ["id", "name", "email"],
          },
          {
            as: "event_participants",
            model: EventParticipantModel,
            attributes: ["id"],
            include: [
              {
                as: "participant",
                model: UserModel,
                attributes: ["id", "name", "email", "role", "phone_number"],
              },
            ],
          },
        ],
      });

      return events;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch events");
    }
  },

  createEvent: async (eventData) => {
    try {
      const newEvent = await EventModel.create(eventData);
      return newEvent;
    } catch (error) {
      throw new HttpException(500, "Unable to create Event");
    }
  },

  updateEvent: async (eventId, updatedData) => {
    try {
      await EventModel.update(updatedData, {
        where: { id: eventId },
        returning: true,
      });
      const updatedEvent = await EventModel.findByPk(eventId);
      return updatedEvent;
    } catch (error) {
      throw new HttpException(500, "Unable to update event");
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const deletedRowsCount = await EventModel.destroy({
        where: { id: eventId },
      });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Unable to delete event");
    }
  },
};

module.exports = { EventService };
