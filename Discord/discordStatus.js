var prevProgressBarTime; //remember progress time from previous refresh

//Create status icons and start observing after friends are loaded
waitForElement([".main-buddyFeed-addFriendPlaceholder", ".main-buddyFeed-avatarContainer", ".main-avatar-avatar", ".main-buddyFeed-artistAndTrackName", ".playback-bar__progress-time"], (queries) => {
    prevProgressBarTime = document.getElementsByClassName("playback-bar__progress-time")[0].innerHTML; //save progress time
    
    CreateStatusIcons(); //create status

    setInterval(RefreshStatus, 61000); //refresh statuses every 61sec (61 so it's less propable to prevProgressBarTime and currProgressBarTime will be the same during playback)
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
    let avatars = document.getElementsByClassName("main-avatar-avatar"); //all avatars
    let currProgressBarTime = document.getElementsByClassName("playback-bar__progress-time")[0].innerHTML; //progress time bar

    for(i=0; i<avatars.length; i++)
    {
        //user avatar
        if(i == 0)
        {
            //listening, set online
            if(currProgressBarTime != prevProgressBarTime) //if progress time changed from previous refresh set user icon to online (listening)
            {
                //console.log(i + " " + avatars[i].title + " online");

                let statusIcons = avatars[i].getElementsByClassName("discord-status");
                if(statusIcons.length > 0)
                {
                    statusIcons[0].className = 'discord-status online';
                }

                prevProgressBarTime = currProgressBarTime;
            }

            //progress time didn't change, not listening, set away
            else
            {
                //console.log(i + " " + avatars[i].title + " away");

                let statusIcons = avatars[i].getElementsByClassName("discord-status");
                if(statusIcons.length > 0)
                {
                    statusIcons[0].className = 'discord-status away';
                }
            }
        }

        //set online if is listening
        else if(online.length > i-1) //include all online and user profile (i-1 allows script to include users profile in status appending)
        {
            //console.log(i + " " + avatars[i].title + " online");

            let statusIcons = avatars[i].getElementsByClassName("discord-status");
            if(statusIcons.length > 0)
            {
                statusIcons[0].className = 'discord-status online';
            }

            avatars[i].style.opacity = 1; 
        }

        else
        {
            //set away if doesn't listen for less than an hour
            if(timestamps[i-1].children[0].innerHTML.includes("min") && timestamps[i-1].children.length > 0) //i-1 allows script to include users profile in status appending
            {
                //console.log(i + " " + avatars[i].title + " away");

                let statusIcons = avatars[i].getElementsByClassName("discord-status");
                if(statusIcons.length > 0)
                {
                    statusIcons[0].className = 'discord-status away';
                }

                avatars[i].style.opacity = 1; 
            }

            //set offline
            else
            {
                //console.log(i + " " + avatars[i].title + " offline");
                
                let statusIcons = avatars[i].getElementsByClassName("discord-status");
                if(statusIcons.length > 0)
                {
                    statusIcons[0].className = 'discord-status hidden';
                }

                avatars[i].style.opacity = 0.3; //gray out offline friends
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