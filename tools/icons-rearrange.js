const fs = require("fs");

function recursiveScan(filepath) {
  let check = fs.readdirSync(filepath).map(f => `${filepath}/${f}`);

  const files = [];
  do {
    next = check;
    check = [];

    next.forEach(item => {
      if (fs.lstatSync(item).isDirectory()) {
        check = [...check, ...fs.readdirSync(item).map(f => `${item}/${f}`)];
      } else {
        files.push(item);
      }
    });
  } while (check.length);

  return files;
}

const iconsToFileMap = {};

const allFiles = recursiveScan("./class");

allFiles.forEach(file => {
  const content = fs.readFileSync(file).toString();
  const iconsRaw = content.match(/['"]\/iconpack[^'"]+['"]/g);

  const icons = (iconsRaw || []).map(icon => icon.replace(/['"]/g, ""));

  icons.forEach(i => {
    if (!iconsToFileMap[i]) {
      iconsToFileMap[i] = {};
    }
    iconsToFileMap[i][file] = true;
    if (Object.keys(iconsToFileMap[i]).length > 1) {
      throw new Error("Icon used twice " + i);
    }
  });
});

Object.keys(iconsToFileMap).forEach(icon => {
  const file = Object.keys(iconsToFileMap[icon]).pop();

  console.log("Updating file...", file, icon);

  const originalFilename = icon.replace(/^.*\//, "");
  const barePath = file.replace("./class", "").replace(/\/[^/]+$/, "");
  const targetPath = `./resources/icons${barePath}/`;
  const targetFile = `${targetPath}${originalFilename}`;
  const replacePath = `/icons${barePath}/${originalFilename}`;

  let path = "";
  const pieces = targetPath.split("/");
  pieces.forEach(piece => {
    const next = path ? path.split("/") : [];
    next.push(piece);
    path = next.join("/");
    try {
      fs.mkdirSync(path, { recursive: true });
    } catch (e) {
      // console.warn(e.message);
    }
  });
  try {
    fs.copyFileSync(`./resources${icon}`, targetFile);
  } catch (e) {
    utils.error(e.message);
  }
  const content = fs.readFileSync(file).toString();
  let updated = content;
  do {
    updated = updated.replace(icon, replacePath);
  } while (updated.indexOf(icon) >= 0);
  fs.writeFileSync(file, updated);
});
