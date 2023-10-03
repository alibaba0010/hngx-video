# upload video to disk storage

## Live Endpoint at https://video-upload-fcxi.onrender.com

### Task:

Develop an API for a chrome screen recorder extension.

### Objective

Build an API capable of storing a video from a chrome screen recorder extension, save it to the file system and render the page with the video for playing. the API should also be able to get a transcript of the video.

#### API Development

Develop an API with endpoints for:

<ol>
<li>UPLOAD: Adding a video to the file system.</li>
<li>GET: Get the video from storage</li>
<li>TRANSCRIBE: Get the transcript of the video</li>
</ol>

## Project Setup

#### Clone the repository

```
git clone https://github.com/alibaba0010/hngx-video


#### Install all dependencies

```

npm install

```

## Run Project

```

npm start

```

## API Testing

The following table shows overview of the APIs that will be exported:

- GET `/` post create a video id
- POST `/videos` upload videos at intervals
- POST `/videos/end` for final saving of the video and joining the differnet chunks together using buffers
- GET `/videos/:id` get video from storage
- GET `transcript/:id` get transcript of video
```
