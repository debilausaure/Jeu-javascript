/***********************************************/
/**                                            */
/**              MINI-PROJET JS 2015           */
/**               Star Wars edition            */  
/**                                            */
/***********************************************/


/*
	     _________________________________
	    |:::::::::::::;;::::::::::::::::::|
	    |:::::::::::'~||~~~``:::::::::::::|
	    |::::::::'   .':     o`:::::::::::|
	    |:::::::' oo | |o  o    ::::::::::|
	    |::::::: 8  .'.'    8 o  :::::::::|
	    |::::::: 8  | |     8    :::::::::|
	    |::::::: _._| |_,...8    :::::::::|
	    |::::::'~--.   .--. `.   `::::::::|
	    |:::::'     =8     ~  \ o ::::::::|
	    |::::'       8._ 88.   \ o::::::::|
	    |:::'   __. ,.ooo~~.    \ o`::::::|
	    |:::   . -. 88`78o/:     \  `:::::|
	    |::'     /. o o \ ::      \88`::::|
	    |:;     o|| 8 8 |d.        `8 `:::|
	    |:.       - ^ ^ -'           `-`::|
	    |::.                          .:::|
	    |:::::.....           ::'     ``::|
	    |::::::::-'`-        88          `|
	    |:::::-'.          -       ::     |
	    |:-~. . .                   :     |
	    | .. .   ..:   o:8      88o       |
	    |. .     :::   8:P     d888. . .  |
	    |.   .   :88   88      888'  . .  |
	    |   o8  d88P . 88   ' d88P   ..   |
	    |  88P  888   d8P   ' 888         |
	    |   8  d88P.'d:8  .- dP~ o8       |
	    |      888   888    d~ o888    LS |
                									*/	

/************************************************
*                                               *
*                   Variables                   *
*                                               *
************************************************/

var score; // variable pour tenir compte du score
var lives; // variable pour tenir compte des vies

var spaceshipUp; // booleen True si la fleche du haut est enfoncée
var spaceshipDown; // booleen True si la fleche du bas est enfoncée
var spacebarPressed; //booleen True si espace est enfoncé

var waveStarted; //booleen si la flotte de soucoupe a été lancée
var difficulty; // variable gérant la fréquence des soucoupes
var newFSTimer; // timer pour l'arrivée d'une nouvelle soucoupe
var newWaveTimer; // timer incrémentant périodiquement la difficulté

var reqAnimFrame;
var myCanvas;
var context;
var spaceship1; // Vaisseau du joueur 1 en prévision d'un mode 2 joueurs

var spaceshipImg; // Image du vaisseau
var flyingSaucerImg; // Image des soucoupes
var shotImg; // Image du tir
var lifeImg; // Image des vies

var blastSound; // Son de tirs
var lifeSound; // Son de la perte d'une vie
var ingameMusic; // Musique de fond
var endMusic; // Musique de fin

var spaceship = function(posX, posY){   //Type gérant les vaisseaux
  this.x = posX;						// en prévision d'un mode
  this.y = posY;						// 2 joueurs
}

var shot = function(posX, posY){		// Type des tirs
  this.x = posX;
  this.y = posY;
}

var shots = new Array(); // Initialisation du tableau des tirs

var flyingSaucer = function(posX, posY){ // Type des soucoupes
  this.x = posX;
  this.y = posY;
}

var flyingSaucers = new Array(); // Initialisation du tableau des soucoupes

/*************************************************
*                                                *
*                Initialisation                  *
*                                                *
*************************************************/

