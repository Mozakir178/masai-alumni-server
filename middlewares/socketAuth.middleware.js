const HttpException = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");

module.exports = function configureSocketAuth(app, io) {
  io.use(async (socket, next) => {
    const cookieString = socket.request.headers.cookie || "";
    const cookies = cookieString.split(";").reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = value;
      return cookies;
    }, {});

    console.log(cookies);

    if (cookies[`${process.env.AUTH_COOKIE_NAME}`]) {
      const sessionParser = app.get("sessionMiddleware"); 

      sessionParser(socket.request, {}, async () => {
        const userId = socket.request.session?.passport?.user;

        if (!userId) {
          const error = new HttpException(404, "User not authenticated");
          return next(error);
        }

        const user = await UserModel.findByPk(userId);

        if (!user) {
          const error = new HttpException(
            404,
            "Not authorized: User not found"
          );
          return next(error);
        }

        socket.handshake.auth.user = user.dataValues;
        return next();
      });
    } else {
      next(new HttpException(404, "Not authorized"));
    }
  });
};
