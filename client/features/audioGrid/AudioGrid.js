import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Container } from "@mui/material";
import { Readable } from "stream";

import { useDispatch, useSelector } from "react-redux";
import {
  uploadFileRequest,
  fetchSongSectionsAsync,
  createSectionAsync,
  deleteSectionAsync,
  createSection,
  deleteSection,
  selectSong,
  selectSongSections,
} from "./audioGridSlice";
import Audio from "../audio/Audio";
import TrackHeader from "../trackHeader/TrackHeader";
import AddNewPlayer from "../addNewPlayer/AddNewPlayer";
import { Record } from "../addNewPlayer/AddNewPlayer";

function createAudioElement() {
  return document.createElement("audio");
}

let stream;
let recorder;
let blob;
let audioURL;
const audio = document.createElement("audio");
audio.controls = true;

const p_and_j_audio = document.createElement("audio");
p_and_j_audio.src = "02 - Pride and Joy.mp3";
p_and_j_audio.load();

export const AudioGrid = (props) => {
  // songId will be a prop
  // hardcoded for now
  const songId = 1;
  ////////////////////////

  const dispatch = useDispatch();
  let song = useSelector(selectSong);
  const sections = useSelector(selectSongSections);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchSongSectionsAsync(songId));
    };
    fetchData();
  }, [dispatch]);

  async function addNewPlayer() {
    const nextSectionNum = sections.length + 1;
    const payload = {
      songId,
      label: `Section ${nextSectionNum}`,
      start: 0,
      end: song.duration,
      playbackRate: 1.0,
      loop: false,
    };
    dispatch(createSectionAsync(payload));
    payload["inMemoryId"] = sections.length;
    console.log(payload.inMemoryId);
    dispatch(createSection(payload));
  }

  async function deletePlayer(sectionId, inMemoryId) {
    sectionId = Number(sectionId);
    inMemoryId = Number(inMemoryId);
    if (sectionId) dispatch(deleteSectionAsync(sectionId));
    dispatch(deleteSection(inMemoryId));
  }

  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const chunks = [];

/*   async function allowMicrophone() {
    console.log("hello");
  } */

  async function record() {
    console.log(stream);
    console.log(recorder);
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);
    }
    if (recorder.state === "inactive") {
      console.log("recorder.state: ", recorder.state);
      console.log("starting....");
      //p_and_j_audio.play();
      recorder.start();
      setRecording(true);
    } else if (recorder.state === "recording") {
      console.log("stopping...");
      recorder.stop();
      setRecording(false);
      p_and_j_audio.pause();
      p_and_j_audio.currentTime=0
    }

    recorder.onstart = () => {
      p_and_j_audio.currentTime=0
      p_and_j_audio.play();
    }

    recorder.onstop = async (e) => {
      console.log("data available after MediaRecorder.stop() called.");

      const audio = document.createElement("audio");
      console.log("chunks", chunks);

      // const blob = new Blob(chunks, {
      //   type: "audio/mp3",
      //   // type: "audio/mpeg-3";
      // });

      const MIME_TYPE = "audio/mpeg"
      //blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

      blob = new Blob(chunks, { type: MIME_TYPE });

      // let file = new File([chunks], "abc.blob");
      // console.log("file", file);

      dispatch(uploadFileRequest(blob));

      audioURL = window.URL.createObjectURL(blob);

      console.log('zzzzzzzzzz trying to download audio file locally')
      const downloadElement = document.getElementById('audioDownload')
      const anchorRef = document.createElement('a')
      anchorRef.id = 'audioURL'
      anchorRef.download = "audioTest.mp3"
      anchorRef.href = audioURL
      anchorRef.dataset.downloadurl = [MIME_TYPE,anchorRef.download,anchorRef.href].join(':')
      downloadElement.appendChild(anchorRef)
      anchorRef.click()

      audio.src = audioURL;

      audio.currentTime=0
      audio.play();
      p_and_j_audio.currentTime=0
      p_and_j_audio.play();

      // audio.play();
      // audio.load();

      console.log("recorder stopped");
      console.log("audio.src", audio.src);
      console.log("audioURL", audioURL);

    };

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
  }

  async function playPause() {
    console.log("audioURL", audioURL);
    if (audioURL) audio.src = audioURL;
    console.log("paused? ", audio.paused);
    p_and_j_audio.load();
    console.log("audio.src", `itshere{${audio.src}}<--`);
    console.log("audioURL", audioURL);
    if (!audio.src) return;

    console.log("audio.paused", audio.paused);
    if (playing) {
      audio.pause();
      setPlaying(false);
      console.log("playing.....");
      p_and_j_audio.pause();
    } else {
      await audio.play();
      setPlaying(true);
      p_and_j_audio.load();
      p_and_j_audio.play();
    }
  }

  return (
    <Container>
      <Grid container columns={1} rowSpacing={2}>
        <Grid item md={1}>
          <TrackHeader song={song} />
        </Grid>

        <Grid item md={1}>
          <Grid container spacing={2} columns={2} rowSpacing={2}>
            {sections.map((section, i) => (
              <Grid key={i} item sm={2} md={1}>
                <Audio
                  song={song}
                  section={section}
                  audio={createAudioElement()}
                  deletePlayer={deletePlayer}
                />
              </Grid>
            ))}
            <Grid item sm={2} md={1}>
              <AddNewPlayer addNewPlayer={addNewPlayer} />
            </Grid>
            <Grid item sm={2} md={1}>
              <Record
                record={record}
                recording={recording}
                playing={playing}
                playPause={playPause}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
