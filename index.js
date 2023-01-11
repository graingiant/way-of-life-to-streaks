import fs from "fs";
import { program } from "commander";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

program
  .version("0.0.1", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-i, --input <value>", "Exported CSV from Way of Life")
  .option(
    "-p, --path <value>",
    "Output path for Streaks CSV (relative to cwq; omit trailing slash)"
  )
  .option("-n --name <value>", "Name of Streaks output file");

program.parse();

const options = program.opts();

const maps = {
  entryType: {
    Red: "missed_manually",
    Green: "completed_manually",
    Blue: "skipped_manually",
    "-": "",
  },
};
const convertToTimestamp = (dateString) => `${dateString}T00:00:00.000Z`;
const convertToEntryDate = (dateString) => dateString.replaceAll("-", "");
const convertToEntryType = (entryValue) => maps.entryType[entryValue];

(async () => {
  console.log("Reading input...");
  const parser = fs.createReadStream(options.input, "utf8").pipe(parse());

  let count = 0;
  let headers;
  let output = [];

  for await (const record of parser) {
    if (count === 0) {
      // Grab headers and skip to first data row.
      headers = record;
      count++;
      continue;
    }

    let dateForRow = {
      date: null,
      timestamp: null,
    };

    record.forEach((value, index) => {
      // Default new Streaks row object
      let streaksItem = {
        task_id: null,
        title: "",
        icon: "",
        entry_type: "",
        entry_date: "",
        entry_timestamp: "",
        quantity: 0.0,
        page: null,
      };

      const header = headers[index];

      // Skip notes; Streaks doesn't offer support for them anyway
      if (header.includes("Notes")) {
        return;
      }

      // Convert dates to correct date formats.
      // Way of Life doesn't have timestamps, so everything is set to midnight.
      if (header === "Date") {
        dateForRow.date = convertToEntryDate(value);
        dateForRow.timestamp = convertToTimestamp(value);
        return;
      }

      // Set all the data within the object.
      streaksItem.entry_date = dateForRow.date;
      streaksItem.entry_timestamp = dateForRow.timestamp;
      streaksItem.title = header;
      streaksItem.entry_type = convertToEntryType(value);

      // Add it to the output collection to conver to CSV.
      output.push(streaksItem);
    });
  }
  console.log("+++ Finished processing input");

  // Create new CSV
  const outputString = stringify(output, { header: true });
  fs.writeFileSync(options.path + "/" + options.name, outputString);

  console.log("File written to: ", options.path + "/" + options.name);
})();
