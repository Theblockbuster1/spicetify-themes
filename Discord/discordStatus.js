var prevProgressBarTime; //remember progress time from previous refresh

//Create status icons and start observing after friends are loaded
waitForElement([".main-buddyFeed-addFriendPlaceholder", ".main-buddyFeed-avatarContainer", ".main-avatar-avatar", ".main-buddyFeed-artistAndTrackName", ".playback-bar__progress-time"], (queries) => {
    CreateStatusIcons(); //create status

    setInterval(RefreshStatus, 31000); //refresh statuses every 61sec (31 so it's less propable to prevProgressBarTime and currProgressBarTime will be the same during playback)
});


//Add discord status child
function CreateStatusIcons()
{
    let avatars = document.getElementsByClassName("main-avatar-avatar");
    for(let i=0; i<avatars.length; i++)
    {
        let statusIcon = document.createElement('div');

        statusIcon.className = 'discord-status hidden';
     
        avatars[i].appendChild(statusIcon);
    }

    RefreshStatus(); //Refresh statuses after created icons
}

//Refresh friends status
function RefreshStatus() 
{
    let online = document.getElementsByClassName("spoticon-now-playing-active-16"); //all currently listening friends
    let timestamps = document.getElementsByClassName("main-buddyFeed-timestamp"); //all timestamps

    let allAvatars = document.getElementsByClassName("main-avatar-avatar"); //all avatars
    let friendsAvatars = []; //friends avatars
    let userAvatars = []; //user avatar

    let currProgressBarTime = document.getElementsByClassName("playback-bar__progress-time")[0].innerHTML; //progress time bar

    //cycle through all avatars
    for(i=0; i<allAvatars.length; i++)
    {
        //find friends avatars
        if(allAvatars[i].parentNode.classList.contains("main-buddyFeed-avatarContainer"))
        {
            friendsAvatars.push(allAvatars[i]); 
        }

        //find user avatars
        else if(allAvatars[i].parentNode.classList.contains("main-userWidget-box")) 
        {
            userAvatars.push(allAvatars[i]); 
        }
    }

    //friends avatars
    for(i=0; i<friendsAvatars.length; i++)
    {
        //set online if is listening
        if(online.length > i)
        {
            //console.log(i + " " + friendsAvatars[i].title + " online");

            let statusIcons = friendsAvatars[i].getElementsByClassName("discord-status");
            if(statusIcons.length > 0)
            {
                statusIcons[0].className = 'discord-status online';
            }

            friendsAvatars[i].style.opacity = 1; 
        }

        else
        {
            //set away if didn't listen for less than an hour
            if(timestamps[i].children[0].innerHTML.includes("min"))
            {
                //console.log(i + " " + friendsAvatars[i].title + " away");

                let statusIcons = friendsAvatars[i].getElementsByClassName("discord-status");
                if(statusIcons.length > 0)
                {
                    statusIcons[0].className = 'discord-status away';
                }

                friendsAvatars[i].style.opacity = 1; 
            }

            //set offline
            else
            {
                //console.log(i + " " + friendsAvatars[i].title + " offline");
                
                let statusIcons = friendsAvatars[i].getElementsByClassName("discord-status");
                if(statusIcons.length > 0)
                {
                    statusIcons[0].className = 'discord-status hidden';
                }

                friendsAvatars[i].style.opacity = 0.3; //gray out offline friends
            }        
        }
    }

    //user avatars
    for(i=0; i<userAvatars.length; i++)
    {
        //listening, set online
        if(currProgressBarTime != prevProgressBarTime) //if progress time changed from previous refresh set user icon to online (listening)
        {
            //console.log(i + " " + userAvatars[i].title + " online");

            let statusIcons = userAvatars[i].getElementsByClassName("discord-status");
            if(statusIcons.length > 0)
            {
                statusIcons[0].className = 'discord-status online';
            }

            prevProgressBarTime = currProgressBarTime;
        }

        //progress time didn't change, not listening, set away
        else
        {
            //console.log(i + " " + userAvatars[i].title + " away");

            let statusIcons = userAvatars[i].getElementsByClassName("discord-status");
            if(statusIcons.length > 0)
            {
                statusIcons[0].className = 'discord-status away';
            }
        }
    }
}


function waitForElement(els, func, timeout = 100) {
    const queries = els.map(el => document.querySelector(el));
    if (queries.every(a => a)) {
        func(queries);
    } else if (timeout > 0) {
        setTimeout(waitForElement, 300, els, func, --timeout);
    }
}