// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract TokenPresale is Ownable {
    AggregatorV3Interface internal priceFeed;
    IERC20 public token;
    uint256 public tokenPerPrice = 0.00001 ether;
    uint256 public tokensSold;
    bool public presaleActive;
    address private presaleWallet;
    uint256 public presaleCap;
    bool public presaleEnded = false;
    IERC20 public USDT = IERC20(0x3273832fF31dfd5833b0875fa0cf42f0CD7bF875);

    event TokensPurchased(address indexed buyer, uint256 amount);
    event PresaleEnded();
    event PresalePaused();
    event PresaleActivated();

    constructor(
        IERC20 _token,
        address _presaleWallet
    ) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(
            0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1
        );
        token = _token;
        presaleActive = true;
        presaleCap = 1e30;
        presaleWallet = _presaleWallet;
        emit PresaleActivated();
    }

    function getUSDTPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function getTokenPriceUSDT() public view returns (uint256) {
        return ((getUSDTPrice() * tokenPerPrice) / 1e8) / 1e12; // for 6 decimal USDT
        // return (getUSDTPrice() * tokenPerPrice) / 1e8;
    }

    function activatePresale() public onlyOwner {
        presaleActive = true;
        emit PresaleActivated();
    }

    function buyTokens(uint256 _amount, bool useUSDT) public payable {
        require(!presaleEnded, "Presale has ended!");
        require(presaleActive, "Presale is not active.");
        require(
            token.allowance(presaleWallet, address(this)) >= _amount * 1e18 &&
                token.balanceOf(presaleWallet) >= _amount * 1e18,
            "Not enough tokens available."
        );
        require(tokensSold + _amount <= presaleCap, "Presale Cap Breached!");
        if (!useUSDT) {
            require(
                msg.value == _amount * tokenPerPrice,
                "Incorrect POL value sent."
            );
        } else {
            uint256 tokenPriceUSDT = getTokenPriceUSDT() * _amount;
            require(
                USDT.allowance(msg.sender, address(this)) >= tokenPriceUSDT,
                "Not enough USDT allowance."
            );
            require(
                USDT.balanceOf(msg.sender) >= tokenPriceUSDT,
                "Not enough USDT balance."
            );
            USDT.transferFrom(msg.sender, presaleWallet, tokenPriceUSDT);
        }
        token.transferFrom(presaleWallet, msg.sender, _amount * 1e18);
        tokensSold += _amount * 1e18;

        emit TokensPurchased(msg.sender, _amount * 1e18);
    }

    function endPresale() public onlyOwner {
        presaleEnded = true;
        emit PresaleEnded();
    }

    function pausePresale() public onlyOwner {
        presaleActive = false;
        emit PresalePaused();
    }

    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function changePresalePrice(uint256 price) public onlyOwner {
        tokenPerPrice = price;
    }

    function amountAvailableForPresale() public view returns (uint256) {
        return presaleCap - tokensSold;
    }
}
