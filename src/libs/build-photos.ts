import fs from "fs";
import { getStore } from "@netlify/blobs";

export async function generatePhotos() {
	console.log("Generating photos...");

	const gallery = getStore({
		name: "gallery", 
		siteID: import.meta.env.SITE_ID,
		token: import.meta.env.SNAPI_TOKEN
	});

	const { blobs } = await gallery.list();
	console.log(await gallery.list())
	
	// Generate photos from blobs
	for (const { key } of blobs) {
		const { data, metadata } = await gallery.getWithMetadata(key, {
			type: "arrayBuffer",
		});

		// Can also use new Uint8Array() instead of Buffer.from();
		await fs.promises.writeFile(`./_astro/${key}.${metadata.ext}`, Buffer.from(data))
			.then(() => console.log(`Created ${key}.${metadata.ext} successfully!`))
			.catch((err) => console.error(`Error generating ${key}.${metadata.ext}: ${err.message}`))
	}
}

await generatePhotos()