// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCertificate is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    mapping(string => bool) private issuedCertificates; // Prevent duplicate issuance

    constructor() ERC721("CourseCertificate", "CERT") Ownable(msg.sender) {}

    function mintCertificate(address student, string memory tokenURI, string memory courseId) external onlyOwner returns (uint256) {
        require(!issuedCertificates[courseId], "Certificate already issued for this course");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(student, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        issuedCertificates[courseId] = true;

        return newTokenId;
    }
}
