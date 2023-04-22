const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

async function main() {
    const SharkyToken = await ethers.getContractFactory("SharkyToken");
    const WBNB = await ethers.getContractFactory("WBNB");
    const SharkyFactory = await ethers.getContractFactory("SharkyFactory");

    const accounts = await ethers.getSigners();
    console.log("\n");

    // 路由部署成功后，更新路由INIT_CODE_PAIR_HASH
    replaceInFile(
        './contracts/libraries/SharkyLibrary.sol',
        process.env.INIT_CODE_PAIR_HASH,
        'af604c2fba4461b51586762526964a6eea170afdff9bc7252d536302d7b07674'
    );

    // 部署AAA、BBB、WBNB
    const sharkyToken = await SharkyToken.deploy("AAA", "AAA");
    await sharkyToken.deployed();
    console.log("\n", "AAA: ", sharkyToken.address);
    const sharkyToken2 = await SharkyToken.deploy("BBB", "BBB");
    await sharkyToken2.deployed();
    console.log("BBB: ", sharkyToken2.address);
    const wbnb = await WBNB.deploy();
    await wbnb.deployed();
    console.log("WBNB: ", wbnb.address);

    // 部署工厂合约
    const sharkyFactory = await SharkyFactory.deploy(accounts[0].address);
    await sharkyFactory.deployed();
    console.log("Factory: ", sharkyFactory.address, "\n");

    // 设置feeTo、feeTo2、feeTo3
    await sharkyFactory.setFeeTo(accounts[0].address, accounts[1].address, accounts[2].address);
    console.log("设置feeTo、feeTo2、feeTo3")

    // 获取INIT_CODE_PAIR_HASH
    const INIT_CODE_PAIR_HASH = await sharkyFactory.INIT_CODE_PAIR_HASH();
    console.log("INIT_CODE_PAIR_HASH: ", INIT_CODE_PAIR_HASH.slice(2));

    // 更新路由INIT_CODE_PAIR_HASH
    replaceInFile(
        './contracts/libraries/SharkyLibrary.sol', 
        'af604c2fba4461b51586762526964a6eea170afdff9bc7252d536302d7b07674', 
        INIT_CODE_PAIR_HASH.slice(2)
    );

    // 定义env数据
    const data = {
        AAA: sharkyToken.address,
        BBB: sharkyToken2.address,
        WBNB: wbnb.address,
        Factory: sharkyFactory.address,
        INIT_CODE_PAIR_HASH: INIT_CODE_PAIR_HASH.slice(2),
    };
    // 将数据转换成 .env 文件格式的字符串
    const envContent = Object.entries(data)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    // 写入 .env 文件
    fs.writeFileSync(".env", envContent);
    console.log(".env 文件已更新", "\n");
}

function replaceInFile(filePath, searchString, replaceString) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const newFileContent = fileContent.replace(searchString, replaceString);
    fs.writeFileSync(filePath, newFileContent);
    console.log(`已经成功将 "${searchString}" 替换为 "${replaceString}"`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });