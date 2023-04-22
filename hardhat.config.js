require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "ganache",
    networks: {
        ganache: {
            chainId: 1337,
            url: "http://127.0.0.1:8545",
            accounts: [
                'b65e6473c86de712155a3da45ad1f00581dace03ee1d95217720e01cd5f50bf0',
                '7307648ced1fd0b3c929d00269de6047c747556213effb4620bd42d3d6700345',
                '0x1b7aabd998f0f812453258d919c451066964cea287bb339ed25c52e868a0dfc0',
            ],
            defaultAccount: 'b65e6473c86de712155a3da45ad1f00581dace03ee1d95217720e01cd5f50bf0',
        },
        bsctestnet: {
            url: "https://data-seed-prebsc-1-s3.binance.org:8545",
            accounts: [
                'b65e6473c86de712155a3da45ad1f00581dace03ee1d95217720e01cd5f50bf0',
                '7307648ced1fd0b3c929d00269de6047c747556213effb4620bd42d3d6700345',
                '0x1b7aabd998f0f812453258d919c451066964cea287bb339ed25c52e868a0dfc0',
            ],
            defaultAccount: 'b65e6473c86de712155a3da45ad1f00581dace03ee1d95217720e01cd5f50bf0',
        },
        bscmainnet: {
            url: "https://bsc-dataseed.binance.org/",
            accounts: [
                'b65e6473c86de712155a3da45ad1f00581dace03ee1d95217720e01cd5f50bf0',
                '7307648ced1fd0b3c929d00269de6047c747556213effb4620bd42d3d6700345',
                '0x1b7aabd998f0f812453258d919c451066964cea287bb339ed25c52e868a0dfc0',
            ],
            defaultAccount: 'b65e6473c86de712155a3da45ad1f00581dace03ee1d95217720e01cd5f50bf0',
        }
    },
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999
                    }
                }
            },
            {
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999
                    }
                }
            },
            {
                version: "0.4.18",
                settings: {
                    optimizer: {
                        enabled: false,
                        runs: 200
                    }
                }
            },
        ],
    },
    etherscan: {
        apiKey: "WRIA3TSVFBPXHTNHYH8D8KKX4HAFVHPDV8"
    }
};
