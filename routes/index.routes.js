const UserRoutes = require("./user.route");
const NoticeRoutes = require("./notice.route");
const NotificationRoutes = require("./notification.route");
const EventRoutes = require("./event.route");
const EventParticipantRoutes = require("./eventParticipant.route");
const PollRoutes = require("./poll.route");
const ConnectionRoutes = require("./connection.route");
const ChapterRoutes = require("./chapter.route");
const ProfileRoutes = require("./profile.route");
const AlumniRoutes = require("./alumni.route");
const PrivateMessageRoutes = require("./privateMessage.route");
const GroupMessageRoutes = require("./groupMessage.route");
const PostRoutes = require("./post.route");
const AwsRoutes = require("./aws.route");
const PollResponseRoutes = require("./pollResponse.route");
const HOFRoutes = require("./HOF.route");
const VentureRoutes = require("./venture.route")
const FeedbackRoutes=require("./feedback.route")
const MentorRoutes=require("./mentor.route")
const JobRoutes=require("./job.route")
const SpotlightRoutes = require("./spotlight.route");
const Routes = [
  UserRoutes,
  NoticeRoutes,
  NotificationRoutes,
  EventRoutes,
  EventParticipantRoutes,
  PollRoutes,
  ConnectionRoutes,
  ChapterRoutes,
  ProfileRoutes,
  AlumniRoutes,
  PrivateMessageRoutes,
  PostRoutes,
  GroupMessageRoutes,
  HOFRoutes,
  MentorRoutes,
  JobRoutes,
  FeedbackRoutes,
  PostRoutes,
  AwsRoutes,
  GroupMessageRoutes,
  PostRoutes,
  PollResponseRoutes,
  SpotlightRoutes,
  VentureRoutes
];

module.exports = Routes;
