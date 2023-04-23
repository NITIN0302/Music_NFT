async function main()
{
    const towei = (num) => ethers.utils.parseEther(num.toString())
    let royaltyFee = towei(0.01);
    let prices = [towei(1),towei(2),towei(3),towei(4),towei(5),towei(6),towei(7),towei(8)]
    let deploymentFees = towei(prices.length * 0.01)
    const[deployer,artist] = await ethers.getSigners();

    console.log("Deploying contracts with the account:",deployer.address);
    console.log("Account balance:",(await deployer.getBalance()).toString());

    const NFTMarketplaceFactory = await ethers.getContractFactory("MusicNFTMarketplace");
    nftMarketplace = await NFTMarketplaceFactory.deploy(
      royaltyFee,
      artist.address,
      prices,
      {value: deploymentFees}
    );

    console.log("Smart contract address:", nftMarketplace.address)

    saveFrontendFiles(nftMarketplace,"MusicNFTMarketplace");
}

function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/contractsData";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      contractsDir + `/${name}-address.json`,
      JSON.stringify({ address: contract.address }, undefined, 2)
    );
  
    const contractArtifact = artifacts.readArtifactSync(name);
  
    fs.writeFileSync(
      contractsDir + `/${name}.json`,
      JSON.stringify(contractArtifact, null, 2)
    );
  }

main()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });