pragma solidity ^0.4.11;

contract MyToken {
  string public constant name = "MyToken";
  string public constant symbol = "MTK";
  uint256 public constant decimals = 18;
  uint256 public constant INITIAL_SUPPLY = 10000;

  address public creator;
  uint256 public totalSupply;
  mapping (address => uint256) public balances;

  event TokenTransfer(address from, address to, uint256 amount);

  function MyToken() {
    creator = msg.sender;
    totalSupply = INITIAL_SUPPLY;
    balances[creator] = INITIAL_SUPPLY;
  }

  function sendTokens(address receiver, uint256 amount) returns (bool) {
    address owner = msg.sender;

    require(amount > 0);
    require(balances[owner] >= amount);

    balances[owner] -= amount;
    balances[receiver] += amount;
    TokenTransfer(owner, receiver, amount);
    return true;
  }

  function balanceOf(address owner) constant returns (uint256) {
    return balances[owner];
  }
}
