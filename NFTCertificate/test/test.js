const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTCertificate", function () {
    let NFTCertificate, nftCertificate, owner, student;

    beforeEach(async function () {
        [owner, student] = await ethers.getSigners();
        NFTCertificate = await ethers.getContractFactory("NFTCertificate");
        nftCertificate = await NFTCertificate.deploy();
        await nftCertificate.deployed();
    });

    it("Should mint a certificate successfully", async function () {
        const tokenURI = "https://example.com/certificate.json";
        const courseId = "AI-101";

        await expect(nftCertificate.mintCertificate(student.address, tokenURI, courseId))
            .to.emit(nftCertificate, "Transfer")
            .withArgs(ethers.constants.AddressZero, student.address, 1);
    });

    it("Should prevent duplicate certificates for the same course", async function () {
        const tokenURI = "https://example.com/certificate.json";
        const courseId = "AI-101";

        await nftCertificate.mintCertificate(student.address, tokenURI, courseId);
        await expect(nftCertificate.mintCertificate(student.address, tokenURI, courseId))
            .to.be.revertedWith("Certificate already issued for this course");
    });
});
