// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuthoritiesService is Ownable{

    event SetAuthority(address _authorityAddress);
    event RemoveAuthority(address _authorityAddress);

    mapping(address => bool) public isAuthority;

    function setAuthority(address _authorityAddress) external onlyOwner{
        require(_authorityAddress != address(0), "Oracle's address cannot be 0x0");
        require(!isAuthority[_authorityAddress], "New address cannot be an oracle already");
        isAuthority[_authorityAddress] = true;
        emit SetAuthority(_authorityAddress);
    }

    function removeAuthority(address _authorityAddress) external onlyOwner{
        require(isAuthority[_authorityAddress], "Address must be an oracle already");
        isAuthority[_authorityAddress] = false;
        emit RemoveAuthority(_authorityAddress);
    }

    function checkIfAuthority(address _authorityAddress) external view returns(bool) {
        return(isAuthority[_authorityAddress]);
    }
}
