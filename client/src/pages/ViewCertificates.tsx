import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTCertificate from "../../NFTCertificate.json"; // Ensure correct path

const CONTRACT_ADDRESS = "0x737489CcFC57bC25391Ea1CA1c830388C1320267";

const ViewCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<{ tokenId: string; tokenURI: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
        if (!window.ethereum) {
          setError("MetaMask is not installed.");
          return;
        }
      
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTCertificate.abi, provider);
      
          // 🔍 Get the number of NFTs owned by the user
          const balance = await contract.balanceOf(userAddress);
          const userCertificates = [];
      
          for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
            const tokenURI = await contract.tokenURI(tokenId);
            userCertificates.push({ tokenId: tokenId.toString(), tokenURI });
          }
      
          setCertificates(userCertificates);
        } catch (error) {
          console.error("Error fetching certificates:", error);
          setError("Failed to fetch certificates.");
        }
      };      

    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Your NFT Certificates</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      {certificates.length === 0 ? (
        <p className="text-center text-gray-700">No certificates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.tokenId} className="bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold">Certificate #{cert.tokenId}</h2>
              <p className="text-gray-600">
                Token URI:{" "}
                <a href={cert.tokenURI} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  {cert.tokenURI}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCertificates;
