const URL = "https://twitter-clone-api-one.vercel.app/tweets";

let nextPageUrl=null;
/**
 * Retrive Twitter Data from API
*/


const onEnter = (e) => {
    if (e.key == 'Enter') {
        getTwitterData();
    }

}
const onNext=()=>{
    if (nextPageUrl) {
        getTwitterData(true);
        
    }
}


const getTwitterData = (nextPage=false) => {
    let query = document.querySelector('#user-search-input').value.toLowerCase();

    if (!query) return;
    const encodedQuery = encodeURIComponent(query);
    let url = `${URL}?q=${encodedQuery}&count=10&resultType=mixed`;
    if (nextPage&& nextPageUrl) {
        url=nextPageUrl;
        // console.log(url);
    }
    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        buildTweets(data.statuses,nextPage);
        saveNextPage(data.search_metadata);
        nextPageButtonVisibility(data.search_metadata)
    })
}

// getTwitterData();
// console.log(getTwitterData().data);
/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
    // console.log(metadata);
     if (metadata.next_results) {
        nextPageUrl=`${URL}${metadata.next_results}`
        console.log(nextPageUrl);
     }else{
        nextPageUrl=null;
     }
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    let text=e.innerText;
    document.getElementById("user-search-input").value=text;
    getTwitterData()
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
    if (metadata.next_results) {
        document.getElementById("next_page").style.visibility='visible';
    }else{
        document.getElementById("next_page").style.visibility='hidden';
    }
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
    // console.log(tweets.entities.media.media_url);
    let twitterContent = "";
    tweets.map((tweet) => {
        const createdDate=moment([2007, 0, 29]).fromNow()
        let tweet_img = tweet.user.profile_image_url_https;
        twitterContent += `
        <div class="tweet-container">
                    <div class="tweet-user-info">                         
                        <div class="user-profile-image--container">
                            <div class="user-profile-image">
                            <img src="${tweet_img}">
                            </div>
                        </div>
                        <div class="user-information-container">
                            <div class="user-profile-name">${tweet.user.name}</div>
                            <div class="user-twitter-handle"> @${tweet.user.screen_name}</div>
                        </div>
                    </div>
                    `
        if (tweet.extended_entities
            && tweet.extended_entities.media
            && tweet.extended_entities.media.length > 0) {
            twitterContent += buildImages(tweet.extended_entities.media);
            twitterContent += buildVideo(tweet.extended_entities.media);
        } else { console.log("bhsg ") }
        twitterContent +=
            `<div class="tweet-text-container">
                     ${tweet.full_text}
                    </div>
                    <div class="tweet-date-container">
                    ${createdDate}         
                    </div>
         </div>`
        // console.log(tweet.extended_entities);
        // console.log(tweet_img);
    })
    if(nextPage){

        document.querySelector('.tweet-list').insertAdjacentHTML("beforeend",twitterContent)
    }else{
    document.querySelector('.tweet-list').innerHTML = twitterContent;
    }

}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {

    let imagesContent = `<div class="tweet-image-container">`;
    let imagesExist = false;
    mediaList.map((media) => {
        if (media.type == "photo") {
            imagesContent += `
            <div class="tweet-image" style="background-image: url('${media.media_url_https}');"></div>
            `
            imagesExist = true;
        }
        console.log(media.media_url_https);
        console.log(media.type);
    })
    imagesContent += `</div>`;
    return (imagesExist ? imagesContent : '');
    // return imagesContent;
}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {

    let videoContent = `<div class="tweet-video-container">`;
    let videoExist = false;
    mediaList.map((media) => {
        if (media.type == "video") {
            const videoVariants=media.video_info.variants.find((variant)=>variant.content_type=="video/mp4")
            videoContent += `
            <video src="${videoVariants.url}" controls></video>
            `
            videoExist = true;
        }else if(media.type== "animated_gif"){
            videoContent += `
            <video src="${media.video_info.variants[0].url}" loop autoplay></video>
            `
            videoExist = true;
        }
        // console.log(media.media_url_https);
        console.log(media.type);
    })
    videoContent += `</div>`;
    return (videoExist ? videoContent : '');
    // return imagesContent;
}
// console.log("khkhki");