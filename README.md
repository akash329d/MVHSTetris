# MVHSTetris
Multiplayer Tetris Game with NodeJS/SocketIO

Made as a group project, normal tetris but with multiple players. Also possible to gain "power-ups" which allow for unique effects on the other player. Goal is to stay "alive" in Tetris the longest. 

<b>Power Ups: </b><br>
A - Adds a line to the targeted field<br>
C - Clears a line from the targeted field<br>
D - Darkens the targeted field<br>
E - Earthquakes happen in the targeted field<br>
I - Inverts the controls of the targeted player<br>
N - Nukes clear out the targeted field<br>
R - Randomly clears blocks from the targeted field<br>
S - Switches fields with the targeted player<br>

To Do:
<br>✔️ MAKE MULTIPLE ROOMS (Heroku Server currently running with 2 rooms, using server as object)
<br>✔️ Add spam filter.
<br>Move power up get code to serverside to prevent cheating (Non issue, might implement in future).
<br>Make spacebar have delay (~300 ms) while holding to avoid insta-lose

