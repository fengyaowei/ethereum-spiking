'use strict';
import $ from 'jquery';
import Web3 from 'web3';

// 使用本地testrpc开启的node初始化web3对象
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// 监测testrpc自带的10个100Ether账户及余额
const synchAccounts = () => {
  $('#accounts').html("");
  web3.eth.accounts.forEach(account => {
    let balance = web3.eth.getBalance(account); // 获得账户余额
    $('#accounts').append(`<p><a href="#" class="from">from</a> <a href="#" class="to">to</a> <span class="address">${account}</span> | <span class="balance">ETH ${balance}</span></p>`);
  });
};

// 记录地址，防止每次都复制、粘贴
const updateAddressFromLink = (event, inputSelector) => {
  event.preventDefault();
  $(inputSelector).val($(event.target).siblings(".address").text());
};

// 账号及余额列表，初始化发送者地址、接收者地址
synchAccounts();
$(document).on('click', '.from', e => updateAddressFromLink(e, '#sender-address'));
$(document).on('click', '.to', e => updateAddressFromLink(e, '#recipient-address'));

// 发送Ether，查看交易信息
$('#send-ether').click(() => {
  let from = $('#sender-address').val(); // 发送者账号
  let to = $('#recipient-address').val(); // 接受者账号
  let amount = $('#amount').val(); // 发送数量（wei）
  let transaction = { from: from, to: to, value: amount }; // 传输体
  console.log(`Sending transaction... ${JSON.stringify(transaction)}`); // log
  web3.eth.sendTransaction(transaction, function (error, transactionHash) { // 发送到blockchain
    console.log(`Transaction: ${transactionHash}`); // log执行hash
    error ? $("#errors").text(error) : $("#transaction-hash").text(`Tx Hash: ${transactionHash}`); // 有错显示错误详细，没错显示成功hash
    web3.eth.getTransaction(transactionHash, function(error, transactionInfo) { // 据hash显示交易明细
      if(error) $("#errors").text(error);// 有错显示错误详细
      else {
        $("#transaction-info").find("#hash").text(transactionInfo.hash); // 交易hash
        $("#transaction-info").find("#nonce").text(transactionInfo.nonce);// 交易随机数
        $("#transaction-info").find("#block-hash").text(transactionInfo.blockHash);// 交易所在区块hash
        $("#transaction-info").find("#block-number").text(transactionInfo.blockNumber);// 交易所在区块号
        $("#transaction-info").find("#gas-usage").text(transactionInfo.gas);// 交易实际耗费gas
        $("#transaction-info").find("#transaction-index").text(transactionInfo.transactionIndex);// 交易区块中此交易序号
        $("#transaction-info").find("#from").text(transactionInfo.from); // 交易发送方
        $("#transaction-info").find("#to").text(transactionInfo.to);// 交易接收方
        $("#transaction-info").find("#value").text(transactionInfo.value);// 交易ether
        synchAccounts(); // 查看所有账户及余额
      }
    })
  });
});