var init = function(){

  myCanvas = document.getElementById("stars");
  context = myCanvas.getContext("2d");

   			/*Sons*/

  blastSound = new Audio('sounds/blast.mp3');
  lifeSound = new Audio('sounds/life.mp3');
  ingameMusic = new Audio('sounds/cantina.mp3');
  endMusic = new Audio('sounds/end.mp3');
  
  			/*Images*/

  spaceshipImg = new Image();
  spaceshipImg.src = "images/X-Wing-icon.png";
  shotImg = new Image();
  shotImg.src = 'images/tir.png';
  flyingSaucerImg = new Image();
  flyingSaucerImg.src = 'images/tie-fighter.png';
  lifeImg = new Image();
  lifeImg.src = 'images/avatar48245_0.gif';  

  			/*Autres initialisations*/

  spacebarPressed = false;
  waveStarted = false;
  lives = 3;
  score = 0;
  difficulty = -0.2; //cette valeur va être incrémentée à 0
   					 //lors du premier passage dans la boucle
  
  spaceship1 = new spaceship(40, myCanvas.height/2 - spaceshipImg.height/2);
  // placement initial du vaisseau


  			/*Listeners*/

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  var beginFlyingSaucerWaves = document.getElementById('flotteSoucoupes');
  beginFlyingSaucerWaves.addEventListener('click', controlWaves);
  var addFlyingSaucerButton = document.getElementById('nouvelleSoucoupe');
  addFlyingSaucerButton.addEventListener('click', addFlyingSaucer);

  			/* Lancement de la boucle principale*/

  reqAnimFrame = window.requestAnimationFrame(main);
}

window.addEventListener('load', init);

/*************************************************
*                                                *
*              Fonction principale               *
*                                                *
*************************************************/

var main = function(){
  	moveSpaceship(4); // déplace le vaisseau
  	moveFlyingSaucers(3); // déplace les soucoupes, et gère les vies
  	moveShots(8); // déplace les tirs, et gère les collisions
  	drawFrame(); // dessine l'image suivante
  
  					/*gestion de fin de partie*/
  if (lives != 0){
    reqAnimFrame = window.requestAnimationFrame(main);
    // Si on a encore des vies, relance 'main'
  }
  
  else{
    window.cancelAnimationFrame(reqAnimFrame);
    reqAnimFrame = null;
    if (waveStarted){
      var end = "Perdu ! Votre score est de : " + score;
    }
    else{
      var end = "Pour commencer une vraie partie, rafraîchissez la page puis cliquez sur le symbole infini";
    }
    ingameMusic.pause();
    endMusic.play();
    alert(end);
  }
}

/*************************************************
*                                                *
*                Fonction de dessin              *
*                                                *
*************************************************/

var drawFrame = function(){
  context.clearRect(0,0, myCanvas.width, myCanvas.height);
  //vide le Canvas
  context.drawImage(spaceshipImg, spaceship1.x, spaceship1.y);
  //dessine le vaisseau

  for (i=0; i<shots.length; i++){
    context.drawImage(shotImg, shots[i].x, shots[i].y);
  }
  //dessine chaque tir
  for (i=0; i<flyingSaucers.length; i++){
    context.drawImage(flyingSaucerImg, flyingSaucers[i].x, flyingSaucers[i].y);
  }
  //dessine chaque soucoupe
  for (i=0; i < lives; i++){
    context.drawImage(lifeImg, i * lifeImg.width, 0);
  }
  //dessine chaque vie
}

/*************************************************
*                                                *
*            Fonctions intermédiaires            *
*                                                *
*************************************************/

var moveSpaceship = function(deltaY){
	/*Déplace le vaisseau d'une quantité deltaY sur l'axe des
	ordonnées en fonction des touches enfoncées et de la position
	du vaisseau*/
  	if (spaceshipDown && (spaceship1.y + deltaY + spaceshipImg.height < myCanvas.height)){
    	spaceship1.y += deltaY;
  	}
  	if (spaceshipUp && (spaceship1.y + deltaY > 0)){
    	spaceship1.y -= deltaY;
  	}
}

var keyDown = function(event){
	/*Actions liées à la pression d'une touche*/
    switch (event.key) {
        case "ArrowUp": 
        case "Up": 
                spaceshipUp = true;
            break;
        case "ArrowDown": 
        case "Down": 
                spaceshipDown = true;
            break;
        case " ":
                addShot();
                spacebarPressed = true;
        break;
        default: return;
    }
    event.preventDefault();   // pour désactiver l'action éventuelle par défaut liée à la touche pressée
}

