import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os
import uuid

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.get("/download")
async def download_video(url: str, format_type: str = "mp4"):
    """
    Endpoint to download a video and return the file.
    Usage: /download?url=VIDEO_URL&format_type=mp4
    """
    unique_id = str(uuid.uuid4())[:8]
    output_template = f"{DOWNLOAD_DIR}/{unique_id}_%(title)s.%(ext)s"
    
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best' if format_type == "mp4" else 'bestaudio/best',
        'outtmpl': output_template,
        'noplaylist': True,
    }

    if format_type == "mp3":
        ydl_opts.update({
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        })

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            # Find the actual filename (yt-dlp handles extension changes like .webm to .mp4)
            filename = ydl.prepare_filename(info)
            if format_type == "mp3":
                filename = filename.rsplit('.', 1)[0] + ".mp3"
            
            return FileResponse(
                path=filename, 
                filename=os.path.basename(filename),
                media_type='application/octet-stream'
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

