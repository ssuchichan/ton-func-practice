import { compile, NetworkProvider } from "@ton-community/blueprint";
import { MainContract } from "../wrappers/MainContract";
import { address, toNano } from "ton-core";

export async function run(provider: NetworkProvider) {
  const codeCell = await compile("MainContract");
  const myContract = MainContract.createFromConfig({
    number: 0,
    address: address("0QB2BrCS0BHNhfemSyVQHLiCiTFgtaMnmKeCxfrHsx93GGJW"),
    ownerAddress: address("0QB2BrCS0BHNhfemSyVQHLiCiTFgtaMnmKeCxfrHsx93GGJW"),
  }, codeCell);

  const opendedContract = provider.open(myContract);

  opendedContract.sendDeploy(provider.sender(), toNano(0.05));

  await provider.waitForDeploy(myContract.address);
}









