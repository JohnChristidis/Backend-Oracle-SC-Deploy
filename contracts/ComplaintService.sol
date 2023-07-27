// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./OracleService.sol";
import "./AuthoritiesService.sol";


contract ComplaintService is Ownable {

    enum LocationStatus { NOT_ENOUGH_COMPLAINTS, UNDER_INVESTIGATION, UNDECLARED_WORK, DECLARED_WORK }

    uint public complaintCounter;
    uint public locationCounter;

    uint public COMPLAINT_LIMIT = 3 seconds;

    address oracleContractAddress;
    address authoritiesContractAddress;

    event MakeComplaint(address _user, string _lat, string _long, uint _complaintId);
    event ValidateComplaint(address _user, string _locationName, uint locationId, uint _complaintId);
    event CallTheAthorities(string _locationName, uint _locationId, uint _totalComplaintsPerDifferentUserPerLocation);
    event ChangeLocationStatus(uint _locationId, LocationStatus _locationStatus);

    struct Location {
        string locationName;
        uint locationId;
        LocationStatus locationStatus;
        uint totalComplaints;
        uint totalComplaintsPerDifferentUser;
    }

    struct Complaint {
        address user;
        bool validated;
    }

    mapping(uint => Complaint) public complaints;
    mapping(uint => Location) public locations;


    mapping(address => uint) public userLimit;
    mapping(address => uint) public totalComplaintsPerUser;


    constructor(address _oracleContractAddress,  address _authoritiesContractAddress){
        oracleContractAddress = _oracleContractAddress;
        authoritiesContractAddress = _authoritiesContractAddress;
    }

   function makeComplaint(string calldata _lat, string calldata _long) external{
       require(userLimit[msg.sender] <= block.timestamp, "(A) Only one complaint per day");
       userLimit[msg.sender] = block.timestamp + COMPLAINT_LIMIT;
       //complaintLocation[complaintCounter] = Location("", 0);
       complaints[complaintCounter] = Complaint(msg.sender, false);
       complaintCounter++;
       emit MakeComplaint(msg.sender, _lat, _long, complaintCounter);
   }



    function validateComplaint(uint _complaintId, string calldata _locationName, uint _locationId, uint _complaintLimit) external{
       OracleService oracleService = OracleService(oracleContractAddress);
       require(oracleService.checkIfOracle(msg.sender), "(1) Msg.sender is not an oracle");
       require(complaints[_complaintId].user != 0x0000000000000000000000000000000000000000, "(3) Complaint has not yet been done");
       require(complaints[_complaintId].validated == false, "(2) Complaint has already been validated");
       Complaint storage complaint = complaints[_complaintId];
       complaint.validated = true;
       uint id = locationCounter;
       for(uint i=0; i<locationCounter; i++){
           if(locations[i].locationId == _locationId){
               id = i;
           }
       }
       Location storage location = locations[id];
       location.locationName = _locationName;
       location.locationId = _locationId;
       location.totalComplaints = location.totalComplaints + 1;

        if(totalComplaintsPerUser[complaint.user] == 0){
            totalComplaintsPerUser[complaint.user] = totalComplaintsPerUser[complaint.user] + 1 ;
            location.totalComplaintsPerDifferentUser = location.totalComplaintsPerDifferentUser + 1;
            if(location.totalComplaintsPerDifferentUser > _complaintLimit){
                emit CallTheAthorities(location.locationName, _locationId, location.totalComplaintsPerDifferentUser);
                if(location.locationStatus != LocationStatus.UNDER_INVESTIGATION){
                    location.locationStatus = LocationStatus.UNDER_INVESTIGATION;
                }
            }
        } else {
            totalComplaintsPerUser[complaint.user] = totalComplaintsPerUser[complaint.user] + 1 ;
        }
        if(locationCounter == id){
            locationCounter++;
        }
       emit ValidateComplaint(msg.sender, location.locationName, _locationId, _complaintId);
   }

   function changeLocationStatus(uint _locationId, LocationStatus _locationStatus) external{
        AuthoritiesService authoritiesService = AuthoritiesService(authoritiesContractAddress);
        require(authoritiesService.checkIfAuthority(msg.sender), "(A) Msg.sender is not Authority");
        Location storage location = locations[_locationId];
        require(location.locationStatus == LocationStatus.UNDER_INVESTIGATION, "(B) The location is not under investigation");
        require(_locationStatus != LocationStatus.UNDER_INVESTIGATION && _locationStatus != LocationStatus.NOT_ENOUGH_COMPLAINTS, "(C) LocationStatus can only be Declared or Undeclare work");
        location.locationStatus = _locationStatus;
        emit ChangeLocationStatus(_locationId, _locationStatus);
   }

   function getLocation(uint _id) public view returns(uint, string memory, uint, LocationStatus, uint, uint){
       return(_id, locations[_id].locationName, locations[_id].locationId, locations[_id].locationStatus, locations[_id].totalComplaints, locations[_id].totalComplaintsPerDifferentUser);
   }



}
