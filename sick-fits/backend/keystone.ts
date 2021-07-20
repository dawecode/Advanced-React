import "dotenv/config";
import { config, createSchema } from "@keystone-next/keystone/schema";
import { createAuth } from "@keystone-next/auth";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { CartItem } from "./schemas/CartItem";
import { Role } from "./schemas/Role";
import { insertSeedData } from "./seed-data";
import {
  withItemData,
  statelessSessions,
} from "@keystone-next/keystone/session";
import { sendPasswordResetEmail } from "./lib/mail";
import { extendGraphqlSchema } from "./mutations";
import { OrderItem } from "./schemas/OrderItem";
import { Order } from "./schemas/Order";
import { permissionsList } from "./schemas/fields";
const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in ?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
  passwordResetLink: {
    async sendToken(args) {
      // send email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});
export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: "mongoose",

      url: databaseURL,

      async onConnect(keystone) {
        console.log("Connected to the database!");
        if (process.argv.includes("--seed-data"))
          await insertSeedData(keystone);
      },
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role,
    }),
    extendGraphqlSchema: extendGraphqlSchema,
    ui: {
      //show the ui only for people who pass this test
      isAccessAllowed: ({ session }) => {
        //console.log(session);
        return !!session?.data;
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      //graphQL query
      User: `id name email role { ${permissionsList.join(" ")} }`,
    }),
  })
);
