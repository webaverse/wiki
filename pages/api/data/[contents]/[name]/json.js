// import stream from "stream";
import { Ctx } from "../../../../../clients/context.js";
import { cleanName } from "../../../../../utils.js";
import { parseDatasetItems } from "../../../../../datasets/dataset-parser.js";
import { getDatasetSpecs } from "../../../../../datasets/dataset-specs.js";

export default async function handler(req, res) {
    // const match = req.url.match(/^\/api\/data\/([^\/]*)\/([^\/]*)/);
    // let type = match ? match[1].replace(/s$/, '') : '';
    // let name = match ? match[2] : '';

    // A safer way to get the URL params
    let type = req.query?.contents ? req.query?.contents.replace(/s$/, "") : "";
    let name = req.query?.name ? req.query?.name : "";

    name = decodeURIComponent(name);
    name = cleanName(name);

    const c = new Ctx();
    const title = `${type}/${name}`;
    const query = await c.databaseClient.getByName("Content", title);

    if (query) {
        const { content: text } = query;
        const datasetSpecs = await getDatasetSpecs();
        const datasetSpec = datasetSpecs.find((ds) => ds.type === type);
        const items = parseDatasetItems(text, datasetSpec);
        if (items.length > 0) {
            const item0 = items[0];
            res.json({
                title: name,
                type: type,
                content: item0,
                error: null,
            });
        } else {
            res.json({
                data: null,
                // notFound: true,
                error: "Failed to parse item",
            });
        }
    } else {
        res.send(404);
    }
}
