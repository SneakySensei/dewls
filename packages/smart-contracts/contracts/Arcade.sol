// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);
}

contract Arcade {
    address public owner;
    uint256 public rewardPool = 0;
    uint256 public ownerPool = 0;
    mapping(address => uint256) public userBalances;
    mapping(string => Game) public games;
    IERC20 public token;
    uint256 public rewardPoolPercentage = 20;
    uint256 public ownerPercentage = 20;
    uint256 public winPercentage = 60;

    struct Game {
        string gameId;
        address player1;
        address player2;
        uint256 betAmount;
        bool isBettingActive;
        bool player1Deposit;
        bool player2Deposit;
        address winner;
        bool isGameOver;
    }

    event GameCreated(
        string indexed gameId,
        address indexed player1,
        address indexed player2,
        uint256 betAmount
    );
    event BetPlaced(
        string indexed gameId,
        address indexed player,
        uint256 amount
    );
    event GameEnded(
        string indexed gameId,
        address indexed winner,
        uint256 reward,
        uint256 betAmount,
        uint256 winPercentage
    );
    event OwnerWithdraw(address indexed owner, uint256 amount);
    event RewardWithdrawn(address indexed user, uint256 amount);
    event PrizeDistributed(
        address indexed _1stPlaceAddress,
        address indexed _2ndPlaceAddress,
        address indexed _3rdPlaceAddress,
        uint256 totalAmount
    );
    event PercentagesUpdated(
        uint256 rewardPoolPercentage,
        uint256 ownerPercentage,
        uint256 winPercentage
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier gameExists(string calldata _gameId) {
        require(
            keccak256(abi.encodePacked(games[_gameId].gameId)) ==
                keccak256(abi.encodePacked(_gameId)),
            "Game doesn't exist"
        );
        _;
    }

    constructor(IERC20 _token) {
        owner = msg.sender;
        token = _token;
    }

    function createGame(
        string calldata _gameId,
        address _player1,
        address _player2,
        uint256 _betAmount,
        bool _isBettingActive
    ) external onlyOwner returns (string calldata) {
        if (_isBettingActive) {
            require(_betAmount > 0, "Bet amount must be greater than 0");
        }

        games[_gameId] = Game({
            gameId: _gameId,
            player1: _player1,
            player2: _player2,
            betAmount: _isBettingActive ? _betAmount : 0,
            isBettingActive: _isBettingActive,
            player1Deposit: false,
            player2Deposit: false,
            winner: address(0),
            isGameOver: false
        });

        emit GameCreated(_gameId, _player1, _player2, _betAmount);
        return _gameId;
    }

    function placeBet(
        string calldata _gameId,
        uint256 _amount
    ) external gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(game.isBettingActive, "Betting is closed");
        require(_amount == game.betAmount, "Incorrect bet amount");
        require(
            msg.sender == game.player1 || msg.sender == game.player2,
            "Not a player in this game"
        );

        token.transferFrom(msg.sender, address(this), _amount);
        userBalances[msg.sender] += _amount;
        emit BetPlaced(_gameId, msg.sender, _amount);

        if (game.player1 == msg.sender) {
            game.player1Deposit = true;
        } else {
            game.player2Deposit = true;
        }

        if (game.player1Deposit && game.player2Deposit) {
            game.isBettingActive = false;
        }
    }

    function endGame(
        string calldata _gameId,
        address _winner,
        address _loser
    ) external onlyOwner gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(!game.isGameOver, "Game is already over");
        require(
            _winner == game.player1 || _winner == game.player2,
            "Invalid winner address"
        );
        require(
            _loser == game.player1 || _loser == game.player2,
            "Invalid loser address"
        );
        require(_loser != _winner, "Winner and loser can't be same address");

        game.winner = _winner;
        game.isGameOver = true;

        userBalances[_winner] = (userBalances[_winner] +
            (game.betAmount * winPercentage) /
            100);
        userBalances[_loser] = (userBalances[_loser] - game.betAmount);
        rewardPool = (rewardPool +
            (game.betAmount * rewardPoolPercentage) /
            100);
        ownerPool = (ownerPool + (game.betAmount * ownerPercentage) / 100);

        emit GameEnded(
            _gameId,
            _winner,
            (game.betAmount * winPercentage) / 100,
            game.betAmount,
            winPercentage
        );
    }

    function withdrawReward(
        address _userAddress,
        uint256 _amount
    ) external onlyOwner {
        uint256 balance = userBalances[_userAddress];
        require(balance > _amount, "No rewards to withdraw");

        userBalances[_userAddress] -= _amount;
        token.approve(address(this), _amount);
        token.transferFrom(address(this), _userAddress, _amount);

        emit RewardWithdrawn(_userAddress, _amount);
    }

    function withdrawRewardPool(
        address _1stPlaceAddress,
        address _2ndPlaceAddress,
        address _3rdPlaceAddress,
        uint256 _amount
    ) external onlyOwner {
        require(
            rewardPool >= _amount,
            "Reward Pool doesn't have sufficient funds"
        );

        token.approve(address(this), _amount);
        token.transferFrom(
            address(this),
            _1stPlaceAddress,
            ((rewardPool * 50) / 100)
        );
        token.transferFrom(
            address(this),
            _2ndPlaceAddress,
            ((rewardPool * 35) / 100)
        );
        token.transferFrom(
            address(this),
            _3rdPlaceAddress,
            ((rewardPool * 15) / 100)
        );

        emit PrizeDistributed(
            _1stPlaceAddress,
            _2ndPlaceAddress,
            _3rdPlaceAddress,
            _amount
        );
    }

    function withdrawOwnerPool() external onlyOwner {
        require(ownerPool > 0, "No rewards to withdraw");

        uint256 amountToWithdraw = ownerPool;
        ownerPool = 0;
        token.approve(address(this), amountToWithdraw);
        token.transferFrom(address(this), owner, amountToWithdraw);

        emit OwnerWithdraw(owner, amountToWithdraw);
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return userBalances[_user];
    }

    function updatePercentages(
        uint256 _rewardPoolPercentage,
        uint256 _ownerPercentage,
        uint256 _winPercentage
    ) external onlyOwner {
        require(
            _rewardPoolPercentage + _ownerPercentage + _winPercentage == 100,
            "Percentages must add up to 100"
        );

        rewardPoolPercentage = _rewardPoolPercentage;
        ownerPercentage = _ownerPercentage;
        winPercentage = _winPercentage;

        emit PercentagesUpdated(
            rewardPoolPercentage,
            ownerPercentage,
            winPercentage
        );
    }
}
