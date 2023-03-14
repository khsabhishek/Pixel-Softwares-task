const pinataSDK = require('@pinata/sdk');
const { JSDOM } = require('jsdom');
const FormData = require('form-data');
const ethers = require('ethers');
const contractInfo = require("../blockchain/artifacts/contracts/SocialMedia.sol/SocialMedia.json");


// Create a virtual DOM environment
const dom = new JSDOM();
global.window = dom.window;
global.document = window.document;

const createPostForm = document.getElementById('create-post-form');

const postFeed = document.getElementById('post-feed');

let provider;
let contract;

const pinataApiKey = '8cba0579a923e835a009';
const pinataSecretApiKey = '8568400263df3bc42937755a9ccd10b905e37ca022e392436e230545b9880bed';
const pinataClient = new pinataSDK(pinataApiKey, pinataSecretApiKey);

const appendPost = (post) => {
  const postElement = document.createElement('div');
  postElement.classList.add('post');

  const contentElement = document.createElement('p');
  contentElement.textContent = post.content;
  postElement.appendChild(contentElement);

  const imageElement = document.createElement('img');
  imageElement.src = `https://ipfs.io/ipfs/${post.ipfsHash}`;
  postElement.appendChild(imageElement);

   // Listen for the NewPost event and update the front-end feed in real-time
   contract.on("NewPost", (postCount, _content, _ipfsHash, owner) => {

    let newPost = {
      postCount: postCount,
      content: _content,
      ipfsHash: _ipfsHash,
      owner: owner,
    }
    // Update your front-end feed with the new post information
    console.log(JSON.stringify(newPost, null, 4));
  });

  postFeed.prepend(postElement);
};

if (createPostForm) {
  createPostForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const postContent = event.target['post-content'].value;
    const postImage = event.target['post-image'].files[0];

    const formData = new FormData();
    formData.append('file', postImage);
    formData.append('data', postContent)
    const result = await pinataClient.pinFileToIPFS(formData);
    const postIpfsHash = result.IpfsHash;

    // Call addPost function on the smart contract
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0xaEa2f14451828F5b3E7Df1001ee264fc428bC636';
    const contractABI = contractInfo.abi; // your contract ABI
    console.log("contact address")
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.addPost(postContent, postIpfsHash);

    const post = { content: postContent, ipfsHash: postIpfsHash };
    appendPost(post);

    createPostForm.reset();
  });
}

