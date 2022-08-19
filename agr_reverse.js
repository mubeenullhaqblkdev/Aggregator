const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const fs = require("fs");
const endpoint = "https://rpc-juno.itastakers.com:443/";
const alice = {
  mnemonic:
    "absorb runway above solar repair era easy there coconut defense quick north",
  address0: "juno13nnfxu45u7t6z9g47l7vpp7ukhspvkcypyq5wc",
};
async function main() {
  const gasPrice = GasPrice.fromString("0.1ujuno");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, {
    prefix: "juno",
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    endpoint,
    wallet
  );
  var inputAmount = "500000";
  var highestProfit = 0;
  let i = 0;
  while (true) {
    console.log("Iteration No. ", i, " With input Amount :", inputAmount);
    let txUSDC_JUNO = await client.queryContractSmart(
      "juno1vfth4847u029a4v9vaa34qgjfjhmj8t5qq7dmjshsd3lqj376cvqp2us0a",
      {
        simulation: {
          offer_asset: {
            amount: inputAmount,
            info: {
              native_token: {
                denom:
                  "ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034",
              },
            },
          },
        },
      }
    );

    let txJUNO_LOOP = await client.queryContractSmart(
      "juno1kp85zceq6c95zt2ky3q6r7nukmr047meege6cvxcm9uw7y60vnlqjqeceh",
      {
        simulation: {
          offer_asset: {
            amount: txUSDC_JUNO.return_amount,
            info: {
              native_token: {
                denom: "ujuno",
              },
            },
          },
        },
      }
    );

    let txLOOP_USDC = await client.queryContractSmart(
      "juno1g9galrr7y3s8lcjur3l3fs59m7nqrsh79xs7en9hqa4ws6wr4nrqmszp26",
      {
        simulation: {
          offer_asset: {
            amount: txJUNO_LOOP.return_amount,
            info: {
              token: {
                contract_addr:
                  "juno1k44sxczxd6lutsyyrkr35jy53m456mk747pwprffev5nakqt5nrsm8ct7j",
              },
            },
          },
        },
      }
    );
    console.log("USDC To JUNO: ", txUSDC_JUNO.return_amount);
    console.log("JUNO to LOOP", txJUNO_LOOP.return_amount);
    console.log("LOOP to USDC", txLOOP_USDC.return_amount);
    let profit = txLOOP_USDC.return_amount - inputAmount;
    //    if (parseFloat(inputAmount) <= parseFloat(txLOOP_USDC.return_amount)
    if (profit > highestProfit) {
      inputAmount = parseFloat(inputAmount) + 100000;
      inputAmount = inputAmount.toString();
      highestProfit = profit;
      i++;
      console.log("Profit Amount: ", highestProfit);
      console.log("\n \n \n");
    } else {
      break;
    }
  }
  console.log("\n\n\nHighest Profit is: ", highestProfit);
  //   let txUSDC_LOOP = await client.queryContractSmart(
  //     "juno1g9galrr7y3s8lcjur3l3fs59m7nqrsh79xs7en9hqa4ws6wr4nrqmszp26",
  //     {
  //       simulation: {
  //         offer_asset: {
  //           amount: "500000",
  //           info: {
  //             native_token: {
  //               denom:
  //                 "ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034",
  //             },
  //           },
  //         },
  //       },
  //     }
  //   );

  //   let txLOOP_JUNO = await client.queryContractSmart(
  //     "juno1kp85zceq6c95zt2ky3q6r7nukmr047meege6cvxcm9uw7y60vnlqjqeceh",
  //     {
  //       simulation: {
  //         offer_asset: {
  //           amount: txUSDC_LOOP.return_amount,
  //           info: {
  //             token: {
  //               contract_addr:
  //                 "juno1k44sxczxd6lutsyyrkr35jy53m456mk747pwprffev5nakqt5nrsm8ct7j",
  //             },
  //           },
  //         },
  //       },
  //     }
  //   );

  //   let txJUNO_USDC = await client.queryContractSmart(
  //     "juno1vfth4847u029a4v9vaa34qgjfjhmj8t5qq7dmjshsd3lqj376cvqp2us0a",
  //     {
  //       simulation: {
  //         offer_asset: {
  //           amount: txLOOP_JUNO.return_amount,
  //           info: {
  //             native_token: {
  //               denom: "ujuno",
  //             },
  //           },
  //         },
  //       },
  //     }
  //   );

  //for taking info about a token
  let tx3 = await client.queryContractSmart(
    "juno1k44sxczxd6lutsyyrkr35jy53m456mk747pwprffev5nakqt5nrsm8ct7j",
    {
      token_info: {},
    }
  );

  // console.log(tx3);
}
main();
