// eslint-disable-next-line no-undef
const https = require("https");

console.log("deployment started!");

https
	.get("VERCEL DEPLOY WEBHOOK HERE!", (resp) => {
		resp.on("data", (chunk) => {
			console.log(chunk.toString());
		});
		resp.on("end", () => {
			console.log("Deploy request sent!");
		});
	})
	.on("error", (err) => {
		console.log("Deployment failed" + err.message);
	});
