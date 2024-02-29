const app = require("./app");
//handeling errors
process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting down the server ...");
});

//create server
const server = app.listen(3000, () => {
  console.log("server listening on port", 3000);
});
//unhandeled promise rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandeled rejection");
  server.close(() => {
    process.exit(1);
  });
});
