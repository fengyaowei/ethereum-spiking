pragma solidity ^0.4.4; // 告知solidity的版本

contract MyToken {
  string public constant name = "MyToken"; 
  string public constant symbol = "MTK"; // 类似RMB
  uint256 public constant decimals = 18; // 精确度
  uint256 public constant INITIAL_SUPPLY = 10000;// 初始代币量

  address public creator; // 持有人
  uint256 public totalSupply; // 总供给量
  mapping (address => uint256) public balances;// 参与人的余量

  // 初始化、只执行一次，定义了持有人为合约发起人，总量1万，持有人全部拥有1万代币
  function MyToken() public {
    creator = msg.sender;
    totalSupply = INITIAL_SUPPLY;
    balances[creator] = INITIAL_SUPPLY;
  }

  // 发送代币
  function sendTokens(address receiver, uint256 amount) public returns (bool) {
    address owner = msg.sender; // 调用方即为参与人

    require(amount > 0); // 参与人资格验证-有代币
    require(balances[owner] >= amount);// 参与人资格验证-有足够代币

    balances[owner] -= amount; // 发起方减少代币
    balances[receiver] += amount;// 接收方增加大笔
    return true;// 完成转移交易代币过程
  }
  
  // 查看账户的代币余额，constant==view（不修改状态，可读），pure(不读，不修)
  function balanceOf(address owner) public constant returns (uint256) {
    return balances[owner];
  }
}
