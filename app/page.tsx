import HomeClient from "@/app/components/home/Home";
import fs from "fs/promises";
import path from "path";

// Fetch data at build time (SEO friendly, static)
async function getEventsData() {
  try {
    const filePath = path.join(process.cwd(), "app", "json", "events_tr.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading events:", error);
    return [];
  }
}

export default async function Home() {
  const events = await getEventsData();

  return <HomeClient events={events} />;
}
