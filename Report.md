## Exercise 01
Maximum brightness value (max_bright) ~ 560\
Minimum brightness value (min_bright) ~ 53600\
Image of output and setup in 'media' folder.

## Exercise 02
Code in 'code' folder as Exercise_02.py.\
Video in 'media' folder as Exercise_02_MusicVideo.mov.\

## Exercise 03
Code and .json files for Exercise 3 in 'code/Exercise_03' folder. \
Demo videos and screenshots in 'media' folder.
### Design
- Full stack web application
- React/Vite frontend, Python/Flask backend
- Utilize REST API's to communicate information via HTTP requests
- Store data in Firebase Realtime Database with Google Authentication

### Demo Video (media/Exercise03_Demo_Video.md)
1) In the demonstration video, we start by logging into an account with pre-existing response time data. This data can be seen in the Firebase Realtime Database.
2) Under the same user, a new game is played. The data is updated for the new game upon completion both in the database and in the web application. 
3) Then, a new user logs in with no pre-existing data. Thus, no data is displayed on the web application and in the database for their specific user ID. The new user logs in and plays the game. 4)
4) Their data is uploaded to the database and updated in the web application.
5) The new user then logs out and we return to the original user. The original user still retains their respective response time data rather than that of the new user.

### Game Video (media/Exercise03_Game_Video.md)
This video shows the response time game being played on the Raspberry Pi Pico. The response time data is updated in the database and in the web application. \
Note: This video was taken directly after the Demo Video described above.

For all exercises, Visual Studio Code is used.

