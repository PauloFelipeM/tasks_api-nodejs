import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("./tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const parser = stream.pipe(
  parse({
    delimiter: ",",
    skip_empty_lines: true,
    from_line: 2,
  })
);

for await (const record of parser) {
  const [title, description] = record;

  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  console.log(`Imported: ${title}`);
}

console.log("CSV import completed!");
