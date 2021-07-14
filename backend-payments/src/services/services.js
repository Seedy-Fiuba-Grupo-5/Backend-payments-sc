const walletService = require("./wallets");
const contractInteraction = require("./contractInteraction");
const projectService = require("./projects");

module.exports = ({ config }) => ({
  walletService: walletService({ config }),
  contractInteraction: contractInteraction({ config }),
  projectService: projectService({ config })
});
