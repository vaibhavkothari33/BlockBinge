// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MovieNFT is ERC721, ReentrancyGuard, Ownable {
    struct Movie {
        string title;
        string uri;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Movie) public movies;
    uint256 private _tokenIds;

    event MovieListed(uint256 tokenId, uint256 price);
    event MovieSold(uint256 tokenId, address buyer, uint256 price);

    constructor() ERC721("Movie NFT", "MNFT") {}

    function mintMovie(
        string memory title,
        string memory uri,
        uint256 price
    ) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(msg.sender, newTokenId);
        movies[newTokenId] = Movie(title, uri, price, true);
        
        return newTokenId;
    }

    function buyMovie(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Movie does not exist");
        Movie storage movie = movies[tokenId];
        require(movie.forSale, "Movie is not for sale");
        require(msg.value >= movie.price, "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);
        
        movie.forSale = false;
        
        emit MovieSold(tokenId, msg.sender, msg.value);
    }

    function listMovie(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        movies[tokenId].price = price;
        movies[tokenId].forSale = true;
        
        emit MovieListed(tokenId, price);
    }
} 