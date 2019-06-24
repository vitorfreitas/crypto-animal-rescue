pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;


contract AnimalsDonate {
    struct DonateModel{
        bytes imgAndTextData;
        uint valueRequest;
    }
    struct DonareResultModel{
        uint id;
        address owner;
        bytes imgAndTextData;
        uint valueRequest;
        uint valueFunded;
        uint balanceDonate;
    }
    uint idDonate;
    mapping(uint => DonateModel) donateList;
    mapping(uint => address) public donateOwner;
    mapping(uint => uint) public valueDonate;
    mapping(uint => uint) public balanceDonate;


    function newDonate(DonateModel memory _data)public{
        donateList[idDonate] = _data;
        donateOwner[idDonate] = msg.sender;
        idDonate += 1;
    }

    function donateValue(uint _id)public payable{
        valueDonate[_id] += msg.value;
        balanceDonate[_id] += msg.value;

    }
    
    modifier onlyDonateOwner(uint _id, address _sender){
        require(donateOwner[_id] == _sender);
        _;
    }

    modifier onlyPositiveBalance(uint _id){
        require(balanceDonate[_id] > 0);
        _;
    }
    
    function withdrawDonate(uint _id)public onlyDonateOwner(_id, msg.sender) onlyPositiveBalance(_id){
        uint amount = balanceDonate[_id];
        balanceDonate[_id] = 0;
        msg.sender.transfer(amount);
    }
    
    function getDonateObjects()public view returns(DonareResultModel[] memory){
        DonareResultModel[] memory result = new DonareResultModel[](idDonate);
        for(uint i = 0; i < idDonate; i++) {
            result[i].id = i;
            result[i].owner = donateOwner[i];
            result[i].imgAndTextData = donateList[i].imgAndTextData;
            result[i].valueRequest = donateList[i].valueRequest;
            result[i].valueFunded = valueDonate[i];
            result[i].balanceDonate = balanceDonate[i];
        }
        return result;
    }



}