var keyUp = function(event){
	/*Actions liées au relachement des touches*/
    switch (event.key) {
        case "ArrowUp": 
        case "Up": 
                spaceshipUp = false;
            break;
        case "ArrowDown": 
        case "Down": 
                spaceshipDown = false;
            break;
      	case " ":
                spacebarPressed = false;
            break;
            default: return;
    }
    event.preventDefault();   // pour désactiver l'action éventuelle par défaut liée à la touche pressée
}

var addShot = function(){
	/*Ajoute un tir si la variable spacebarPressed n'a pas encore été changée à True
	permettant de déclencher un tir uniquement si la touche espace a été relachée*/
  	if (!spacebarPressed && reqAnimFrame != null){
    	shots.push(new shot(spaceship1.x + spaceshipImg.width - 10, spaceship1.y + spaceshipImg.height / 2 -2));
    	blastSound.play(); //joue le son d'un tir
  	}
}

var moveShots = function(deltaX){
	/*Déplace les tirs, gère les collisions, et mets à jour le score*/
	for (k = 0; k < shots.length; k++){ // pour chaque tir
    	if (shots[k].x + deltaX < myCanvas.width){// si après déplacement, le tir ne sort pas du canvas
      		shots[k].x += deltaX; // on le bouge
      		var isSuccessful = successfulShot(shots[k]); //variable, contient l'objet soucoupe touchée, ou null si aucune soucoupe n'est touchée
      		if (isSuccessful != null){ // si touché
        		flyingSaucers.splice(flyingSaucers.indexOf(isSuccessful), 1);// on efface la soucoupe touchée
        		shots.splice(k, 1); // on efface le tir
        		updateScore(200); // on augmente le score
       		}
     	}
    	else{ // si le tir dépasse du canvas
      	shots.splice(k, 1); // on l'efface
    	}
  	}
}

var addFlyingSaucer = function(){
	/*Ajoute un soucoupe avec une valeur aléatoire sur l'axe des ordonnées*/
  if (waveStarted){ //si la flotte a été lancée
    if (Math.random() >= 0.5){ // alors la soucoupe a une chance sur deux d'apparaitre
    flyingSaucers.push(new flyingSaucer(myCanvas.width - 25, Math.floor(Math.random()*(myCanvas.height - flyingSaucerImg.height))));
    this.blur(); // on enlève le focus du bouton
    }
  }
	else{
		flyingSaucers.push(new flyingSaucer(myCanvas.width - 25, Math.floor(Math.random()*(myCanvas.height - flyingSaucerImg.height))));
  	this.blur(); // on enlève le focus du bouton
	}
}

var moveFlyingSaucers = function(deltaX){
	/*Bouge les soucoupes, gère les vies, et met à jour le score lorsqu'une soucoupe arriver à s'échapper*/
  	for (i = 0; i < flyingSaucers.length; i++){ //pour chaque soucoupe
    	if (flyingSaucers[i].x - deltaX > 0){ 	//si elle ne dépasse pas du canvas
     		flyingSaucers[i].x -= deltaX; 		//on la bouge
    	}
    	else{ // si elle dépasse du canvas
      		flyingSaucers.splice(i, 1); // on l'efface
      		updateScore(-1000);			// on enlève 1000 points
      		lives -= 1;					// on enlève une vie
      		lifeSound.play();			// on joue le son de la perte de vie
    	}
  	}
}

var collisionShotSaucer = function(tir, soucoupe){
	/*Prédicat de collision entre un tir et une soucoupe
	renvoie True si le tir touche la soucoupe, False sinon*/
  	var maxx1 = Math.max(tir.x, soucoupe.x);
  	var minx2 = Math.min(tir.x + shotImg.width, soucoupe.x + flyingSaucerImg.width);
  	var maxy1 = Math.max(tir.y, soucoupe.y);
  	var miny2 = Math.min(tir.y + shotImg.height, soucoupe.y + flyingSaucerImg.height);
  	return ((maxx1 <= minx2) && (maxy1 <= miny2));
}

