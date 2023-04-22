## 需求

1、质押合约去掉Token的mint，改成从某个账户提币用于奖励
2、修改pancakeswap的pair合约的swap函数，将原来奖励给流动性提供者的0.25%改为0.15% + 0.05%
其中0.15%给流动性提供者，另外0.05%拆成三部分，分别是给feeTo 0.01%，feeTo2 0.02%，feeTo3 0.02%

## 本地调试步骤（模拟swap前端操作）

1、启动ganache，端口8545，networkID 1337
2、yarn
3、npx hardhat run scripts/deploy1.js
4、npx hardhat run scripts/deploy2.js
5、本地部署请忽略末尾的合约验证提示


## 如何部署到bsc测试网？

1、保证hardhat.config.js中的defaultAccount有足够的测试网代币，不够去这里领（https://testnet.bnbchain.org/faucet-smart）
2、npx hardhat run scripts/deploy1.js --network bsctestnet
3、npx hardhat run scripts/deploy2.js --network bsctestnet
4、复制末尾的验证命令粘贴到窗口进行合约验证

## 注意

1、.env文件不要删不要改，用于缓存的
