const { exec } = require("child_process");

const envFile = ".env";

require("dotenv").config({ path: envFile });

const outFile = "utils/types/database.types.ts";
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = process.env.SUPABASE_PROJECT_ID;

const command = `npx supabase login --token ${accessToken} && npx supabase gen types --lang=typescript --project-id ${projectId} > ${outFile}`;

console.log(command, "\n");

exec(command, (error, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    if (error !== null) {
        console.error(`EXEC ERROR: ${error}`);
    }
});
