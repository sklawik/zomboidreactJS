/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { PipeWrenchUI } from '../../shared/pipewrench-ui/React';
import { HTMLDivElement } from '../../shared/pipewrench-ui/html/elements/div';
import { document } from '../../shared/pipewrench-ui/html/elements/html';
import * as JSON from '../../shared/pipewrench-ui/util/JSON';
import { AddWorldSound, BaseSoundManager, BodyPart, ExplosionMode, getPlayer, getWorld, getZombieInfo, HandWeapon, InventoryItem, InventoryItemFactory, IsoGameCharacter, IsoObject, IsoPlayer, IsoWorldInventoryObject, IsoZombie, ItemType, Sound, SoundManager, Sounds, zombie, ZombieLore } from '@asledgehammer/pipewrench';

/**
 * Create and add the element here and to the UIManager.
 */



Events.onMainMenuEnter.addListener(() => {


  const element: HTMLDivElement = (
    <div style="">
      <img id="image-1" src="media/textures/kutas_pic.png" style="top: 0px; left: 0px; width:100vw;" width="100vw" height="100vh" />
      {/* <script type="text/x-lua">
        print('Hello, World!');
      </script> */}
    

    </div>
  );


  document.appendChild(element);

  const img1 = document.getElementById('image-1');



  img1.addEventListener('mousemove', (event) => {
    // print('img1: mousemove');
    print(JSON.stringify(event));
  });


});

Events.onHitZombie.addListener((zombie: IsoZombie, player: IsoGameCharacter) => {
  let world = getWorld()
  let zombies = world.getCell().getZombieList()
  for (let i = 0; i < zombies.size() - 1; i++) {
    let zombi: IsoZombie = zombies.get(i)
    zombi.Say("Aaaa")
    zombi.setX(0)
    zombi.setY(0)
    // zombi.setHealth(0);
    zombi.update()
    player.Say("jestem w samochodziku :) " + i)
  }
})

Events.onPlayerUpdate.addListener((player: IsoPlayer) => {


  
  const element: HTMLDivElement = (
    <div id='divek' style="">
      <img id="image-1" src="media/textures/kutas_pic.png" style="top: 0px; left: 0px; width:100vw;" width="100vw" height="100vh" />
      {/* <script type="text/x-lua">
        print('Hello, World!');
      </script> */}
    

    </div>
  );
  document.appendChild(element);

  const img1 = document.getElementById('image-1');
  const divek = document.getElementById('divek')
  divek.setStyle('bottom: 0px; backgroundImage: url("media/textures/kutas_pic.png"); padding: 5rem; width: 100%; height: 100%; backgroundColor: "blue";')

  let world = getWorld()
  let zombies = world.getCell().getZombieList()

  let playerX = player.getX()
  let playerY = player.getY()
  let playerZ = player.getZ()
  player.Say("hah")


  for (let i = 0; i < zombies.size(); i++) {
    let zombi: IsoZombie = zombies.get(i)



    let zombiX = zombi.getX()
    let zombiY = zombi.getY()
    let zombiZ = zombi.getZ()



    if (playerX - zombiX < 10) {

      if (playerY - zombiY < 10) {
        let cell = zombi.getCell().getGridSquare(zombiX, zombiY, zombiZ)
        cell.playSound('explosion', true)
        cell.explode()
        zombi.setHealth(0)

    
        zombi.update()
        player.Say(`${playerY - zombiY} i ${playerX - zombiX}`)
      }


    }
  }

})

