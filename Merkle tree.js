const crypto = require("crypto");

function hashFunction(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function buildMerkleTree(leaves) {
  if (leaves.length === 1) {
    return leaves;
  }

  if (leaves.length % 2 !== 0) {
    leaves.push(leaves[leaves.length - 1]);
  }

  const parentNodes = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const combinedHash = hashFunction(leaves[i] + leaves[i + 1]);
    parentNodes.push(combinedHash);
  }

  return buildMerkleTree(parentNodes);
}

function verifyLeafInMerkleRoot(leaf, proof, merkleRoot) {
  let currentHash = hashFunction(leaf);
  proof.forEach((sibling) => {
    currentHash = hashFunction(currentHash + sibling);
  });
  return currentHash === merkleRoot;
}

const addresses = [
  "0xAddress1",
  "0xAddress2",
  "0xAddress3",
  "0xAddress4",
  "0xAddress5",
];

const hashedLeaves = addresses.map(hashFunction);

const merkleTree = buildMerkleTree(hashedLeaves);
const merkleRoot = merkleTree[0];

const proof = [hashedLeaves[1], buildMerkleTree(hashedLeaves.slice(2))[0]];

const isValid = verifyLeafInMerkleRoot(addresses[0], proof, merkleRoot);

console.log("Merkle Root:", merkleRoot);
console.log("Is first leaf valid?", isValid);

