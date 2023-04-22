// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./sources/ERC20.sol";

contract SharkyToken is ERC20 {

    address public provider;
    address public masterChef;

    modifier onlyMasterChef {
        require(msg.sender == masterChef, "caller is not the masterChef contract");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        provider = msg.sender;
        _mint(msg.sender, 100000000 * 1e18);
    }

    function setMasterChef(address _masterChef) public onlyOwner {
        masterChef = _masterChef;
    }

    function safeSharkyTransfer(address _to, uint256 _amount) public onlyMasterChef {
        uint256 sharkBal = balanceOf(provider);
        require(sharkBal > 0, "Provider's balance is depleted");
        if (_amount > sharkBal) {
            transferFrom(provider, _to, sharkBal);
        } else {
            transferFrom(provider, _to, _amount);
        }
    }
}