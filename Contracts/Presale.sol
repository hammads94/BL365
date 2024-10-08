// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenPresale is Ownable {
    IERC20 public token;
    uint256 public tokenPerPrice = 0.001 ether;
    uint256 public tokensSold;
    bool public presaleActive;
    address private presaleWallet;
    uint256 public presaleCap;
    bool public presaleEnded = false;

    event TokensPurchased(address indexed buyer, uint256 amount);
    event PresaleEnded();
    event PresalePaused();
    event PresaleActivated();

    constructor(
        IERC20 _token,
        uint256 _presaleCap,
        address _presaleWallet
    ) Ownable(msg.sender) {
        token = _token;
        presaleActive = true;
        presaleCap = _presaleCap;
        presaleWallet = _presaleWallet;
        emit PresaleActivated();
    }

    function activatePresale() public onlyOwner {
        presaleActive = true;
        emit PresaleActivated();
    }

    function buyTokens(uint256 _amount) public payable {
        require(!presaleEnded, "Presale has ended!");
        require(presaleActive, "Presale is not active.");
        require(
            msg.value == _amount * tokenPerPrice,
            "Incorrect ETH value sent."
        );
        require(
            token.allowance(presaleWallet, address(this)) >= _amount * 1e18 &&
                token.balanceOf(presaleWallet) >= _amount * 1e18,
            "Not enough tokens available."
        );
        require(tokensSold + _amount <= presaleCap, "Presale Cap Breached!");

        token.transferFrom(presaleWallet, msg.sender, _amount * 1e18);
        tokensSold += _amount * 1e18;

        emit TokensPurchased(msg.sender, _amount * 1e18);
    }

    function endPresale() public onlyOwner {
        presaleEnded = false;
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
