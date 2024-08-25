import { Cell, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import "@ton-community/test-utils";
import { compile } from "@ton-community/blueprint";

describe("main.fc contracts tests", () => {
    let blockchain: Blockchain;
    let myContract: SandboxContract<MainContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let ownerWallet: SandboxContract<TreasuryContract>;
    let codeCell: Cell;
    beforeAll(async () => {
        codeCell = await compile("MainContract");
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        initWallet = await blockchain.treasury("initWallet");
        ownerWallet = await blockchain.treasury("ownerWallet");

        myContract = blockchain.openContract(
            await MainContract.createFromConfig({
                number: 0,
                address: initWallet.address,
                ownerAddress: ownerWallet.address,
            }, 
            codeCell)
        );
    });


    it("should successfully increase counter in contract and get the proper most recent sender address", async() => {
        const senderWallet = await blockchain.treasury("sender");
        const sentMessageResult = await myContract.sendIncrement(senderWallet.getSender(), toNano("0.05"), 5);

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
        expect(data.number).toEqual(5);

    });

    it("successfully deposits funds", async () => {
        const senderWallet = await blockchain.treasury("sender");
        const depositMessageResult = await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));
        expect(depositMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address, 
            to: myContract.address, 
            success: true
        });

        const balanceResult = await myContract.getBalance();
        expect(balanceResult.balance).toBeGreaterThan(toNano("4.99"));
    });

    it("should return deposit funds as no command is sent", async () => {
        const senderWallet = await blockchain.treasury("sender");
        const sendNoCodeDepositResult = await myContract.sendNoCodeDeposit(senderWallet.getSender(), toNano("5"));
        expect(sendNoCodeDepositResult.transactions).toHaveTransaction({
            from: senderWallet.address, 
            to: myContract.address, 
            success: false
        });

        const balanceResult = await myContract.getBalance();
        expect(balanceResult.balance).toEqual(0);
    });

    it("successfully withdraws funds on behalf of owner", async () => {
        const senderWallet = await blockchain.treasury("sender");
        
        await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

        const withdrawalResult = await myContract.sendWithdrawalRequest(
            ownerWallet.getSender(), 
            toNano("0.05"), 
            toNano("1")
        );

        expect(withdrawalResult.transactions).toHaveTransaction({
            from: myContract.address, 
            to: ownerWallet.address, 
            success: true,
            value: toNano(1)
        });
    });

    it("fails to withdraw funds on behalf of non-owner", async () => {
        const senderWallet = await blockchain.treasury("sender");
        
        await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

        const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
            senderWallet.getSender(), 
            toNano("0.05"), 
            toNano("1")
        );

        expect(withdrawalRequestResult.transactions).toHaveTransaction({
            from: senderWallet.address, 
            to: myContract.address, 
            success: false,
            exitCode: 103
        });
    });

    it("fails to withdraw funds because lack of balance", async () => {
        const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
            ownerWallet.getSender(), 
            toNano("0.05"), 
            toNano("1")
        );
        
        expect(withdrawalRequestResult.transactions).toHaveTransaction({
            from: ownerWallet.address, 
            to: myContract.address, 
            success: false,
            exitCode: 104
        });
    });
});





