import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";
import { Box } from "@mui/material";
import { Widget } from "../widget/Widget";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MicIcon from "@mui/icons-material/Mic";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function AddNewPlayer({ addNewPlayer }) {
  return (
    <Widget>
      <CardActionArea onClick={addNewPlayer}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add New Player
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <AddRoundedIcon
              sx={{
                fontSize: "150px",
                marginTop: "50px",
                marginBottom: "70px",
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Widget>
  );
}

export function Record({ record, recording, playPause, playing }) {
  return (
    <Widget>
      {/* <Button variant="contained" onClick={allowMicophone}>
        Allow microphone use
      </Button> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Record
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center">
          <CardActionArea onClick={record}>
            {recording ? (
              <MicIcon
                sx={{
                  fontSize: "150px",
                  marginTop: "50px",
                  marginBottom: "70px",
                  color: "red",
                }}
              />
            ) : (
              <MicIcon
                sx={{
                  fontSize: "150px",
                  marginTop: "50px",
                  marginBottom: "70px",
                }}
              />
            )}
          </CardActionArea>
          <CardActionArea onClick={playPause}>
            {playing ? (
              <PauseIcon
                sx={{
                  fontSize: "150px",
                  marginTop: "50px",
                  marginBottom: "70px",
                }}
              />
            ) : (
              <RestartAltIcon
                sx={{
                  fontSize: "150px",
                  marginTop: "50px",
                  marginBottom: "70px",
                }}
              />
            )}
          </CardActionArea>
        </Box>
      </CardContent>
    </Widget>
  );
}
