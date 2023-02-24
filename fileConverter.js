const { parse } = require("csv-parse");

// Standard file types
const FILE_TYPE = {
  CSV: "csv",
  PRN: "prn",
  HTML: "html",
  JSON: "json",
};

/**
 * Encode input stream with `utf8`
 * @param {ReadStream} stream
 * @returns {Buffer}
 */
async function read(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Convert given number to formatted date
 * @param {number} date
 * @returns {Date} formatted date
 */
function toDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}

/**
 * Convert given number to formatted currency
 * @param {number} currency
 * @returns {string} formatted currency
 */
function toCurrency(currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(currency);
}

// Main file converter function
const fileConverter = async (input, output) => {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];

  if (inputFile === FILE_TYPE.CSV) {
    if (outputFile === FILE_TYPE.HTML) {
      let headersParsed = false;
      output.write("<table>\n");
      input
        .pipe(parse())
        .on("data", function (row) {
          output.write("<tr>\n");
          row.forEach((data, i) => {
            // if headersParsed then write as table data otherwise write as table header
            if (headersParsed) {
              let d = data;
              if (i === row.length - 1) {
                // Date conversion
                d = toDate(d);
              } else if (i === row.length - 2) {
                // Currency conversion
                d = toCurrency(d);
              }
              output.write(`<td>${d}</td>\n`);
            } else {
              output.write(`<th>${data}</th>\n`);
            }
          });
          output.write("</tr>\n");
          headersParsed = true;
        })
        .on("error", function (error) {
          console.log(error.message);
        })
        .on("end", function () {
          output.write("</table>\n");
        });
    } else if (outputFile === FILE_TYPE.JSON) {
      const data = [];
      input
        .pipe(
          parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
          })
        )
        .on("data", function (row) {
          const convertedData = {
            ...row,
            "Credit Limit": toCurrency(row["Credit Limit"]),
            Birthday: toDate(row["Birthday"]),
          };

          data.push(convertedData);
        })
        .on("error", function (error) {
          console.log(error.message);
        })
        .on("end", function () {
          output.write(JSON.stringify(data));
        });
    }
  } else if (inputFile === FILE_TYPE.PRN) {
    if (outputFile === FILE_TYPE.HTML) {
      // Read file
      const fileData = await read(process.stdin);

      // Read rows
      const rows = fileData.split("\n").map(function (el) {
        return el.split(/\s\s+/);
      });

      // Read first row for table headers
      const headers = rows.shift();

      // Start table
      output.write("<table>\n");

      // Write table and table headers
      output.write("<tr>\n");
      headers.forEach((header) => {
        output.write(`<th>${header}</th>\n`);
      });
      output.write("</tr>\n");

      // Iterate over the remaining rows for table data
      rows.forEach((row) => {
        output.write("<tr>\n");
        row.forEach((data, i) => {
          let d = data;
          if (i === row.length - 1) {
            // Date conversion
            d = toDate(Number(d));
          } else if (i === row.length - 2) {
            // Currency conversion
            d = d.substring(0, d.length - 2) + "." + d.substring(d.length - 2);
            d = toCurrency(Number(d));
          }
          output.write(`<td>${d}</td>\n`);
        });
        output.write("</tr>\n");
      });

      // End table
      output.write("</table>\n");
    } else if (outputFile === FILE_TYPE.JSON) {
      // Read file
      const fileData = await read(process.stdin);

      // Read rows
      const rows = fileData.split("\n").map(function (el) {
        return el.split(/\s\s+/);
      });

      // Read first row for table headers
      const keys = rows.shift();

      const finalJSON = [];

      // Iterate over the remaining rows for table data
      rows.forEach((row) => {
        const obj = {};
        row.forEach((data, i) => {
          let d = data;
          if (i === row.length - 1) {
            // Date conversion
            d = toDate(Number(d));
          } else if (i === row.length - 2) {
            // Currency conversion
            d = d.substring(0, d.length - 2) + "." + d.substring(d.length - 2);
            d = toCurrency(Number(d));
          }
          obj[keys[i]] = d;
        });
        finalJSON.push(obj);
      });
      finalJSON.pop();
      output.write(JSON.stringify(finalJSON));
    }
  }
};

fileConverter(process.stdin, process.stdout);
