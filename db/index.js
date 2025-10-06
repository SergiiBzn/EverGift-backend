import chalk from "chalk";
import mongoose from "mongoose";

try {
  const mongo = await mongoose.connect(process.env.MONGO_URI, {
    dbName: "everGiftDB",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  console.log(chalk.cyan(`DB Verbindung: ${mongo.connection.name}`));
} catch (error) {
  console.log(error);
  process.exit(1);
}