var successfulShot = function(tir){
	/*Fonction de vérification de collision d'un tir avec n'importe quelle soucoupe
	renvoie un objet soucoupe si celle-ci est rentrée en collision avec le tir, null sinon*/
  	for (j = 0; j < flyingSaucers.length; j++){ // pour chaque soucoupe
    	if (collisionShotSaucer(tir, flyingSaucers[j])){ // si collision avec le tir
      		return flyingSaucers[j];
    	}
  	}
  	return null; // si rien n'a été trouvé, renvoie null
}

var updateScore = function(points){
	/*Ajoute au score les points passées en paramètre, et affiche les nouveaux points dans la zone prévue*/
  	score += points; // on met à jour le score pour pouvoir l'afficher à la fin de la partie
  	var scoreboard = document.getElementById('score');
  	scoreboard.innerHTML = parseInt(scoreboard.innerHTML) + points;
}

var flyingSaucerWave = function(){
	/*Gère la difficulté et l'intervale entre chaque soucoupe de la flotte de soucoupes*/
  	window.clearInterval(newWaveTimer); 		// pour éviter plusieurs éxécutions simultanées
  	difficulty += 0.2; 							// incrémentation de la difficulté
  	var fSInterval = 1500 - 500 * difficulty; 	//ms s'écoulant entre l'ajout de deux soucoupes
  	window.clearInterval(newFSTimer); 								/* on met à jour le timer */
  	newFSTimer = window.setInterval(addFlyingSaucer, fSInterval);	/* qui ajoute les soucoupes */
  	newWaveTimer = window.setInterval(flyingSaucerWave, 20000);		// on rappelle cette fonction 20 secondes plus tard
}

var controlWaves = function(){
	/*Controle la flotte de soucoupes*/
  	if (!waveStarted) { // si la flotte n'a pas été lancée
    	flyingSaucerWave(); // on la démarre
    	waveStarted = true;
    	ingameMusic.play();	// on lance la musique du jeu
    	ingameMusic.loop = true; // on la fait looper
  	}
  	else{	//si elle a déjà été lancée
    	window.clearInterval(newWaveTimer);	//on arrête les timers
    	window.clearInterval(newFSTimer);
    	waveStarted = false;
    	ingameMusic.pause();	//on met la musique en pause
  	}
  	this.blur();// on enlève le focus du bouton
}
/*
			                   ____ 
			                _.' :  `._  
			            .-.'`.  ;   .'`.-. 
			   __      / : ___\ ;  /___ ; \      __   
			 ,'_ ""--.:__;".-.";: :".-.":__;.--"" _`, 
			 :' `.t""--.. '<@.`;_  ',@>` ..--""j.' `;
			      `:-.._J '-.-'L__ `-- ' L_..-;' 
			        "-.__ ;  .-"  "-.  : __.-" 
			            L ' /.------.\ ' J 
			             "-.   "--"   .-"      	May with you the force be
			            __.l"-:_JL_;-";.__   
			         .-j/'.;  ;""""  / .'\"-. 
			       .' /:`. "-.:     .-" .';  `.   
			    .-"  / ;  "-. "-..-" .-"  :    "-. 
			 .+"-.  : :      "-.__.-"      ;-._   \   
			 ; \  `.; ;                    : : "+. ;  
			 :  ;   ; ;                    : ;  : \:
			 ;  :   ; :                    ;:   ;  :  
			: \  ;  :  ;                  : ;  /  :: 
			;  ; :   ; :                  ;   :   ;:  
			:  :  ;  :  ;                : :  ;  : ; 
			;\    :   ; :                ; ;     ; ; 
			: `."-;   :  ;              :  ;    /  ; 
			 ;    -:   ; :              ;  : .-"   :
			 :\     \  :  ;            : \.-"      : 
			  ;`.    \  ; :            ;.'_..--  / ; 
			  :  "-.  "-:  ;          :/."      .'  : 
			   \         \ :          ;/  __        : 
			    \       .-`.\        /t-""  ":-+.   : 
			     `.  .-"    `l    __/ /`. :  ; ; \  ;   
			       \   .-" .-"-.-"  .' .'j \  /   ;/ 
			        \ / .-"   /.     .'.' ;_:'    ; 
			         :-""-.`./-.'     /    `.___.' 
			               \ `t  ._  /   
			                "-.t-._:'                                  */