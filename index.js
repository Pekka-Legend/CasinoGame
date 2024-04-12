const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1000
canvas.height = 600

var spriteSheet = new Image()
spriteSheet.src = "spritesheet.png"

var game = 1

var gameOver = false

var deckOfCards = []
userCards = []
houseCards = []

var mousepos = {x: 0, y: 0}
var mousedown = false

score = 0
houseScore = 0

money = 5

var bet = 0

var remainingHits = 8

function drawStripedBackground(color1, color2, numberOfStripes)
{
    let stripeWidth = canvas.width / numberOfStripes
    for (var i = 0; i < numberOfStripes; i++)
    {
        c.fillStyle = color2
        if (i % 2 == 0)
        {
            c.fillStyle = color1
        }
        c.fillRect(i * stripeWidth, 0, stripeWidth, canvas.height)
    }
}

function drawCheckeredBackground(color1, color2, numberOfStripes)
{
    let stripeWidth = canvas.width / numberOfStripes
    for (var i = 0; i < numberOfStripes; i++)
    {
        for (var j = 0; j < numberOfStripes; j++)
        {
            c.fillStyle = color2
            if (i % 2 == 0 && j % 2 == 0)
            {
                c.fillStyle = color1
            }
            if (i % 2 == 1 && j % 2 == 1)
            {
                c.fillStyle = color1
            }
            c.fillRect(i * stripeWidth, j * stripeWidth, stripeWidth, stripeWidth)
        }
        
    }
}

