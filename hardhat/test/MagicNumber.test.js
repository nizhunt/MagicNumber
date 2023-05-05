const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");

describe("Magic Number Test 1:", function () {
  let MagicNumberContract, magicNumberContract;
  let deployer, sender1, sender2, sender3;

  // Setup
  before(async () => {
    [deployer, sender1, sender2, sender3] = await ethers.getSigners();
    MagicNumberContract = await ethers.getContractFactory("MagicNumber");
    magicNumberContract = await MagicNumberContract.deploy();
    await magicNumberContract.deployed();
  });

  describe("setting one magicNumber", async () => {
    it("Sets a magic number successfully", async () => {
      await magicNumberContract
        .connect(sender1)
        .setNumber(ethers.utils.parseEther("50.55"));

      expect(await magicNumberContract.magicNumber(sender1.address)).to.equal(
        ethers.utils.parseEther("50.55")
      );
    });
    it("sets correct MagicSum", async () => {
      const res = await magicNumberContract.getMagicStats();
      expect(res[0]).to.equal(ethers.utils.parseEther("50.55"));
    });
    it("sets correct participant count", async () => {
      const res = await magicNumberContract.getMagicStats();
      expect(res[1]).to.equal(1);
    });
  });
});

describe("Magic Number Test 2:", function () {
  let MagicNumberContract, magicNumberContract;
  let deployer, sender1, sender2, sender3;

  // Setup
  before(async () => {
    [deployer, sender1, sender2, sender3] = await ethers.getSigners();
    MagicNumberContract = await ethers.getContractFactory("MagicNumber");
    magicNumberContract = await MagicNumberContract.deploy();
    await magicNumberContract.deployed();
  });

  describe("setting multiple magicNumbers with different accounts", async () => {
    it("Sets multiple magic numbers successfully", async () => {
      await magicNumberContract
        .connect(sender1)
        .setNumber(ethers.utils.parseEther("50.55"));

      await magicNumberContract
        .connect(sender2)
        .setNumber(ethers.utils.parseEther("100.55"));

      await magicNumberContract
        .connect(sender3)
        .setNumber(ethers.utils.parseEther("650.55"));

      expect(await magicNumberContract.magicNumber(sender1.address)).to.equal(
        ethers.utils.parseEther("50.55")
      );
      expect(await magicNumberContract.magicNumber(sender2.address)).to.equal(
        ethers.utils.parseEther("100.55")
      );
      expect(await magicNumberContract.magicNumber(sender3.address)).to.equal(
        ethers.utils.parseEther("650.55")
      );
    });
    it("sets correct MagicSum", async () => {
      const res = await magicNumberContract.getMagicStats();
      const magicSum = 50.55 + 100.55 + 650.55;
      expect(res[0]).to.equal(ethers.utils.parseEther(magicSum.toString()));
    });
    it("sets correct participant count", async () => {
      const res = await magicNumberContract.getMagicStats();
      expect(res[1]).to.equal(3);
    });
  });
});

describe("Magic Number Test 3:", function () {
  let MagicNumberContract, magicNumberContract;
  let deployer, sender1, sender2, sender3;

  // Setup
  before(async () => {
    [deployer, sender1, sender2, sender3] = await ethers.getSigners();
    MagicNumberContract = await ethers.getContractFactory("MagicNumber");
    magicNumberContract = await MagicNumberContract.deploy();
    await magicNumberContract.deployed();
  });

  describe("setting multiple magicNumbers with same account", async () => {
    it("Sets multiple magic number successfully", async () => {
      await magicNumberContract
        .connect(sender1)
        .setNumber(ethers.utils.parseEther("50.55"));

      expect(await magicNumberContract.magicNumber(sender1.address)).to.equal(
        ethers.utils.parseEther("50.55")
      );

      await magicNumberContract
        .connect(sender1)
        .setNumber(ethers.utils.parseEther("100.55"));

      expect(await magicNumberContract.magicNumber(sender1.address)).to.equal(
        ethers.utils.parseEther("100.55")
      );

      await magicNumberContract
        .connect(sender1)
        .setNumber(ethers.utils.parseEther("650.55"));

      expect(await magicNumberContract.magicNumber(sender1.address)).to.equal(
        ethers.utils.parseEther("650.55")
      );
    });
    it("sets correct MagicSum", async () => {
      const res = await magicNumberContract.getMagicStats();
      const magicSum = 650.55;
      expect(res[0]).to.equal(ethers.utils.parseEther(magicSum.toString()));
    });
    it("sets correct participant count", async () => {
      const res = await magicNumberContract.getMagicStats();
      expect(res[1]).to.equal(1);
    });
  });
});

describe("Magic Number Test 4:", function () {
  let MagicNumberContract, magicNumberContract;
  let deployer, sender1, sender2, sender3;

  // Setup
  before(async () => {
    [deployer, sender1, sender2, sender3] = await ethers.getSigners();
    MagicNumberContract = await ethers.getContractFactory("MagicNumber");
    magicNumberContract = await MagicNumberContract.deploy();
    await magicNumberContract.deployed();
  });

  describe("Trying to overflow magicSum", async () => {
    it("stores the largest uint256 number", async () => {
      await magicNumberContract
        .connect(sender1)
        .setNumber(ethers.constants.MaxUint256);
      expect(await magicNumberContract.magicNumber(sender1.address)).to.equal(
        ethers.constants.MaxUint256
      );
    });

    it("reverts with panic on overflow", async () => {
      await expect(
        magicNumberContract
          .connect(sender2)
          .setNumber(ethers.utils.parseEther("1"))
      ).to.be.revertedWithPanic(PANIC_CODES.ARITHMETIC_UNDER_OR_OVERFLOW);
    });
  });
});
