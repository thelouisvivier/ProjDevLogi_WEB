var frameDiv = new Map();
var frameValidDiv = new Map();
var frameTimers = new Map();
var frameTimer;
var currentFrameIndex = 0;
var lastFrameIndex;

var blockDiv;
var blockName;
var blockTimer;
var blockPassIndex = 0;
var lastBlockPassIndex;
var lastBlockPassNbr;

var frame = {
    init(walltime, newstime, countdowntime, mediastime, socialnetworkstime){
        let wall = $(".wall-frame:first");
        let news = $(".news-frame:first");
        let countdown = $(".countdown-frame:first");
        let medias = $(".medias-frame:first");
        let socialnetworks = $(".socialnetworks-frame:first");

        frameDiv.set('wall', wall);
        frameDiv.set('news', news);
        frameDiv.set('countdown', countdown);
        frameDiv.set('medias', medias);
        frameDiv.set('socialnetworks', socialnetworks);

        frameTimers.set('wall', walltime);
        frameTimers.set('news', newstime);
        frameTimers.set('countdown', countdowntime);
        frameTimers.set('medias', mediastime);
        frameTimers.set('socialnetworks', socialnetworkstime);

        for (const [key, value] of frameDiv.entries()) {
            value.css("display","none");
        };

        if (typeof frameTimer !== 'undefined') {
            clearTimeout(frameTimer);
        };

        for (const [key, value] of frameTimers.entries()) { //check how many null timers there is
            if (!isNaN(value) && value != null && value != 0){ //if its a number
                frameValidDiv.set(key,frameDiv.get(key));
            }
        };

        lastFrameIndex = frameValidDiv.size -1;
        frame.roll(); //Start frame animation
    },

    roll(){
        let thisFrame = Array.from(frameValidDiv)[currentFrameIndex][1]; //Get current frame html element
        let thisFrameName = Array.from(frameValidDiv)[currentFrameIndex][0];
        let timing = frameTimers.get(thisFrameName); //Get current frame timer

        thisFrame.css("display","grid"); //Display current frame element

        currentFrameIndex++;

        if(currentFrameIndex>lastFrameIndex){ //Check if its the last frame element
            currentFrameIndex=0;
        }

        if (thisFrameName == "news" || thisFrameName == "medias"){
            clearTimeout(frameTimer);
            frame.initSlideshow(thisFrameName); //initslideshow
        }
        else {
            frameTimer = setTimeout(function(){
                let previousFrameIndex = currentFrameIndex-1; //Get previous frame
        
                // If previous was last frame
                if(previousFrameIndex == -1){
                    previousFrameIndex = lastFrameIndex;
                }
                Array.from(frameValidDiv)[previousFrameIndex][1].css("display","none"); //Remove this frame
    
                frame.roll();
            }, timing*1000);
        }

    },

    initSlideshow(arg){
        if (typeof blockTimer !== 'undefined') {//Clear blockTimer
            clearTimeout(blockTimer);
        };
        blockName = arg;
        blockDiv = $("."+arg+"-block"); //get all div
        blockDiv.css('display','none');
        lastBlockPassIndex = Math.trunc (blockDiv.length/3); //To display blocks 3 by 3
        lastBlockPassNbr =  blockDiv.length%3; //How many blocks on the last display (reste)
        if (lastBlockPassNbr == 0){ //if r = 0, remove on pass
            lastBlockPassIndex--;
        }
        blockPassIndex = 0;
        frame.rollSlideshow(); //Start display of block
    },
    
    rollSlideshow(){
        let thoseBlocks;
        
        if (blockPassIndex == lastBlockPassIndex && lastBlockPassNbr != 0 ){ //check if its the last pass
            thoseBlocks = blockDiv.slice(blockPassIndex*3,blockPassIndex*3+lastBlockPassNbr); //in those blocks put elements between x and y index
        }
        else {
            thoseBlocks = blockDiv.slice(blockPassIndex*3,blockPassIndex*3+3);
        }
    
        let timing = frameTimers.get(blockName) * thoseBlocks.length; //Get current block timer * number of elements to display
        thoseBlocks.css("display","grid"); //Display current blocks elements

        if(blockPassIndex >lastBlockPassIndex){ //check if it's the last pass
            blockPassIndex=0;
            clearTimeout(blockTimer);
            blockDiv.css("display","none");
            frameValidDiv.get(blockName).css("display","none");
            frame.roll();
        }
        else {
            blockPassIndex++;

            blockTimer = setTimeout(function(){ 
                thoseBlocks.css("display","none"); //Remove previous blocks
                frame.rollSlideshow(); //start again
            }, timing*1000);
        }
    },

    animateIn(element) {
        
    },
    animateOut(element) {
        
    }
}