const {expect} = require("chai");

const towei = (num) => ethers.utils.parseEther(num.toString())
const fromwei = (num) =>ethers.utils.formatEther(num)

describe("MusicNFTMarketplace contract", function(){
    let nftMarketplace
    let deployer,artist,user1,user2,users;
    let royaltyFee = towei(0.01);
    let URI = "https://bafybeidhjjbjonyqcahuzlpt7sznmh4xrlbspa3gstop5o47l6gsiaffee.ipfs.nftstorage.link/"
    let prices = [towei(1),towei(2),towei(3),towei(4),towei(5),towei(6),towei(7),towei(8)]
    let deploymentFees = towei(prices.length * 0.01)
    beforeEach(async function(){
            const NFTMarketplaceFactory = await ethers.getContractFactory("MusicNFTMarketplace");
            // console.log(await ethers.getSigners());
            [deployer,artist,user1,user2,...users] = await ethers.getSigners();

            nftMarketplace = await NFTMarketplaceFactory.deploy(
                royaltyFee,
                artist.address,
                prices,
                {value: deploymentFees}
            );
        }
    );

    describe("Deployment", function(){
        it("should track name, symbol, URI", async function(){
            const nftName = "DAppFi"
            const nftSymbol = "DAPP"
            expect(await nftMarketplace.name()).to.equal(nftName);
            expect(await nftMarketplace.symbol()).to.equal(nftSymbol);
            expect(await nftMarketplace.royaltyFee()).to.equal(royaltyFee);
            expect(await nftMarketplace.artist()).to.equal(artist.address);
        });

        it("Should min then list all music nft", async function(){
            expect(await nftMarketplace.balanceOf(nftMarketplace.address)).to.equal(8);
            await Promise.all(prices.map(async(i,indx) => {
                const item = await nftMarketplace.marketItems(indx)
                expect(item.tokenId).to.equal(indx)
                expect(item.seller).to.equal(deployer.address)
                expect(item.price).to.equal(i)
            }))
        });

        it("Ether balance should equal deployment Fees",async function(){
            expect(await ethers.provider.getBalance(nftMarketplace.address)).to.equal(deploymentFees)
        });
    });

    describe("Updating royalty fee", function()
    {
        it("Only deployer should be adle to update royalty fee",async function(){
            const fee = towei(0.02);
            await nftMarketplace.updateRoyaltyFee(fee)
            await expect(
                nftMarketplace.connect(user1).updateRoyaltyFee(fee)
            ).to.be.revertedWith("Ownable: caller is not the owner");
            expect(await nftMarketplace.royaltyFee()).to.equal(fee)
        });
    });

    describe("Buying Token function", function(){
        it("Update seller to zero address, transfer NFT, pay seller, pay royalty to artist", async function(){
            const deployerInitalEthBal = await deployer.getBalance()
      const artistInitialEthBal = await artist.getBalance()
      // user1 purchases item.
      await expect(nftMarketplace.connect(user1).buyToken(0, { value: prices[0] }))
        .to.emit(nftMarketplace, "MarketItemBought")
        .withArgs(
          0,
          deployer.address,
          user1.address,
          prices[0]
        )
        const deployerFinalEthBal = await deployer.getBalance()
        const artistFinalEthBal = await artist.getBalance()
        // Item seller should be zero addr
        expect((await nftMarketplace.marketItems(0)).seller).to.equal("0x0000000000000000000000000000000000000000")
        // Seller should receive payment for the price of the NFT sold.
        expect(+fromwei(deployerFinalEthBal)).to.equal(+fromwei(prices[0]) + +fromwei(deployerInitalEthBal))
        // Artist should receive royalty
        expect(+fromwei(artistFinalEthBal)).to.equal(+fromwei(royaltyFee) + +fromwei(artistInitialEthBal))
        // The buyer should now own the nft
        expect(await nftMarketplace.ownerOf(0)).to.equal(user1.address);
            });
            it("Should fail when ether amount sent with transaction does not equal asking price", async function () {
                // Fails when ether sent does not equal asking price
                await expect(
                nftMarketplace.connect(user1).buyToken(0, { value: prices[1] })
                ).to.be.revertedWith("Please send the asking price in order to complete the purchase");
            });
    });

    describe("Reselling tokens", function () {
        beforeEach(async function () {
          // user1 purchases an item.
          await nftMarketplace.connect(user1).buyToken(0, { value: prices[0] })
        })
    
        it("Should track resale item, incr. ether bal by royalty fee, transfer NFT to marketplace and emit MarketItemRelisted event", async function () {
          const resaleprice = towei(2)
          const initMarketBal = await ethers.provider.getBalance(nftMarketplace.address)
          // user1 lists the nft for a price of 2 hoping to flip it and double their money
          await expect(nftMarketplace.connect(user1).resellToken(0, resaleprice, { value: royaltyFee }))
            .to.emit(nftMarketplace, "MarketItemRelisted")
            .withArgs(
              0,
              user1.address,
              resaleprice
            )
          const finalMarketBal = await ethers.provider.getBalance(nftMarketplace.address)
          // Expect final market bal to equal inital + royalty fee
          expect(+fromwei(finalMarketBal)).to.equal(+fromwei(royaltyFee) + +fromwei(initMarketBal))
          // Owner of NFT should now be the marketplace
          expect(await nftMarketplace.ownerOf(0)).to.equal(nftMarketplace.address);
          // Get item from items mapping then check fields to ensure they are correct
          const item = await nftMarketplace.marketItems(0)
          expect(item.tokenId).to.equal(0)
          expect(item.seller).to.equal(user1.address)
          expect(item.price).to.equal(resaleprice)
        });
    
        it("Should fail if price is set to zero and royalty fee is not paid", async function () {
          await expect(
            nftMarketplace.connect(user1).resellToken(0, 0, { value: royaltyFee })
          ).to.be.revertedWith("Price must be greater than zero");
          await expect(
            nftMarketplace.connect(user1).resellToken(0, towei(1), { value: 0 })
          ).to.be.revertedWith("Must pay royalty");
        });
      });
      describe("Getter functions", function () {
        let soldItems = [0, 1, 4]
        let ownedByUser1 = [0, 1]
        let ownedByUser2 = [4]
        beforeEach(async function () {
          // user1 purchases item 0.
          await (await nftMarketplace.connect(user1).buyToken(0, { value: prices[0] })).wait();
          // user1 purchases item 1.
          await (await nftMarketplace.connect(user1).buyToken(1, { value: prices[1] })).wait();
          // user2 purchases item 4.
          await (await nftMarketplace.connect(user2).buyToken(4, { value: prices[4] })).wait();
        })
    
        it("getAllUnsoldTokens should fetch all the marketplace items up for sale", async function () {
          const unsoldItems = await nftMarketplace.getAllUnsoldTokens()
          // Check to make sure that all the returned unsoldItems have filtered out the sold items.
          expect(unsoldItems.every(i => !soldItems.some(j => j === i.tokenId.toNumber()))).to.equal(true)
          // Check that the length is correct
          expect(unsoldItems.length === prices.length - soldItems.length).to.equal(true)
        });

        it("getMyTokens should fetch all tokens the user owns", async function () {
          // Get items owned by user1
          let myItems = await nftMarketplace.connect(user1).getMyTokens()
          // Check that the returned my items array is correct
          expect(myItems.every(i => ownedByUser1.some(j => j === i.tokenId.toNumber()))).to.equal(true)
          expect(ownedByUser1.length === myItems.length).to.equal(true)
          // Get items owned by user2
          myItems = await nftMarketplace.connect(user2).getMyTokens()
          // Check that the returned my items array is correct
          expect(myItems.every(i => ownedByUser2.some(j => j === i.tokenId.toNumber()))).to.equal(true)
          expect(ownedByUser2.length === myItems.length).to.equal(true)
        });
      });
})