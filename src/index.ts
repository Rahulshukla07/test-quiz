
// Set detault timezone to utc
process.env.TZ = 'UTC';

// Import Server.
import { ExpressServer } from "./server";
export const init = async () => {
    // Start Server.
    ExpressServer.start();

}
init();