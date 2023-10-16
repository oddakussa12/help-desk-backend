const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConfig = require("./config/db.config.js");
const cookieParser = require("cookie-parser");

// admin routes
const adminRoleRoutes = require("./routes/admin/roleRoutes.js");
const adminTicketStatusRoutes = require("./routes/admin/ticketStatusRoutes.js");
const adminSupportLevelRoutes = require("./routes/admin/supportLevelRoutes.js");
const adminIssueCategoryRoutes = require("./routes/admin/issueCategoryRoutes.js");
const ticketPriority = require("./routes/admin/ticketPriorityRoutes.js");
const adminFaqRoutes = require("./routes/admin/faqRoutes.js");
const adminUserRoutes = require("./routes/admin/userRoutes.js");
const adminTicketRoute = require("./routes/admin/ticketRoutes.js");
const adminProfileRoute = require("./routes/admin/profileRoutes.js");
const adminDashboardRoute = require("./routes/admin/dashboardRoutes.js");

// support user routes
const supportTicketRoute = require("./routes/support/ticketRoute.js");
const supportBaseDataRoute = require("./routes/support/baseDataRoute.js");
const supportFaqRoute = require("./routes/support/faqRoute.js");

// end user routes
const userTicketRoutes = require("./routes/user/ticketRoutes.js");
const userBaseDataRoutes = require("./routes/user/baseDataRoutes.js");

// public routes
const worldFaqRoute = require("./routes/world/faqRoute.js");

// auth routes
const authRoutes = require("./routes/auth/authRoutes.js");

// custom middlewares
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

// express app
const app = express();
// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());

// connect to mongodb & listen for requests
const dbURI = dbConfig.url;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
  })
  .catch((err) => console.log(err));

// middleware & static files
app.use("/public", express.static("public"));

// register view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

// ENDPOINTS

// apply checkUser middleware on every route
app.get("*", checkUser);

// auth endpoints
app.use("/api/auth", authRoutes);

// admin endpoints
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/roles", adminRoleRoutes);
app.use("/api/admin/ticket-priority", ticketPriority);
app.use("/api/admin/support-level", adminSupportLevelRoutes);
app.use("/api/admin/ticket-status", adminTicketStatusRoutes);
app.use("/api/admin/issue-category", adminIssueCategoryRoutes);
app.use("/api/admin/faqs", checkUser, adminFaqRoutes);
app.use("/api/admin/tickets", checkUser, adminTicketRoute);
app.use("/api/admin/profile", checkUser, adminProfileRoute);
app.use("/api/admin/dashboard", checkUser, adminDashboardRoute);


// support user endpoints
app.use("/api/support/tickets", checkUser, supportTicketRoute);
app.use("/api/support/base-data", checkUser, supportBaseDataRoute);
app.use("/api/support/faqs", requireAuth, checkUser, supportFaqRoute);

// end user endpoints
app.use("/api/user/tickets", requireAuth, checkUser, userTicketRoutes);
app.use("/api/user/base-data", requireAuth, checkUser, userBaseDataRoutes);

// public endpoints
app.use("/api/faqs", worldFaqRoute);


// 404
app.use((req, res, next) => {
  res.status(404).json("Sorry, the api you requested does not exist.");
});
