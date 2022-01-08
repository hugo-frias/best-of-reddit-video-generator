# Best of Reddit Video Generator
This is a JavaScript project that generates a video with the top posts in a certain timeframe from a certain subreddit, and uploads it to youtube.

# How it works

1. The program will ask you to enter the subReddit from which you want to retrieve the top videos.
2. The program will ask you the timeframe for the posts (top posts of the last hour, top posts of the last day, week, etc.)
3. The program will download the top posts of the subReddit you chose in the timeframe specified as long as they meet certain requirements (the videos can't contain NSFW elements, they must be videos, can't be longer then one minute, etc.). Those requirements can be changed in the .env file.
4. After downloading the video-clips, the program will individually merge their audio and video, check their resolutions (applying lateral borders if it isn't 16:9) and adding the title of the posts to the videos.
5. The program will create a list with all the fully edited clip files, which will then be merged into a single final video.
6. The program will request the user to authenticate with his youtube account in order to upload the final video to the selected channel. It will ask the user to insert the title of the video and then it will create a description linking the posts used (with the authors, titles and links to the posts themselves), apply certain tags to the video, and upload it to youtube, adding it afterwards to the playlist matching the subReddit used (creating the playlist if it doesn't already exist)

# Main frameWorks and libraries used

- FFMPEG for ..
- Googleapis

# Requirements

- FFMPEG instalation (PS: You may need to add the FFMPEG folder to the environment variables, [tutorial]{http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/})
- You need a JSON file with your oAuth credentials for the youtube uploading. You can obtain it on Google Cloud, on APIs & Services, Credentials
