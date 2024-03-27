import Main from "./app";

const main = async () => {
  const app = new Main();
  app.start_server();
};

main().catch((err) => {
  console.log(err);
});
