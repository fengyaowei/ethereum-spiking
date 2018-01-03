import $ from 'jquery';
import Web3 from 'web3';

// Instance Web3 using localhost testrpc
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// mytoken.json是通过solc编译mytoke.sol之后得出的文件
const myTokenContractABI = require('./MyToken.json');
const MyTokenContract = web3.eth.contract(myTokenContractABI); // 获得合约对象

// 展示部署合约内账户及代币
const synchSmartContract = () => {
  let contractAddress = $('#contract-address').val();
  let contractInstance = MyTokenContract.at(contractAddress); // 根据部署地址，获得合约对象

  $('#my-token-balances').html("");
  web3.eth.accounts.forEach(address => {
    let tokens = contractInstance.balanceOf.call(address);// 账户代币余额-call
    $('#my-token-balances').append(`<p><span class="address">${address}</span> | <span class="balance">Tokens ${tokens}</span></p>`);
  });
};

// 展示部署合约内账户及Ether
const synchAccounts = () => {
  $('#gas-price').html(`<b>Gas: ETH ${web3.eth.gasPrice}</b>`);
  $('#default-account').html(`<b>Default Account: ${web3.eth.defaultAccount}</b>`);
  $('#accounts').html("");
  web3.eth.accounts.forEach(account => {
    let balance = web3.eth.getBalance(account);
    $('#accounts').append(`<p><a href="#" class="from">from</a> <a href="#" class="to">to</a> <span class="address">${account}</span> | <span class="balance">ETH ${balance}</span></p>`);
  });
};

// This callback just avoids us to copy & past every time you want to use an address
const updateAddressFromLink = (event, inputSelector) => {
  event.preventDefault();
  $(inputSelector).val($(event.target).siblings(".address").text());
};

// Every time we click a transaction we will look for its details into the blockchain
const updateTransactionInfoFromLink = event => {
  event.preventDefault();
  let transactionHash = $(event.target).text();
  web3.eth.getTransaction(transactionHash, function(error, transactionInfo) {
    if(error) $("#errors").text(error);
    else {
      $("#transaction-info").find("#hash").text(transactionInfo.hash);
      $("#transaction-info").find("#nonce").text(transactionInfo.nonce);
      $("#transaction-info").find("#block-hash").text(transactionInfo.blockHash);
      $("#transaction-info").find("#block-number").text(transactionInfo.blockNumber);
      $("#transaction-info").find("#gas-usage").text(transactionInfo.gas);
      $("#transaction-info").find("#transaction-index").text(transactionInfo.transactionIndex);
      $("#transaction-info").find("#from").text(transactionInfo.from);
      $("#transaction-info").find("#to").text(transactionInfo.to);
      $("#transaction-info").find("#value").text(transactionInfo.value);
    }
  });
};

// Show initial accounts state and initialize callback triggers
synchAccounts();
$(document).on('change', '#contract-address', e => synchSmartContract());
$(document).on('click', '.from', e => updateAddressFromLink(e, '#seller-address'));
$(document).on('click', '.to', e => updateAddressFromLink(e, '#buyer-address'));
$(document).on('click', '.transaction', e => updateTransactionInfoFromLink(e));

// 点击购买代币
$('#buy').click(() => {
  let buyingAmount = $('#buying-amount').val();
  let buyerAddress = $('#buyer-address').val();
  let sellerAddress = $('#seller-address').val();
  let contractAddress = $('#contract-address').val();

  let contractInstance = MyTokenContract.at(contractAddress);// 根据部署地址，获得合约对象
  let transactionHash = contractInstance.sendTokens(buyerAddress, buyingAmount, { from: sellerAddress });//合约对象调用方法，构造发送者
  $("#transaction-hash").text(`Tx Hash: ${transactionHash}`);
  $('#transactions-list').append(`<p><a href="#" class="transaction">${transactionHash}</a></p>`);
  synchSmartContract();
  synchAccounts();
});
