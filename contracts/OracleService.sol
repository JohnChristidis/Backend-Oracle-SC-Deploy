// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OracleService is Ownable{

    event SetOracle(address _oracleAddress);
    event RemoveOracle(address _oracleAddress);

    mapping(address => bool) public isOracle;

    function setOracle(address _oracleAddress) external onlyOwner{
        require(_oracleAddress != address(0), "Oracle's address cannot be 0x0");
        require(!isOracle[_oracleAddress], "New address cannot be an oracle already");
        isOracle[_oracleAddress] = true;
        emit SetOracle(_oracleAddress);
    }

    function removeOracle(address _oracleAddress) external onlyOwner{
        require(isOracle[_oracleAddress], "Address must be an oracle already");
        isOracle[_oracleAddress] = false;
        emit RemoveOracle(_oracleAddress);
    }

    function checkIfOracle(address _oracleAddress) external view returns(bool) {
        return(isOracle[_oracleAddress]);
    }
}
