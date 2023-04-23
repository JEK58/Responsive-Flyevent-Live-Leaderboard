import ftp from "basic-ftp";
import { Readable } from "stream";
import fetch from "node-fetch";

// Scans the "race" directory for folders that only contain numbers as name (comp ids)
// and checks if they contain a feed_task.json. Creates an active_comps.json from the
// data and uploads it to the "race" directory

export const handler = async (event, context) => {
  const activeComps = {
    activeComps: [],
    createdAt: new Date().toISOString(),
  };
  try {
    const client = new ftp.Client();
    // client.ftp.verbose = true;
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PW,
    });

    const dirList = await client.list("/race");

    const directories = dirList
      .filter((el) => /^\d+$/.test(el.name))
      .filter((el) => el.size == 0)
      .map((el) => el.name);

    if (!directories.length) throw "No comp directory found";

    for (const folderName of directories) {
      const folderContentsList = await client.list(`/race/${folderName}`);
      if (!folderContentsList.length) continue;
      const activeContent = folderContentsList.filter(
        (el) => el.name == "feed_task.json"
      );
      if (!activeContent.length) continue;
      const path = folderName + "/feed_task.json";
      const res = await fetch("https://race.airtribune.com/" + path);

      const data = await res.json();
      if (!data.event) continue;
      const event = { name: data.event, id: +folderName };
      activeComps.activeComps.push(event);
    }

    const json = JSON.stringify(activeComps);

    // Upload the JSON file to the 'race' directory on the FTP server
    const fileName = "active_comps.json";
    const filePath = `/race/${fileName}`;

    const stream = new Readable({
      read() {
        this.push(json);
        this.push(null);
      },
    });
    await client.uploadFrom(stream, filePath);
    client.close();

    return {
      statusCode: 200,
      body: "Successfully created active_comps.json on server",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
