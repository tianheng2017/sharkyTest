const hre = require("hardhat");
const ethers = hre.ethers;
const sharkyTokenJson = require("../artifacts/contracts/SharkyToken.sol/SharkyToken.json");
const sharkyFactoryJson = require("../artifacts/contracts/SharkyFactory.sol/SharkyFactory.json");
const sharkyPairJson = require("../artifacts/contracts/SharkyPair.sol/SharkyPair.json");

async function main() {
    const SharkyRouter = await ethers.getContractFactory("SharkyRouter");

    const accounts = await ethers.getSigners();
    console.log("\n");

    // 获取其他合约实例
    const sharkyToken = await ethers.getContractAt(sharkyTokenJson.abi, process.env.AAA);
    const sharkyToken2 = await ethers.getContractAt(sharkyTokenJson.abi, process.env.BBB);
    const sharkyFactory = await ethers.getContractAt(sharkyFactoryJson.abi, process.env.Factory);

    // 部署路由合约
    const sharkyRouter = await SharkyRouter.deploy(process.env.Factory, process.env.WBNB);
    await sharkyRouter.deployed();
    console.log("Router: ", sharkyRouter.address, "\n");

    // AAA、BBB授权路由合约
    await sharkyToken.approve(sharkyRouter.address, ethers.utils.parseEther("100000000"));
    await sharkyToken2.approve(sharkyRouter.address, ethers.utils.parseEther("100000000"));

    // 查询AAA授权金额
    const allowanceAAA = await sharkyToken.allowance(accounts[0].address, sharkyRouter.address);
    console.log("AAA授权路由: ", ethers.utils.formatEther(allowanceAAA));
    // 查询BBB授权金额
    const allowanceBBB = await sharkyToken2.allowance(accounts[0].address, sharkyRouter.address);
    console.log("BBB授权路由: ", ethers.utils.formatEther(allowanceBBB), "\n");

    // 添加AAA-BBB流动性
    await sharkyRouter.addLiquidity(
        sharkyToken.address,
        sharkyToken2.address,
        ethers.utils.parseEther("1000000"),
        ethers.utils.parseEther("1000000"),
        0,
        0,
        accounts[0].address,
        9999999999,
    );
    console.log("向AAA-BBB池子分别添加1000000个AAA和1000000个BBB\n");

    // 获取Pair
    const pairAAABBB = await sharkyFactory.getPair(sharkyToken.address, sharkyToken2.address);
    // 实例化Pair
    const sharkyPair = await ethers.getContractAt(sharkyPairJson.abi, pairAAABBB);
    console.log("Pair AAA-BBB: ", pairAAABBB);

    // 查询池子情况
    const reserves = await sharkyPair.getReserves();
    console.log("池子AAA储备: ", ethers.utils.formatEther(reserves[0]));
    console.log("池子BBB储备: ", ethers.utils.formatEther(reserves[1]), "\n");

    // 测试AAA 兑换 BBB
    await sharkyRouter.swapExactTokensForTokens(
        ethers.utils.parseEther("10000"),
        0,
        [sharkyToken.address, sharkyToken2.address],
        accounts[0].address,
        9999999999,
        { gasLimit: 300000 }
    );
    console.log("10000个AAA兑换BBB成功");

    // 测试BBB 兑换 AAA
    await sharkyRouter.swapExactTokensForTokens(
        ethers.utils.parseEther("10000"),
        0,
        [sharkyToken2.address, sharkyToken.address],
        accounts[0].address,
        9999999999,
        { gasLimit: 300000 }
    );
    console.log("10000个BBB兑换AAA成功", "\n");

    // 查看account[1]的AAA余额
    const balance = await sharkyToken.balanceOf(accounts[1].address);
    console.log("检查account[1]是否获得每次swap的0.02%，当前AAA余额为: ", ethers.utils.formatEther(balance), "\n");

    console.log("bscscantest合约验证脚本: ",
        `
        npx hardhat verify --network bsctestnet "${process.env.AAA}" "AAA" "AAA"
        npx hardhat verify --network bsctestnet "${process.env.BBB}" "BBB" "BBB"
        npx hardhat verify --network bsctestnet "${process.env.WBNB}"
        npx hardhat verify --network bsctestnet "${process.env.Factory}" "${accounts[0].address}"
        npx hardhat verify --network bsctestnet "${sharkyRouter.address}" "${process.env.Factory}" "${process.env.WBNB}"
        `,
        "\n"
    )
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });