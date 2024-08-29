// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArcadeGamePlatform {
    address public owner;
    uint256 public rewardPool;
    mapping(address => uint256) public userBalances;
    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    struct Game {
        address player1;
        address player2;
        uint256 betAmount;
        bool isBettingActive;
        address winner;
        bool isGameOver;
    }

    event GameCreated(
        uint256 indexed gameId,
        address indexed player1,
        address indexed player2,
        uint256 betAmount
    );
    event BetPlaced(
        uint256 indexed gameId,
        address indexed player,
        uint256 amount
    );
    event GameEnded(
        uint256 indexed gameId,
        address indexed winner,
        uint256 reward
    );
    event RewardWithdrawn(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier gameExists(uint256 _gameId) {
        require(_gameId < gameCounter, "Game does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createGame(
        address _player2,
        uint256 _betAmount,
        bool _isBettingActive
    ) external returns (uint256) {
        if (_isBettingActive) {
            require(_betAmount > 0, "Bet amount must be greater than 0");
        }

        games[gameCounter] = Game({
            player1: msg.sender,
            player2: _player2,
            betAmount: _isBettingActive ? _betAmount : 0, // Set betAmount only if betting is active
            isBettingActive: _isBettingActive,
            winner: address(0),
            isGameOver: false
        });

        emit GameCreated(gameCounter, msg.sender, _player2, _betAmount);
        return gameCounter++;
    }

    function placeBet(uint256 _gameId) external payable gameExists(_gameId) {
        Game storage game = games[_gameId];
        require(game.isBettingActive, "Betting is closed");
        require(msg.value == game.betAmount, "Incorrect bet amount");
        require(
            msg.sender == game.player1 || msg.sender == game.player2,
            "Not a player in this game"
        );

        userBalances[msg.sender] += msg.value;
        emit BetPlaced(_gameId, msg.sender, msg.value);

        if (
            userBalances[game.player1] == game.betAmount &&
            userBalances[game.player2] == game.betAmount
        ) {
            game.isBettingActive = false;
        }
    }

    function endGame(uint256 _gameId, address _winner)
        external
        onlyOwner
        gameExists(_gameId)
    {
        Game storage game = games[_gameId];
        require(!game.isGameOver, "Game is already over");
        require(
            _winner == game.player1 || _winner == game.player2,
            "Invalid winner address"
        );

        game.winner = _winner;
        game.isGameOver = true;

        uint256 reward = game.betAmount * 2;
        userBalances[_winner] += reward;
        rewardPool -= reward;

        emit GameEnded(_gameId, _winner, reward);
    }

    function withdrawReward() external {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No rewards to withdraw");

        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);

        emit RewardWithdrawn(msg.sender, balance);
    }

    function depositToRewardPool() external payable onlyOwner {
        rewardPool += msg.value;
    }

    function getGameDetails(uint256 _gameId)
        external
        view
        gameExists(_gameId)
        returns (Game memory)
    {
        return games[_gameId];
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return userBalances[_user];
    }
}
