import path from "path";
import fs from "fs-extra";

const hbs = require("handlebars");

export async function renderTemplate(data: any, templateName: string, partsDirectory: string) {
  const html = await fs.readFile(templateName, "utf-8");

  if (partsDirectory && partsDirectory !== "") {
    let filenames = fs.readdirSync(partsDirectory);
    if (filenames && filenames.length) {
      filenames.forEach(function(filename: string) {
        let matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) {
          return;
        }
        let name = matches[1];
        let template = fs.readFileSync(path.join(partsDirectory, filename), "utf8");
        hbs.registerPartial(name, template);
      });
    }
  }

  // creates the Handlebars template object
  const template = hbs.compile(html, {
    strict: true
  });

  // renders the html template with the given data
  const rendered = template(data);

  return rendered;
}
