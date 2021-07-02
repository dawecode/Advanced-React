import "dotenv/config";
import { config, createSchema } from "@keystone-next/keystone/schema";

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in ?
  secret: process.env.COOKIE_SECRET,
};

export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: "mongoose",
    url: databaseURL,
    // todo add data seeding
  },
  lists: createSchema({
    // Schema items go in here
  }),
  ui: {
    isAccessAllowed: () => true,
  }, // add sessions values  here
});
