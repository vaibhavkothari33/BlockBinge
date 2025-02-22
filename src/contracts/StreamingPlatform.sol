// contract StreamingPlatform {
//     // ... other contract code ...

//     event PaymentProcessed(address user, uint256 movieId, uint256 amount);

//     function processPayment(uint256 movieId) public payable {
//         require(msg.value > 0, "Payment amount must be greater than 0");
//         // Add your payment processing logic here
//         emit PaymentProcessed(msg.sender, movieId, msg.value);
//     }
// }
// SPDX-License-Identifier: MIT

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


interface StreamingPlatform {
    function addContent(
        uint256 _pricePerSecond,
        uint256 _flatPrice,
        string calldata _contentUri
    ) external returns (uint256);

    function startStream(uint256 _contentId) external;

    function pauseStream(uint256 _contentId) external;

    function getContentUri(
        uint256 _contentId
    ) external view returns (string memory);

    function getStreamSession(
        uint256 _contentId,
        address user
    )
        external
        view
        returns (
            uint256 startTime,
            uint256 lastUpdateTime,
            bool isActive,
            uint256 totalPaid
        );

    function getContentPricing(
        uint256 contentId
    )
        external
        view
        returns (uint256 pricePerSecond, uint256 flatPrice, bool isActive);

    function getContentCreator(
        uint256 contentId
    ) external view returns (address creator);
    function processPayment(uint256 _contentId) external payable;
    function updateWatchTime(uint256 _contentId, uint256 _duration) external;

    // Add this event
    event PaymentProcessed(
        address indexed user,
        uint256 indexed contentId,
        uint256 amount
    );

    function addPendingPayment(address user, uint256 amount) external;
}
