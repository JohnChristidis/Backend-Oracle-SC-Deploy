
const { network, ethers } = require("hardhat")
const { authoritiesAbi, authoritiesAddress, oracleAbi, oracleAddress } = require('.././utils/contracts')

const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
     const { deployer,oracle, authority } = await getNamedAccounts()
     const chainId = network.config.chainId

    let oracleService, authoritiesService
     oracleService = await ethers.getContract("OracleService", deployer)
     oracleServiceAddress = oracleService.address
     const transactionResponseOracle = await oracleService.setOracle(oracle)
     const transactionReceiptOracle = await transactionResponseOracle.wait()
     authoritiesService = await ethers.getContract("AuthoritiesService", deployer)
    authoritiesServiceAddress = authoritiesService.address
     const transactionResponseAuthorities = await authoritiesService.setAuthority(authority)
     const transactionReceiptAuthorities = await transactionResponseAuthorities.wait()


    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const complaintService = await deploy("ComplaintService", {
        from: deployer,
        args: [oracleServiceAddress, authoritiesServiceAddress],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })



    log("Complaints contact is deployed")
    const networkName = network.name == "hardhat" ? "localhost" : network.name
    log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "complaintService"]
