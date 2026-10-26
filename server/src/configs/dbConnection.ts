"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// MongoDB Connection:

import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PRODUCTION_DATABASE = "kindoradb";

function databaseNameFromUri(uri: string): string {
  const parsable = uri.replace(/^mongodb(\+srv)?:\/\//, "https://");
  let parsed: URL;

  try {
    parsed = new URL(parsable);
  } catch {
    throw new Error("DB_URI is not a valid MongoDB connection string.");
  }

  return decodeURIComponent(parsed.pathname.replace(/^\//, "").split("/")[0] ?? "");
}

function allowsProductionDatabaseInDevelopment(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.ALLOW_PRODUCTION_DB_IN_DEV === "true"
  );
}

function assertSafeDatabaseTarget(uri: string): string {
  const databaseName = databaseNameFromUri(uri);

  if (!databaseName) {
    throw new Error("DB_URI does not contain a database name.");
  }

  // Only the exact value "production" is production. An unset NODE_ENV stays protected.
  const isProduction = process.env.NODE_ENV === "production";
  const targetsProductionDatabase = databaseName.toLowerCase() === PRODUCTION_DATABASE;

  if (!isProduction && targetsProductionDatabase) {
    if (!allowsProductionDatabaseInDevelopment()) {
      throw new Error(
        "Refusing to connect: a non-production process is configured to use the production database.",
      );
    }

    console.warn(
      [
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        "! WARNING: development is using the production database.   !",
        "! Database: kindoradb                                      !",
        "! ALLOW_PRODUCTION_DB_IN_DEV=true                          !",
        "! Writes from this process affect live data.               !",
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
      ].join("\n"),
    );
  }

  return databaseName;
}

const dbConnection = async function () {
  const uri = process.env.DB_URI;

  if (!uri) {
    throw new Error("DB_URI is missing.");
  }

  const databaseName = assertSafeDatabaseTarget(uri);
  console.log(`* DB target: ${databaseName} *`);

  await mongoose
    .connect(uri)
    .then(() => console.log("* DB Connected *"))
    .catch((err) => {
      console.log("! DB Not Connected !");
      throw err;
    });
};

/* ------------------------------------------------------- */
export { mongoose, dbConnection };
