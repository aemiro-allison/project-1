# Run away from Nyan Cat!
The goal of the game is to have the player run away from a nyan cat as a yarn ball. The nyan cat will chase after you as the yarn ball until it catches you.

![Moving Cyan Cat](https://lh5.ggpht.com/nct7SKXWQ3vQYQki0hQEGidMPxk_-8JqkhPnSWEjuv8bF3pd2Qj3RuAa-5IXa_hCdQ=w170)

## Inital Game Structure
The nyan cat will be chasing the player and they will have to dodge obstacles that are moving towards the player of else they will slow down the player down and the nyan cat will catch them. The player can dodge the obstacles by either jumping or crouching.

##### Project Summary:
- Nyan Cat chases player *(the yarn ball)*
- player has to dodge obstacles to prevent Nyat cat from catching him.
- Nyan Cat gradually inscreases in speed until he catches player.


## Phases of Completion

### MVP
The minimal viable product of this game would be allowing the player to move the yarn ball with keyboard controls. The yarn ball should be able to move in all axes, ability to crouch and jump as well. The entire screen will be filled with the map and the map will be moving towards the left and the nyan cat towards the right. The nyan cat should incrementally gain in speed and eventually catch up to the player if the player is not actively decreaing the nyan cat's speed by using power ups or speed ups to get away faster.

### Possible Technologies 
Technology | Special Features
 --- | --- 
Javascript | requestAnimationFrame
CSS | animations, transitions, 
HTML |canvas, image sprites. *(for image based animations)*
Sprites(Images) | [Open Source Map Creator](http://www.mapeditor.org/)
Physics | gravity, velocity, speed, collusion detection algorithm

