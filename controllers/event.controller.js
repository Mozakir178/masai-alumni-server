const { HttpException } = require("../exceptions/HttpException");
const { EventService } = require("../services/event.service");
const { NoticeService } = require("../services/notice.service");

const EventController = {
  getEventById: async (req, res, next) => {
    const eventId = Number(req.params.id);

    try {
      const event = await EventService.getEventById(eventId);
      if (event) {
        res.status(200).json(event);
      } else {
        next(new HttpException(404, "Event not found"));
      }
    } catch (error) {
      next(error);
    }
  },

  getAllEvent: async (req, res, next) => {
    const userId = req.user.id;
    const filters = req.query;
    try {
      const events = await EventService.getAllEvents(filters);
      res.status(200).json({ events, loggedInUserId: userId });
    } catch (error) {
      next(error);
    }
  },

  createEvent: async (req, res, next) => {
    const eventData = req.body;
    const id = Number(req.user.id);
    try {
      const newEvent = await EventService.createEvent({
        ...eventData,
        manager_id: id,
      });
      await NoticeService.createNotice({
        attachmentId: newEvent.id,
        category: "event",
        authorId: id,
      });
      res.status(201).json(newEvent);
    } catch (error) {
      next(error);
    }
  },

  updateEvent: async (req, res, next) => {
    const eventId = Number(req.params.id);
    const updatedData = req.body;
    try {
      const updatedEvent = await EventService.updateEvent(eventId, updatedData);

      if (!updatedEvent) {
        next(new HttpException(404, "Event not found"));
      } else {
        res.json({
          message: "event updated successfully",
          updatedEvent,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteEvent: async (req, res, next) => {
    const eventId = Number(req.params.id);

    try {
      const deletedRowsCount = await EventService.deleteEvent(eventId);

      if (deletedRowsCount === 0) {
        next(new HttpException(404, "Event not found"));
      } else {
        await NoticeService.deleteNoticebyAttachmentID(eventId, "event");
        res.status(201).json({
          message: "Event deleted successfully",
          deletedRowsCount,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { EventController };
