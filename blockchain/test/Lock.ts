import { ethers } from "hardhat";
import { expect } from "chai";
import { SocialMedia } from "../typechain-types/SocialMedia";

describe("SocialMedia", () => {
  let socialMedia: SocialMedia;

  beforeEach(async () => {
    const SocialMedia = await ethers.getContractFactory("SocialMedia");
    socialMedia = (await SocialMedia.deploy()) as SocialMedia;
    await socialMedia.deployed();
  });

  describe("addPost", () => {
    it("should add a post", async () => {
      const content = "Hello, world!";
      const ipfsHash = "QmVLTYQjjffJfiL25jy6N5N5U5nx6U9ibfswWChRB29ZwB";
      await socialMedia.addPost(content, ipfsHash);

      const post = await socialMedia.posts(1, ethers.provider.getSigner(0).getAddress());
      expect(post.content).to.equal(content);
      expect(post.ipfsHash).to.equal(ipfsHash);
    });

    it("should revert if content is empty", async () => {
      const ipfsHash = "QmVLTYQjjffJfiL25jy6N5N5U5nx6U9ibfswWChRB29ZwB";

      await expect(socialMedia.addPost("", ipfsHash)).to.be.revertedWith("Content should not be empty");
    });

    it("should revert if ipfsHash is empty", async () => {
      const content = "Hello, world!";

      await expect(socialMedia.addPost(content, "")).to.be.revertedWith("IPFS hash should not be empty");
    });
  });
});
