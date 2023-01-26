const express = require("express");
const router = require("express").Router();
const { Readable } = require("stream");
const audioEncoder = require("audio-encoder");
const fileSaver = require("file-saver");
const fs = require("fs");
const multer  = require('multer');
const upload = multer();

const {
  models: { Section },
} = require("../db");
module.exports = router;

//router.post("/", express.raw({ type: "*/*" }), async (req, res, next) => {
router.post("/", upload.single('audiofile'), async (req, res, next) => {
//router.post("/", async (req, res, next) => {
  try {
    console.log("######");
    console.log("######");
    //console.log(req);
    console.log("######");
    console.log("######");

    const {buffer: audiofile } = req.file

    console.log('zzzzzzzzzzzz')
    console.log(audiofile)

    fs.open('audioText.mp3','w+', (err,fd)=>{
      fs.writeFile(fd,audiofile,(err)=>{
        fs.close(fd, (err)=>{
          res.status(201).send('audioText.mp3')
        })
      })
    })

    // const fileStream = fs.createWriteStream("test");
    // fileStream.write(Buffer.from(new Uint8Array(req.body)));

    //const b = Buffer.from(req.body);
    //const abc = b.toString();

    //console.log("abc", abc);
    // audio-file
    // console.log("@@@yyjj");
    // console.log(b.length);
    // console.log("@@@yyjj");
    // res.status(201).json({});

    // audioEncoder(b, 128, null, function onComplete(blob) {
    //   fileSaver.saveAs(blob, "sound.mp3");
    // });

    ///////////////////////
    ///////////////////////
    // const _audio = new Blob([req.body], { type: "audio/webm" });
    // const buffer = Buffer.from(await _audio.arrayBuffer());
    // const readStream = Readable.from(buffer);

    // const writeStream = fs.createWriteStream("recording.mp3");
    // readStream.pipe(writeStream).on("finish", () => {
    //   console.log("🎵 audio saved");
    // });
    ///////////////////////
    ///////////////////////
  } catch (err) {
    next(err);
  }
});

// router.post("/", async (req, res, next) => {
//   try {
//     const { songId, label, start, end, playbackRate, loop } = req.body;
//     const section = await Section.create({
//       songId,
//       label,
//       start,
//       end,
//       playbackRate,
//       loop,
//     });
//     res.status(201).json(section);
//   } catch (err) {
//     next(err);
//   }
// });

router.delete("/:sectionId", async (req, res, next) => {
  try {
    console.log("helllo im here");
    console.log(req.params.sectionId, "sectionId");
    const section = await Section.findByPk(req.params.sectionId);
    await section.destroy();
    res.status(202).json(section);
  } catch (err) {
    next(err);
  }
});
