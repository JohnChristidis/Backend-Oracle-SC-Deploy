const {network, ethers} = require("hardhat");
const {abi} = require(".././artifacts/contracts/ComplaintService.sol/ComplaintService.json")


async function callAPI(companyData, workerData, lat, long, address){
    const element = await checkDatabase(companyData, workerData, lat, long, address);
    if(element != false){
      console.log("element : ",  element);
    }
}

function checkDatabase(companyData, workerData, lat, long, address) {
  console.log("Complaint from worker detected");
  console.log("Starting validation process");
  console.log("(1) Checking if sender works and is inside the company");
  for (let i = 0; i < companyData.length; i++) {
    const company = companyData[i];
    if (
      Math.abs(parseFloat(company.lat) - parseFloat(lat)) <=1 &&
      Math.abs(parseFloat(company.long) - parseFloat(long)) <=1 &&
      company.addresses.includes(address)
    ) {
      console.log("Worker is inside the company");

      const worker = workerData.workers.find(worker => worker.addressOfWorker === address);
      if (!worker) {
        console.log(address);
        console.log(worker.addressOfWorker);
        console.log("Worker does not have an address");
        return false;
      }
      console.log("(2) Checking if worker's hours are reported");
      const currentDate = new Date();
      const lastEndDateTime = new Date(worker.endOfSession[worker.endOfSession.length - 1]);

      if (currentDate > lastEndDateTime) {
        const lastStartDateTime = new Date(worker.startOfSession[worker.startOfSession.length - 1]);
        if (lastStartDateTime < lastEndDateTime) {
          console.log("Hours not reported");
          return [company.name, company.id, company.NoW];
        }
      }
      console.log("Hours reported");
      return false;
    }
  }
  console.log("Sender is not in the company");
  return false;

}

const companyData = [
  {
    "id": 1,
    "name": "Company 1",
    "NoW": 7,
    "addresses": ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", //3
                  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",//4
                  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",//5
                  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",//6
                  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",//7
                  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",//8
                  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",//9
                ],
                "lat": "37.96884",
                "long": "23.6467612"
  },
  {
    "id": 2,
    "name": "Company 2",
    "NoW": 5,
    "addresses": ["0xBcd4042DE499D14e55001CcbB24a551F3b954096",//10
                  "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",//11
                  "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",//12
                  "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",//13
                  "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097"//14
                ],
                "lat": "37.96884",
                "long": "23.6467612"

  }
];
const workerData = {
  "workers": [
    {
      "addressOfWorker": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-07-19 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
    {
      "addressOfWorker": "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
      "startOfSession": [
        "2023-05-16 09:00",
        "2023-05-17 10:30",
        "2023-05-18 08:45"
      ],
      "endOfSession": [
        "2023-05-16 17:00",
        "2023-05-17 14:15",
        "2023-05-18 18:30"
      ]
    },
  ]
};


async function main() {
  const { oracle } = await getNamedAccounts()
  const complaintService = await ethers.getContract("ComplaintService", oracle)

  console.log("Oracle Started");

  complaintService.on("MakeComplaint", async (_user, _lat, _long, _id) => {
    const company = await checkDatabase(companyData, workerData, _lat, _long, _user);
    if (company != false) {
      const transactionResponseComplaint = await complaintService.validateComplaint(_id - 1, company[0], company[1], Math.floor(company[2] / 5))
      const transactionReceiptComplaint = await transactionResponseComplaint.wait()
    }
  });
}

main();