class Card //card types- 0: diamond, 1: heart, 2: spade, 3: club
{
    constructor(type, value, x, y)
    {
        this.type = type
        this.value = value
        this.x = x
        this.y = y
        this.width = 64
        this.height = 128
        this.aceValue = 11
        this.active = true
    }
    draw(user)
    {
        if (this.active)
        {
            c.drawImage(spriteSheet, this.type * 64, 0, 64, 128, this.x, this.y, this.width, this.height)
            c.font = "30px Arial"
            c.fillStyle = 'black'
            if (this.value <= 10)//if it isn't a special card
            {
                let measure = c.measureText(this.value.toString())
                c.fillText(this.value.toString(), this.x + this.width / 2 - measure.width / 2, this.y + this.height / 2 + (measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent) / 2)
            }
            else if (this.value == 11)
            {
                let measure = c.measureText("J")
                c.fillText("J", this.x + this.width / 2 - measure.width / 2, this.y + this.height / 2 + (measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent) / 2)
            }
            else if (this.value == 12)
            {
                let measure = c.measureText("Q")
                c.fillText("Q", this.x + this.width / 2 - measure.width / 2, this.y + this.height / 2 + (measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent) / 2)
            }
            else if (this.value == 13)
            {
                let measure = c.measureText("K")
                c.fillText("K", this.x + this.width / 2 - measure.width / 2, this.y + this.height / 2 + (measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent) / 2)
            }
            else if (this.value == 14)
            {
                let measure = c.measureText("A")
                c.fillText("A", this.x + this.width / 2 - measure.width / 2, this.y + this.height / 2 + (measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent) / 2)
                if (game == 1)
                {
                    c.font = "20px Arial"
                    let measure = c.measureText("("+ this.aceValue.toString() + ")")
                    c.fillText("("+ this.aceValue.toString() + ")", this.x + this.width / 2 - measure.width / 2, this.y + this.height / 2 + (measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent) / 2 + 25)
                    if (mousepos.x >= this.x && mousepos.x <= this.x + this.width && mousepos.y >= this.y && mousepos.y <= this.y + this.height)
                    {
                        if (mousedown && user)
                        {
                            if (this.aceValue == 11)
                            {
                                this.aceValue = 1
                            }
                            else
                            {
                                this.aceValue = 11
                            }
                            mousedown = false
                        }
            
                    }
             
                }
            }
        }
        else
        {
            c.fillStyle = 'grey'
            c.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class Button
{
    constructor(x, y, width, height, text, color, hoverColor, fontColor)
    {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.text = text
        this.defaultColor = color
        this.fontColor = fontColor
        this.hoverColor = hoverColor
        this.color = this.defaultColor

        this.fontSize = this.findBestTextSize()
    }
    findBestTextSize()
    {
        let fontSize = 250
        c.font = fontSize.toString() + "px Arial"
        let textSize = c.measureText(this.text)
        while (textSize.width >= this.width - 10 || (textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) >= this.height - 10)
        {
            fontSize--
            c.font = fontSize.toString() + "px Arial"
            textSize = c.measureText(this.text)
        }
        return fontSize
    }
    draw()
    {
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, this.width, this.height)

        c.fillStyle = this.fontColor
        c.font = this.fontSize + "px Arial"
        let textSize = c.measureText(this.text)
        let textHeight = textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent
        c.fillText(this.text, this.x + (this.width / 2) - (textSize.width / 2), this.y + (this.height / 2) + (textHeight / 2), this.width, this.height)
    }
    isClicked()
    {
        if (mousepos.x >= this.x && mousepos.x <= this.x + this.width && mousepos.y >= this.y && mousepos.y <= this.y + this.height)
        {
            this.color = this.hoverColor
            if (mousedown)
            {
                mousedown = false
                return true
            }
            
        }
        else
        {
            this.color = this.defaultColor
        }
        return false
    }
}

card = new Card(3, 11, 0, 0)
var blackjackButtons = {
    hit: new Button(20, canvas.height - 140, 150, 50, "Hit", "white", "darkgrey", "black"),
    stand: new Button(20, canvas.height - 70, 150, 50, "Stand", "white", "darkgrey", "black")
}

var endGameButton = new Button(canvas.width - 20 - 150, canvas.height - 70, 150, 50, "End Game", "white", "darkgrey", "black")

var betButton = new Button(canvas.width - 20 - 150, canvas.height - 70, 150, 50, "Place Bet", "white", "darkgrey", "black")

var tryAgainButton = new Button(20, canvas.height - 70, 150, 50, "Try Again", "white", "darkgrey", "black")

function randomRange(min, max)
{
    return Math.floor(Math.random() * max - min) + min
}

function generateDeck()
{
    deck = []
    for (var j = 0; j < 4; j++)
    {
        for (var i = 2; i < 15; i++)
        {
            deck.push(new Card(j, i, i * 64, j * 128))
        }
    }
    return deck
}

function shuffleDeck(iterations) //only do this if you actually have a full deck
{
    for(var i = 0; i < iterations; i++)
    {
        let random = randomRange(0, 52)
        let t = deckOfCards[random]
        let random2 = randomRange(0, 52)
        deckOfCards[random] = deck[random2]
        deckOfCards[random2] = t
    }
}

function placeBet()
{
    bet = parseFloat(prompt("Enter a bet: "))
    if (bet <= 0 || bet > money || isNaN(bet))
    {
        bet = 0
    }
    money -= bet
}


function drawBlackjackHand()
{
    let offset = (userCards.length) * 64
    for (var i = 0; i < userCards.length; i++)
    {
        userCards[i].x = canvas.width / 2 - offset + i * 64 + offset / 2
        userCards[i].y = 400
    }


    userCards.forEach(card=>{
        card.draw(true)
    })
}

function drawBlackjackHouseHand()
{
    let offset = (houseCards.length) * 64
    for (var i = 0; i < houseCards.length; i++)
    {
        houseCards[i].x = canvas.width / 2 - offset + i * 64 + offset / 2
        houseCards[i].y = 72
    }


    houseCards.forEach(card=>{
        card.draw(false)
    })
}

function drawBlackjackScore()
{
    score = 0
    userCards.forEach(card =>{
        if (card.value <= 10)
        {
            score += card.value
        }
        else if (card.value < 14)//any non number card except for the ace
        {
            score += 10
        }
        else //if the card is an ace
        {
            score += card.aceValue
        }
    })
    houseScore = 0
    houseCards.forEach(card =>{
        if (card.value <= 10)
        {
            houseScore += card.value
        }
        else if (card.value < 14)//any non number card except for the ace
        {
            houseScore += 10
        }
        else //if the card is an ace
        {
            houseScore += card.aceValue
        }
    })
    c.font = "50px Arial"
    c.fillStyle = 'white'
    let w = c.measureText(score.toString()).width
    c.fillText(score.toString(), canvas.width / 2 - w / 2, 580)

}

function endBlackjackGame()//todo next
{
    houseCards = minimizeAces(houseCards)
    if (score <= 21 && score > houseScore)
    {
        money += bet * 2
    }
    if (score <= 21 && houseScore > 21)
    {
        money += bet * 2
    }
    startBlackJack()
}

function drawBlackjackEndScreen()
{
    if (score > 21) //if the player loses
    {
        c.font = "90px Arial"
        c.fillStyle = 'white'
        let w = c.measureText("You Lose!").width
        c.fillText("You Lose!", canvas.width / 2 - w / 2, 350)
    }
    else if (score <= 21 && score > houseScore)
    {
        c.font = "90px Arial"
        c.fillStyle = 'white'
        let w = c.measureText("You Win!").width
        c.fillText("You Win!", canvas.width / 2 - w / 2, 350)
    }
    else if (score <= 21 && houseScore > 21)
    {
        c.font = "90px Arial"
        c.fillStyle = 'white'
        let w = c.measureText("You Win!").width
        c.fillText("You Win!", canvas.width / 2 - w / 2, 350)
    }
    else
    {
        c.font = "90px Arial"
        c.fillStyle = 'white'
        let w = c.measureText("You Lose!").width
        c.fillText("You Lose!", canvas.width / 2 - w / 2, 350)
    }
    c.font = "50px Arial"
    c.fillStyle = 'white'
    let w = c.measureText(houseScore.toString()).width
    c.fillText(houseScore.toString(), canvas.width / 2 - w / 2, 72 + 128 + 50)
    houseCards[1].active = true
}

function minimizeAces(deck)
{
    deck.forEach(card=>{
        if (card.value == 14)
        {
            card.aceValue = 1
            if (houseCards == deck && houseScore > 21)
            {
                drawBlackjackScore()
                if (houseScore < 21)
                {
                    return deck
                }
            }
            
        }
        
    })
    return deck
}

function startBlackJack()
{
    deckOfCards = generateDeck()
    shuffleDeck(100)
    userCards = []
    userCards.push(deckOfCards.pop())
    userCards.push(deckOfCards.pop())

    houseCards = []
    houseCards.push(deckOfCards.pop())
    houseCards.push(deckOfCards.pop())
    houseCards[1].active = false
    bet = 0
    gameOver = false
    if (money <= 0)
    {
        bet = -1
    }
    remainingHits = 8
}

startBlackJack()

if (localStorage.getItem('money') == null)
{
    money = 5
    localStorage.setItem('money', money)
}
else
{
    money = localStorage.getItem('money')
    if (money <= 0)
    {
        money = 5
    }
}
function animate()
{
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    drawCheckeredBackground("maroon", "darkred", 10)

    if (game == 1)//black jack
    {   
        c.font = "50px Arial"
        c.fillStyle = 'white'
        c.fillText("$" + money.toString(), 10, 50)

        if (bet > 0) //if there is a current bet
        {
            c.font = "50px Arial"
            c.fillStyle = 'white'
            c.fillText("Bet: $" + bet.toString(), 10, 100)
            if (blackjackButtons.hit.isClicked() && remainingHits > 0 && !gameOver)
            {
                remainingHits--
                userCards.push(deckOfCards.pop())
                mousedown = false
            }
            blackjackButtons.hit.draw()
    
            blackjackButtons.stand.draw()
            if (blackjackButtons.stand.isClicked() && !gameOver)
            {
                houseCards[1].active = true
                gameOver = true
                if (houseScore <= 16)
                {
                    houseCards.push(deckOfCards.pop())
                }
                
            }
    
            drawBlackjackHand()
            drawBlackjackHouseHand()
            drawBlackjackScore()
    
            if (score > 21)
            {
                userCards = minimizeAces(userCards)
                drawBlackjackScore()
                if (score > 21)
                {
                    gameOver = true
                }
            }
    
            if (gameOver)
            {
                endGameButton.draw()
                if (endGameButton.isClicked())
                {
                    endBlackjackGame()
                }
                drawBlackjackEndScreen()
                localStorage.setItem('money', money)
            }
        }
        else if (bet == 0)
        {
            if (betButton.isClicked())
            {
                placeBet()
            }
            betButton.draw()

            c.font = "90px Arial"
            let measure = c.measureText("Blackjack")
            c.fillStyle = "white"
            c.fillText("Blackjack", canvas.width / 2 - measure.width / 2, 250)

            houseCards[1].active = false
        }
        else if (money <= 0)//if the player has no money (make sure that the bet is also set to -1)
        {
            c.font = "90px Arial"
            let measure = c.measureText("You went broke!")
            c.fillStyle = "white"
            c.fillText("You went broke!", canvas.width / 2 - measure.width / 2, 250)

            if (tryAgainButton.isClicked())
            {
                money = 5
                startBlackJack()
            }
            tryAgainButton.draw()
        }
    }
}

animate()


document.onmousemove = function(e)
{
    mousepos.x = e.offsetX
    mousepos.y = e.offsetY
}
document.onmousedown = function(e)
{
    mousedown = true
}
document.onmouseup = function(e)
{
    mousedown = false
}
document.onkeydown = function(e)
{
    if (e.key == "q")
    {
        document.location.replace("https://google.com")
    }
}