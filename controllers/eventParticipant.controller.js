
const HttpException = require('../exceptions/HttpException')
const { EventParticipantService } = require("../services/eventParticipant.service");


const EventParticipantController = {
  getEventParticipantById: async (req, res,next) => {
    const eventParticipantId = Number(req.params.id);

    try {
      const eventParticipant =
        await EventParticipantService.getEventParticipantById(
          eventParticipantId
        );
      if (eventParticipant) {
        res.json(eventParticipant);
      } else {
          next(new HttpException(404, "Event Participant not found"));
       
      }
    } catch (error) {
next(error)
    
    }
  },

  getEventParticipantByEventId: async (req, res,next) => {
    const eventId = +req.params.id;

    try {
      const eventParticipant =
        await EventParticipantService.getEventParticipantByEventId(eventId);
      if (eventParticipant) {
        res.json(eventParticipant);
      } else {
       next(new HttpException(404, "Event Participant not found"));
      }
    } catch (error) {
        next(error)
    }
  },

  getAllEventParticipants: async (req, res ,next) => {
    try {
      const eventParticipants =
        await EventParticipantService.getAllEventParticipants();
      res.status(200).json(eventParticipants);
    } catch (error) {
        next(error)
      
    }
  },

  createEventParticipant: async (req, res,next) => {
    const participantId = req.user.id;
      const eventParticipantData = req.body;
     

      try {
         
      const newEventParticipant =
        await EventParticipantService.createEventParticipant({
          ...eventParticipantData,
          participant_id: participantId,
        });

      console.log(newEventParticipant);
      res.status(201).json(newEventParticipant);
      } catch (error) {
          next(error)
     
    }
  },

  deleteEventParticipant: async (req, res,next) => {
    const eventParticipantId = Number(req.params.id);

    try {
      const deletedRowsCount =
        await EventParticipantService.deleteEventParticipant(
          eventParticipantId
        );

        if (deletedRowsCount === 0) {
          next(new HttpException(404, "Event Participant not found"));
      
      } else {
        res
          .status(202)
          .json({ message: "Event Participant deleted successfully" });
      }
    } catch (error) {
        next(error)
    }
  },
};

module.exports = { EventParticipantController };
