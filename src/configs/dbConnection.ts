"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// MongoDB Connection:

import mongoose from "mongoose";

const dbConnection = async function () {
  await mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("* DB Connected *"))
    .catch((err) => {
      console.log("! DB Not Connected !");
      throw err;
    });
};

/* ------------------------------------------------------- */
export { mongoose, dbConnection };
