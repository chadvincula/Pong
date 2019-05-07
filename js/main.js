// Added this comment
"use strict"

// initialize game
var game = new Phaser.Game();

// Main Menu state
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function()
	{
		// game.load.path("../assets/img");
		game.load.image("ball", "assets/img/ball.png");
		game.load.audio("pop", "assets/audio/pop01.mp3");
	},
	create: function()
	{
		game.state.start("Play");
	}
}

// Play state
var Play = function(game) {
	// Create constants
	this.BALL_WIDTH = 10;
	this.BALL_VELOCITY = 300;
	this.PADDLE_VELOCITY = 200;
};
Play.prototype = {
	create: function()
	{
		// Game Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Ball Obj
		this.ball = game.add.sprite(game.width / 2, game.height / 2, "ball");
		this.ball.anchor.set(0.5);

		// Player 1 Paddle
		this.p1 = game.add.sprite(this.BALL_WIDTH + 5, game.height / 2, "ball");
		this.p1.anchor.set(0.5);
		this.p1.scale.y = 10;

		// Player 2 Paddle
		this.p2 = game.add.sprite(game.width - (this.BALL_WIDTH + 5), game.height / 2, "ball");
		this.p2.anchor.set(0.5);
		this.p2.scale.y = 10;

		// Applying physics to game objs
		game.physics.enable([this.ball, this.p1, this.p2], Phaser.Physics.ARCADE);
		this.ball.body.collideWorldBounds = true;
		this.p1.body.collideWorldBounds = true;
		this.p1.body.immovable = true;
		this.p2.body.collideWorldBounds = true;
		this.p2.body.immovable = true;

		// Launch ball
		this.ball.body.velocity.x = this.BALL_VELOCITY;
		this.ball.body.velocity.y = game.rnd.integerInRange(-this.BALL_VELOCITY, this.BALL_VELOCITY);

		// Ball Bounce
		// setTo()
		this.ball.body.bounce.setTo(1, 1);

		// Reset Ball
		this.resetBall("left");
	},
	update: function()
	{
		// Check ball -> paddle collisions
		// p1
		game.physics.arcade.collide(this.ball, this.p1);

		// p2
		game.physics.arcade.collide(this.ball, this.p2);

		// Player 1 input
		if(game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			this.p1.body.velocity.y = -this.PADDLE_VELOCITY;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			this.p1.body.velocity.y = this.PADDLE_VELOCITY;
		}
		else
		{
			this.p1.body.velocity.y = 0;
		}

		// Player 2 input
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP))
		{
			this.p2.body.velocity.y = -this.PADDLE_VELOCITY;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
		{
			this.p2.body.velocity.y = this.PADDLE_VELOCITY;
		}
		else
		{
			this.p2.body.velocity.y = 0;
		}

		// check bounds
		this.checkBounds();
	},

	checkBounds: function()
	{
		if(this.ball.body.blocked.right)
		{
			console.log("Right");
			this.resetBall("right");
		}
		else if(this.ball.body.blocked.left)

		{
			console.log("Left");
			this.resetBall("left");
		}
	},

	resetBall: function(direction)
	{
		this.ball.x = game.width / 2;
		this.ball.y = game.height / 2

		if(direction == "right")
			direction = 1;
		else if(direction == "left")
			direction = -1;
		// else
		// 	direction = -1;
		this.ball.body.velocity.x = direction * this.BALL_VELOCITY;
		this.ball.body.velocity.y = this.ball.body.velocity.y = game.rnd.integerInRange(-this.BALL_VELOCITY, this.BALL_VELOCITY);
	}
}

game.state.add("MainMenu", MainMenu);
game.state.add("Play", Play);
game.state.start("MainMenu");